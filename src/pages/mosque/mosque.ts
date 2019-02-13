import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { FeedbackPage } from '../feedback/feedback';
import { FeedbackAltPage } from '../feedback-alt/feedback-alt';
import { InfaqPage } from '../infaq/infaq';
import { KhairatPage } from '../khairat/khairat';
import { AskPage } from '../ask/ask';
import { HttpService } from "../../app/service/http-service";
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { User } from "../../app/models/User";
import { Mosques } from '../../app/models/Mosques';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-mosque',
  templateUrl: 'mosque.html'
})
export class MosquePage {
  events: Array<MosqueEvent> = [];
  eventsSize: number = 0;
  user: Array<User> = [];
  address: string = "";
  updated: string = "";
  mosque: Mosques;
  constructor(public navCtrl: NavController, public httpService: HttpService, public navParams: NavParams, public iab: InAppBrowser, public platform: Platform) {
    this.mosque = navParams.get('data');
    this.httpService.findEventsByMosque(this.mosque._id).subscribe(data => {
      this.events = data;
      if (data) {
        this.eventsSize = data.length;
      }
    }, error => {
      console.log(error)
    })
  }

  eventdetailsPage(event: MosqueEvent, index) {
    this.navCtrl.push(EventDetailsPage, {
      'data': event,
      callback: data => {
        if (!data.joined) {
          this.events[index].users.splice(data.userId, 1);
        } else {
          this.events[index].users.push(data.userId);
        }
      }
    });
  }

  public getEventDate(event_date: string): string {
    var date = null;
    if (event_date) {
      try {
        var eventdate = new Date(event_date);
        date = eventdate.getDate() + "/" + (eventdate.getMonth() + 1) + "/" + eventdate.getFullYear() + " " + eventdate.getUTCHours() + ":" + eventdate.getMinutes();
      } catch (e) {

      }
    } else {
      var today = new Date();
      date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getUTCHours() + ":" + today.getMinutes();
    }

    return date;
  }
  feedbackPage() {
    this.navCtrl.push(FeedbackPage)
  }
  feedbackAltPage() {
    this.navCtrl.push(FeedbackAltPage)
  }
  infaqPage() {
    // this.navCtrl.push(InfaqPage)
    const browser = this.iab.create('https://app.senangpay.my/payment/898154475783162');
    browser.show();
  }
  khairatPage() {
    this.navCtrl.push(KhairatPage, {
      "mosqueGooglePlaceId": (this.mosque._id) ? this.mosque._id : '',
      "mosqueTitle": (this.mosque.title) ? this.mosque.title : ''
    })
  }
  askUstazPage() {
    this.navCtrl.push(AskPage)
  }

  getSeatsLeft(event: MosqueEvent): number {
    return (event.quota - event.users.length);
  }

  openMap(event: MosqueEvent) {
    if (this.platform.is('ios')) {
      window.open('maps://?q=' + this.mosque.title, '_system');
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + this.mosque.title, '_system');
    }
  }

  // openMap(url){
  //   let generatedUrl='https://www.google.com/maps/place/?q=place_id:'+((this.mosque.google_place_id)?this.mosque.google_place_id:this.mosque._id);

  //   if(url){
  //     generatedUrl = url
  //   }
    
  //   const browser = this.iab.create(generatedUrl , '_self', 'location=yes');
  //   browser.show();
    
  //   browser.on('loadstart').subscribe((ev: InAppBrowserEvent) => {
  //     if(ev.url.indexOf("http://intent://")!=-1){
  //       if(this.platform.is('android')){
  //         var urlParts = ev.url.split("intent");
  //         var finalUrl = "http://"+urlParts[1];
  //         const browser = this.iab.create(finalUrl, '_system', 'location=yes');
  //       }else{
  //         const browser = this.iab.create(ev.url, '_system', 'location=yes');
  //       }
  //       browser.close();
  //       setTimeout(()=>{
  //         this.openMap(generatedUrl);
  //       },100);
  //     }else{
  //       generatedUrl = ev.url;
  //     }
  //   });
  // }
}