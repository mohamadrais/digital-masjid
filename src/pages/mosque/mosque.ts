import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { FeedbackPage } from '../feedback/feedback';
import { FeedbackAltPage } from '../feedback-alt/feedback-alt';
import { InfaqPage } from '../infaq/infaq';
import { KhairatPage } from '../khairat/khairat';
import { AskPage } from '../ask/ask';
import { HttpService } from "../../app/service/http-service";
import {Events} from "../../app/models/Events";
import {User} from "../../app/models/User";
import { Mosques } from '../../app/models/Mosques';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-mosque',
  templateUrl: 'mosque.html'
})
export class MosquePage {
  events:Array<Events> = [];
  eventsSize:number = 0;
  user:Array<User> = [];
  address:string = "";
  updated:string = "";
  mosque:Mosques;
  constructor(public navCtrl: NavController, public httpService:HttpService,public navParams:NavParams, public iab: InAppBrowser) {
    this.mosque = navParams.get('data');
    this.httpService.findEventsByMosque(this.mosque._id).subscribe(data => {
      this.events = data;
      if( data ){
        this.eventsSize = data.length;
      } 
    }, error => {
      console.log(error)
    })
  }

  eventdetailsPage(event:Events){
    this.navCtrl.push(EventDetailsPage,{'data':event});
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
  feedbackPage(){
    this.navCtrl.push(FeedbackPage)
  }
  feedbackAltPage(){
    this.navCtrl.push(FeedbackAltPage)
  }
  infaqPage(){
    // this.navCtrl.push(InfaqPage)
    const browser = this.iab.create('https://app.senangpay.my/payment/898154475783162');
    browser.show();
  }
  khairatPage(){
    this.navCtrl.push(KhairatPage,{"mosqueGooglePlaceId":(this.mosque._id)?this.mosque._id:''})
  }
  askUstazPage(){
    this.navCtrl.push(AskPage)
  }

  getSeatsLeft(event:Events):number{
    return (event.quota - event.users.length);
  }
}