import { Component } from '@angular/core';
import { NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { FeedbackPage } from '../feedback/feedback';
import { FeedbackAltPage } from '../feedback-alt/feedback-alt';
import { InfaqPage } from '../infaq/infaq';
import { KariahPage } from '../kariah/kariah';
import { AskPage } from '../ask/ask';
import { HttpService } from "../../app/service/http-service";
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { User } from "../../app/models/User";
import { Mosques } from '../../app/models/Mosques';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { PopoverMosqueRatingPage } from './popover-mosque-rating';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";

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
  avgMosqueRating: string = "0";
  mosqueRatersCount: string = "0";
  halfStar: number = 0;
  fullStaryArray: Array<number> = [];
  emptyStarArray: Array<number> = [];
  userId: string = "";
  userType: string = "";



  constructor(public navCtrl: NavController, public httpService: HttpService, public navParams: NavParams, public iab: InAppBrowser, public platform: Platform, public global: Globals, public popoverCtrl: PopoverController) {
    this.mosque = navParams.get('data');
    this.getMosqueRating(this.mosque._id);
    // mosque._id now equals google_place_id

    this.userId = this.global.getUserId();
    this.userType = this.global.getUserType();

    this.httpService.findEventsByMosque(this.mosque._id).subscribe(data => {
      this.events = data;
      this.events = (data || []).sort((a: MosqueEvent, b: MosqueEvent) => a.event_end_date < b.event_end_date ? 1 : -1)
      if (data) {
        this.eventsSize = data.length;
      }
    }, error => {
      console.log(error)
    });
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
  kariahPage() {
    this.navCtrl.push(KariahPage, {
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

  getMosqueDetails(google_place_id: string) {
    this.httpService.findMosque(google_place_id).subscribe(data => {
      // console.log(JSON.stringify(data));
      // this.mosque = data;
      if (data) {
        // this.mosque = data;
        this.getMosqueRating(google_place_id);
      }
    }, error => {
      console.log(error)
    })
  }

  getMosqueRating(google_place_id) {
    this.httpService.getMosqueAvgRating(google_place_id).subscribe(data => {
      if (data.length > 0) {
        this.fullStaryArray = [];
        this.halfStar = 0;
        this.emptyStarArray = [];
        this.avgMosqueRating = data[0].avgMosqueRating;
        this.mosqueRatersCount = data[0].mosqueRatersCount;
        this.calculateStar(this.avgMosqueRating);
      } else if (data.length == 0) {
        this.emptyStarArray = [1, 1, 1, 1, 1];
        this.avgMosqueRating = "0";
        this.mosqueRatersCount = "0";
      }
    });
  }

  calculateStar(avgMosqueRating) {
    if (avgMosqueRating && avgMosqueRating > 0) {
      for (var i = 1; i <= Math.floor(parseFloat(avgMosqueRating)); i++) {
        this.fullStaryArray.push(1);
      };
      if (parseFloat(avgMosqueRating) % 1 != 0) this.halfStar++;
      for (var i = 1; i <= (5 - Math.ceil(parseFloat(avgMosqueRating))); i++) {
        this.emptyStarArray.push(1);
      };
    } else {
      this.emptyStarArray = [1, 1, 1, 1, 1];
    }

  }

  popoverRating(myEvent) {
    let popover = this.popoverCtrl.create(PopoverMosqueRatingPage, { "userId": this.userId, "mosque": this.mosque, }, { showBackdrop: true, cssClass: "popover-rating" });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.mosque = data.mosque;
        this.getMosqueDetails(this.mosque._id);
      }
    })
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

  validateDateTime(startDtm, endDtm, index) {
    let today = new Date().toISOString();

    let firstEndDtm = endDtm;
    let secondEndDtm = (index != this.events.length - 1) ? this.events[index].event_end_date : '';

    let firstDtmParts = firstEndDtm.split("T");
    let firstEndDate = firstDtmParts[0];

    let endDtmParts = secondEndDtm.split("T");
    let secondEndDate = endDtmParts[0];

    if (firstEndDtm) {
      firstDtmParts = firstEndDtm.split("T");
      firstEndDate = firstDtmParts[0];
    }
    if (secondEndDtm) {
      endDtmParts = secondEndDtm.split("T");
      secondEndDate = endDtmParts[0];
    }

    if ((firstEndDate && secondEndDate) && (firstEndDate != secondEndDate) || index == 0) {
      return this.getCategoryLabel(today, startDtm, endDtm)
    }else{
      return '';
    }

  }

  getCategoryLabel(today, startDtm, endDtm) {
    if (startDtm <= today && today < endDtm) {
      return 'Active events';
    } else if (startDtm > today) {
      return 'Upcoming events'
    } else if (today > endDtm) {
      return 'History events'
    } else {
      return ''
    }
  }
}