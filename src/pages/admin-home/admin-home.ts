import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { CreateEventPage } from '../create-event/create-event';
import { RegisterUstazPage } from '../register-ustaz/register-ustaz';
import { NotificationPage } from '../notification/notification';
import { HttpService } from "../../app/service/http-service";
import {Events} from "../../app/models/Events";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";


/**
 * Generated class for the AdminHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  nickname:string = "";
  userData;
  events:Array<Events> = [];
  eventsSize:number = 0;
  constructor(public navCtrl: NavController, public httpService:HttpService, public global:Globals) {
    this.httpService.findEvents().subscribe(data => {
      this.events = data;
      if( data ){
        this.eventsSize = data.length;
      }
    })

    this.global.get(AppConstants.USER).then(data => {
      if( data){
        this.userData = data;
        this.nickname = this.userData.nickname;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  eventdetailsPage(mosqueEvent:Events, index){
    this.navCtrl.push(EventDetailsPage,{'data':mosqueEvent,
      callback: data => {
        if (data) {
          this.events[index].event_title = data.event_title;
          this.events[index].category = data.category;
          this.events[index].event_start_date = data.event_start_date;
          this.events[index].event_end_date = data.event_end_date;
          this.events[index].quota = data.quota;
          this.events[index].event_description = data.event_description;
          this.events[index].event_status = data.event_status;
        }
      }
    })
  }
  createeventPage(){
    this.navCtrl.push(CreateEventPage)
  }
  createustazPage(){
    this.navCtrl.push(RegisterUstazPage)
  }
  notificationPage(){
    this.navCtrl.push(NotificationPage)
  }
  public getEventDate(event_date:string):string{
    var date = null;
    if( event_date ){
        try{
           var eventdate = new Date(event_date);
           date = eventdate.getDate()+"/"+(eventdate.getMonth()+1)+"/"+eventdate.getFullYear()+" "+eventdate.getUTCHours()+":"+eventdate.getMinutes();
        }catch(e){

        }
    } else {
        var today = new Date();
        date = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear()+" "+today.getUTCHours()+":"+today.getMinutes();
    }

    return date;
  }

  getSeatsLeft(event:Events):number{
    return (event.quota - event.users.length);
  }
}
