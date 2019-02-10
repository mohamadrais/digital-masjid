import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Slides } from 'ionic-angular';
import {HomePage} from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';
import {LocationsProvider } from '../../providers/locations/locations';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { Observable } from 'rxjs/Rx';
import { AppConstants } from "../../app/constants/app-constants";
import { User } from '../../app/models/User';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  @ViewChild("slides") slides:Slides;
  currentdate = new Date();
  currDatetime = Date.UTC(this.currentdate.getFullYear(), this.currentdate.getMonth()+1,this.currentdate.getDate(), this.currentdate.getHours(), this.currentdate.getMinutes() );

  eventsToBeAttended: Array<MosqueEvent> = [];
  userId;

  segment="0";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loc: LocationsProvider, public httpService:HttpService, public global:Globals, public event: Events) {

    this.global.get(AppConstants.USER).then(data => {
      if(data){
        this.userId = data._id;
        this.getEventsToAttend(); 
      }
    });
  }

  // compareDtm(eventStartTime, eventEndTime){
  //   return (parseFloat(this.currDatetime.toString()) >= parseFloat(this.eventStartTime.toString()) && parseFloat(this.currDatetime.toString()) < parseFloat(this.endDtmReformat.toString()))
  // }

  getEventsToAttend(){
    this.httpService.getEventsToAttend(this.userId).subscribe(data=>{
      if((data && data.length>0) || (data.status.toLowerCase() != "failure")){
        this.eventsToBeAttended = data;  
      }
    })
  }
  

  validateAttendance(index){
    this.validateDistance(this.eventsToBeAttended[index]).subscribe(data => {
      if(data.isDistanceNearby){
        this.httpService.userAddPoints(this.userId, this.eventsToBeAttended[index].points.toString(), this.eventsToBeAttended[index]._id).subscribe(data =>{
          if(data.pointsCollected){
            alert("Alhamdulillah. You have gained "+this.eventsToBeAttended[index].points+" points.");
            this.navCtrl.pop();
          }else{
            alert("Something went wrong. Please contact Digital Masjid App admin");
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
        let isDistanceNearby = (parseFloat(locationEventMosque.distance) <= 0.2)
        observer.next({"isDistanceNearby":isDistanceNearby, "distance":(parseFloat(locationEventMosque.distance) - 0.2)});
        observer.complete();
      });
    });
    
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
    // this.event.subscribe("notification:updateView", data =>{
    //   let customData2 = (JSON.parse(data.customData));
    //   let notificationType2 = customData2.notificationType;
    //   if(notificationType2 == AppConstants.NOTIFICATION_TYPE_EVENT_CANCEL){
    //     this.slides.slideTo(2);
    //   }else if(notificationType2 == AppConstants.NOTIFICATION_TYPE_EVENT_RESCHEDULE){
    //     this.slides.slideTo(1);
    //   }
    // });
  }

  homePage(){
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage(){
    this.navCtrl.setRoot(AdminHomePage)
  }
}
