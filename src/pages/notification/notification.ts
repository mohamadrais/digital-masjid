import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, Slides } from 'ionic-angular';
import {HomePage} from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';
import {LocationsProvider } from '../../providers/locations/locations';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { Observable } from 'rxjs/Rx';
import { AppConstants } from "../../app/constants/app-constants";
import { Notification } from "../../app/models/Notification";
import { EventDetailsPage } from '../event-details/event-details';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  @ViewChild("slides") slides:Slides;
  currentdate = new Date();
  currDatetime = Date.UTC(this.currentdate.getFullYear(), this.currentdate.getMonth()+1,this.currentdate.getDate(), this.currentdate.getHours(), this.currentdate.getMinutes() );

  eventsToBeAttended: Array<MosqueEvent> = [];
  eventsRescheduled: Array<Notification> = [];
  eventsCancel: Array<Notification> = [];
  userId;

  segment="0";

  unreadCancelCount=0;
  unreadRescheduleCount=0;
  toAttendCount=0

  eventIdArray:Array<any>=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loc: LocationsProvider, public httpService:HttpService, public global:Globals, public event: Events) {

    this.userId = this.global.getUserId()
    this.getEventsToAttend();
    this.getNotification();
  }

  // compareDtm(eventStartTime, eventEndTime){
  //   return (parseFloat(this.currDatetime.toString()) >= parseFloat(this.eventStartTime.toString()) && parseFloat(this.currDatetime.toString()) < parseFloat(this.endDtmReformat.toString()))
  // }

  getEventsToAttend(){
    this.httpService.getEventsToAttend(this.userId).subscribe(data=>{
      if((data && data.length>0) || (data.status && data.status.toLowerCase() != "failure")){
        this.eventsToBeAttended = data; 
      }
    })
  }
  
  getNotification(){
    this.httpService.notificationFindByUser(this.userId).subscribe(data =>{
      if((data && data.length>0) || (data.status && data.status.toLowerCase() != "failure")){

        data.forEach((event:Notification = new Notification) => {
          if(event.type == AppConstants.NOTIFICATION_TYPE_EVENT_RESCHEDULE){
            this.eventsRescheduled.push(event);
            if (event.readFlag.indexOf("N") >= 0) {
              this.unreadRescheduleCount++;
            }
          }else if(event.type == AppConstants.NOTIFICATION_TYPE_EVENT_CANCEL){
            this.eventsCancel.push(event);
            if (event.readFlag.indexOf("N") >= 0) {
              this.unreadCancelCount++;
            }
          }
        });
      }
    });
  }

  validateAttendance(index){
    this.validateDistance(this.eventsToBeAttended[index]).subscribe(data => {
      if(data.isDistanceNearby){

          this.httpService.userAddPoints(this.userId, this.eventsToBeAttended[index].points.toString(), this.eventsToBeAttended[index]._id).subscribe(data =>{
          // if(data.pointsCollected){
          if(data){
            // alert("Alhamdulillah. You have gained "+this.eventsToBeAttended[index].points+" points.");
            alert("Alhamdulillah. We have successfully marked your attendance.");
            this.navCtrl.pop();
          }else{
            alert("Something went wrong. Please contact Digital Masjid App admin.");
          }
        })

      }else{
        alert("You are out of range by "+data.distance+"km");
      }

    });
  }

  cancelReservation(index){
    this.httpService.unSubscribeEvents(this.eventsToBeAttended[index], this.userId).subscribe(data => {
      alert("You have cancelled the reservation for "+this.eventsToBeAttended[index].event_title);
      this.navCtrl.pop();
    }, error => {
      console.log("Issue occured while declining the event");
    });
  }

  validateDistance(event):Observable<any>{
    return Observable.create(observer =>{
      let res=this.loc.geocodePlaceId(event.mosque_details[0].google_place_id).subscribe(res => {
        let locationEventMosque = {
          "latitude": res.lat(),
          "longitude": res.lng(),
          "distance":''
        };
      
        this.loc.applyHaversine(locationEventMosque);
        console.log("THE DISTANCE IS: "+locationEventMosque.distance);
        let isDistanceNearby = (parseFloat(locationEventMosque.distance) <= 5.2)
        observer.next({"isDistanceNearby":isDistanceNearby, "distance":(parseFloat(locationEventMosque.distance) - 5.2)});
        observer.complete();
      });
    });
    
  }

  validateDateTime(eventId, startDtm, endDtm){
    let today = new Date().toISOString();
    if(startDtm <=today && today<endDtm){
      if(this.eventIdArray.indexOf(eventId)==-1){
        this.eventIdArray.push(eventId);
        this.toAttendCount = this.eventIdArray.length;
      }
      return true;
    }else{
      if(this.eventIdArray.indexOf(eventId)!=-1){
        this.eventIdArray.splice(this.eventIdArray.indexOf(eventId),1);
        this.toAttendCount = this.eventIdArray.length;
      }
      return false
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewDidEnter(){
    //check if there is notification data as parameter from previous page stack
    if(this.navParams.get("notification")){
      let customData = (JSON.parse(this.navParams.get("notification").customData));
      let notificationType = customData.notificationType;
      if(notificationType == AppConstants.NOTIFICATION_TYPE_EVENT_CANCEL){
        this.slides.slideTo(2);
      }else if(notificationType == AppConstants.NOTIFICATION_TYPE_EVENT_RESCHEDULE){
        this.slides.slideTo(1);
      }
    }
    //to be fixed
    this.event.subscribe("notification:updateView", data =>{
      this.getNotification();
      this.getEventsToAttend();
    });
  }

  async ionViewWillLeave() {
    await this.countUnreadByUser();
  }

  homePage(){
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage(){
    this.navCtrl.setRoot(AdminHomePage)
  }

  read(eventNoti:Notification){
    if (eventNoti.readFlag.toUpperCase() == 'N'){
      this.httpService.notificationReadUserNotification(this.userId, eventNoti._id).subscribe(res =>{
        if(res.status!="failure"){
          //do nothing yet. to be enhanced
          if(eventNoti.type == AppConstants.NOTIFICATION_TYPE_EVENT_RESCHEDULE){
            this.unreadRescheduleCount--;
          }else if(eventNoti.type == AppConstants.NOTIFICATION_TYPE_EVENT_CANCEL){
            this.unreadCancelCount--;
          }
        }
        this.navCtrl.push(EventDetailsPage, {eventId:eventNoti.customData.eventId, "fromUserFlow":true});
      })
    }
    else {
      this.navCtrl.push(EventDetailsPage, {eventId:eventNoti.customData.eventId, "fromUserFlow":true});
    }
    
  }

  async countUnreadByUser() {
    this.httpService.notificationCountUnreadByUser(this.global.getUserId()).subscribe(data => {
      if (data && data.status && data.status.toLowerCase() != "failure") {
        this.global.generalSettings.totalUnreadNotificationBellCount = data.result;
      }
    });
  }
}
