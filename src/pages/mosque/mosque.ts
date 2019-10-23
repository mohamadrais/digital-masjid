import { Component } from '@angular/core';
import { NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { MosqueFeedbackPage } from '../mosque-feedback/mosque-feedback';
import { FeedbackPage } from '../feedback/feedback';
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
import { Url } from "../../app/models/MosqueEventsUrl";
import { MosqueEventsUtil } from "../../app/util/mosque-events-util";
import { MosqueEventsGroup } from '../../app/models/MosqueEventsGroup';
import * as moment from 'moment';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-mosque',
  templateUrl: 'mosque.html'
})
export class MosquePage {
  events: Array<MosqueEvent> = [];
  eventsGroup: Array<MosqueEventsGroup> = [];
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
  showKariahButton = false;
  currFirstUpcoming;
  currFirstActive;
  currFirstHistory;

  constructor(public navCtrl: NavController, public mosqueEventsUtil: MosqueEventsUtil, public httpService: HttpService, public navParams: NavParams, public iab: InAppBrowser, public platform: Platform, public global: Globals, public popoverCtrl: PopoverController) {
    this.mosque = navParams.get('data');
    this.getMosqueRating(this.mosque.google_place_id);
    // mosque.google_place_id now equals google_place_id

    this.userId = this.global.getUserId();
    this.userType = this.global.getUserType();

    // this.initData();
  }

  ionViewDidEnter() {
    this.initData();
    let kariahUser = this.global.getKariahUser()
    /** By default, kariah button will only be shown for registered mosques.
      * If user is has not registered to any mosque, Kariah button will be shown for all registered mosques.
      * If user already registered to one mosque, kariah button will only be shown if user viewing that mosque's profile.
    */
    if (!kariahUser || !kariahUser.userId || (kariahUser && kariahUser.kariahMosqueGooglePlaceId && (kariahUser.kariahMosqueGooglePlaceId == this.mosque.google_place_id))) {
      this.showKariahButton = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MosquePage');
  }

  initData() {
    this.httpService.findEventsByMosque(this.mosque.google_place_id).subscribe(data => {
      this.events = data;
      this.eventsGroup = this.mosqueEventsUtil.groupMosqueEvents(this.events);

      if (data) {
        this.eventsSize = data.length;
      }
    }, error => {
      console.log(error)
    });
  }

  eventdetailsPage(event: MosqueEvent, i, j) {
    this.navCtrl.push(EventDetailsPage, {
      'data': event,
      callback: data => {
        // if (!(data.joined)) {
        //   this.eventsGroup[i].mosqueEvents[j].users.splice(data.userId, 1);
        // } else {
        //   this.eventsGroup[i].mosqueEvents[j].users.push(data.userId);
        // }
        if (data.events) {
          this.eventsGroup[i].mosqueEvents[j].event_title = data.event_title;
          this.eventsGroup[i].mosqueEvents[j].category = data.category;
          this.eventsGroup[i].mosqueEvents[j].event_start_date = data.event_start_date;
          this.eventsGroup[i].mosqueEvents[j].event_end_date = data.event_end_date;
          this.eventsGroup[i].mosqueEvents[j].quota = data.quota;
          this.eventsGroup[i].mosqueEvents[j].event_description = data.event_description;
          this.eventsGroup[i].mosqueEvents[j].event_status = data.event_status;
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

    // return date;
    return moment.utc(event_date).format("DD/MM/YYYY HH:mm");
  }
  mosqueFeedbackPage() {
    this.navCtrl.push(MosqueFeedbackPage, {
      'mosqueData': this.mosque,
      callback: data => {
        this.mosque = data;
      }
    })
  }
  feedbackPage() {
    this.navCtrl.push(FeedbackPage)
  }
  infaqPage() {
    this.navCtrl.push(InfaqPage, {
      'mosqueData': this.mosque,
      callback: data => {
      }
    });
    // const browser = this.iab.create('https://app.senangpay.my/payment/898154475783162');
    // browser.show();
  }
  kariahPage() {
    this.navCtrl.push(KariahPage, {
      "mosqueGooglePlaceId": (this.mosque.google_place_id) ? this.mosque.google_place_id : '',
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

  openLink(url: Url) {
    console.log("clicked link: " + url.link + ", displayText: " + url.displayText);
    var pattern = /^((http|https|ftp):\/\/)/;

    if (!pattern.test(url.link)) {
      url.link = "http://" + url.link;
    }

    window.open(url.link, '_system', 'location=yes');
    // const browser = this.iab.create(url.link, '_self', 'location=yes');
    // browser.show();
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
      // tslint:disable-next-line: no-duplicate-variable
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
        this.getMosqueDetails(this.mosque.google_place_id);
      }
    })
  }


  // openMap(url){
  //   let generatedUrl='https://www.google.com/maps/place/?q=place_id:'+((this.mosque.google_place_id)?this.mosque.google_place_id:this.mosque.google_place_id);

  //   if(url){
  //     generatedUrl = url
  //   }

  //   const browser = this.iab.create(generatedUrl , '_blank', 'location=yes');
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


  goBack() {
    this.navCtrl.setRoot(HomePage, {
    });
  }
}