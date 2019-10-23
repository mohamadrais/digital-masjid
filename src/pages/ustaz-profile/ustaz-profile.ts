import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { User } from "../../app/models/User";
import { HttpService } from "../../app/service/http-service";
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { EventDetailsPage } from '../event-details/event-details';
import { PopoverRatingPage } from './popover-rating';
import { RegisterPage } from '../register/register';
import { Url } from "../../app/models/MosqueEventsUrl";
import * as moment from 'moment';
import { MosqueEventsUtil } from "../../app/util/mosque-events-util";
import { MosqueEventsGroup } from '../../app/models/MosqueEventsGroup';
/**
 * Generated class for the UstazProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-ustaz-profile',
  templateUrl: 'ustaz-profile.html',
})
export class UstazProfilePage {
  events: Array<MosqueEvent> = [];
  eventsGroup: Array<MosqueEventsGroup> = [];
  name: string = "";
  email: string = "";
  userImage: string = "";
  user_url: any = [];
  avgRating: string = "0";
  ratersCount: string = "0";
  userType: string = "";
  userId: string = ""; //generic user who currently logged in
  moderator: User;
  halfStar: number = 0;
  fullStaryArray: Array<number> = [];
  emptyStarArray: Array<number> = [];
  eventsSize: number = 0;

  constructor(public navCtrl: NavController, public mosqueEventsUtil: MosqueEventsUtil, public navParams: NavParams, public global: Globals, public httpService: HttpService, public popoverCtrl: PopoverController) {
    this.moderator = navParams.get('data');
    console.log('nav params from ustaz profile page constructor: ' + navParams.get('data'));
    console.log(this.moderator);
    // if ustaz profile page is reached from an event
    if (this.moderator) {
      // check if current logged in user id = nav param moderator id
      if (this.global.getUserId() == this.moderator._id) {
        this.moderator = this.global.getUser();
        // this.moderator._id = data._id;
        // this.moderator.name = data.name;
        // this.moderator.email = data.email;
        // this.moderator.avgRating = data.avgRating;
        // this.moderator.ratersCount = data.ratersCount;
        this.calculateStar(this.moderator.avgRating);
        this.user_url = [];
        if (this.moderator.user_url && this.moderator.user_url.length != 0) {
          for (var i = 0, len = this.moderator.user_url.length; i < len; i++) {
            this.user_url[i] = {}; 
            for (var prop in this.moderator.user_url[i]) {
              this.user_url[i][prop] = this.moderator.user_url[i][prop]; // copy properties
            }
          }
        }
        if (this.moderator.userImage && this.moderator.userImage.length != 0) {
          this.userImage = this.moderator.userImage;
        }
      }
      // get ustaz details from server
      else {
        this.getUstazDetails(this.moderator._id);
        this.userId = this.global.getUserId();
      }
    }
    // if ustaz profile page is reached by ustaz 
    else {
      this.moderator = this.global.getUser();
      // this.moderator._id = data._id;
      // this.moderator.name = data.name;
      // this.moderator.email = data.email;
      // this.moderator.avgRating = data.avgRating;
      // this.moderator.ratersCount = data.ratersCount;
      this.getRating(this.moderator._id);
      // this.calculateStar(this.avgRating);
      this.user_url = [];
      if (this.moderator.user_url && this.moderator.user_url.length != 0) {
        for (var i = 0, len = this.moderator.user_url.length; i < len; i++) {
          this.user_url[i] = {}; 
          for (var prop in this.moderator.user_url[i]) {
            this.user_url[i][prop] = this.moderator.user_url[i][prop]; // copy properties
          }
        }
      }
      if (this.moderator.userImage && this.moderator.userImage.length != 0) {
        this.userImage = this.moderator.userImage;
      }
    }
    this.userType = this.global.getUserType();
    this.userId = this.global.getUserId();

    this.findEvents();

  }

  //@aishah
  //todo: save the events history and upcoming specific for user in sqlite
  findEvents() {
    this.httpService.findEventsForUser(this.moderator._id, "USTAZ", null).subscribe(data => {
      console.log(" events data " + data);
      console.log(JSON.stringify(data));
      this.events = data;
      this.eventsGroup = this.mosqueEventsUtil.groupMosqueEvents(this.events);
      
      if (data) {
        this.eventsSize = data.length;
      }
    }, error => {
      console.log(error)
    })
  }

  getUstazDetails(moderatorId: string) {
    this.httpService.findUser(moderatorId).subscribe(data => {
      console.log(" user details from getUstazDetails: " + data);
      console.log(JSON.stringify(data));
      this.moderator = data;
      if (data) {
        this.moderator = data;
        this.name = this.moderator.name;
        this.email = this.moderator.email;
        this.user_url = [];
        if (this.moderator.user_url && this.moderator.user_url.length != 0) {
          for (var i = 0, len = this.moderator.user_url.length; i < len; i++) {
            this.user_url[i] = {}; 
            for (var prop in this.moderator.user_url[i]) {
              this.user_url[i][prop] = this.moderator.user_url[i][prop]; // copy properties
            }
          }
        }
        if (this.moderator.userImage && this.moderator.userImage.length != 0) {
          this.userImage = this.moderator.userImage;
        }
        this.getRating(moderatorId);
      }
    }, error => {
      console.log(error)
    })
  }

  getRating(moderatorId) {
    this.httpService.getAvgRating(moderatorId).subscribe(data => {
      if (data.length > 0) {
        this.fullStaryArray = [];
        this.halfStar = 0;
        this.emptyStarArray = [];
        this.avgRating = data[0].avgRating;
        this.ratersCount = data[0].ratersCount;
        this.calculateStar(this.avgRating);
      } else if (data.length == 0) {
        this.emptyStarArray = [1, 1, 1, 1, 1];
        this.avgRating = "0";
        this.ratersCount = "0";
      }
    });
  }

  getSeatsLeft(event: MosqueEvent): number {
    return (event.quota - event.users.length);
  }

  eventdetailsPage(event: MosqueEvent) {
    this.navCtrl.push(EventDetailsPage, { 'data': event });
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

  calculateStar(avgRating) {
    if (avgRating && avgRating > 0) {
      for (var i = 1; i <= Math.floor(parseFloat(avgRating)); i++) {
        this.fullStaryArray.push(1);
      };
      if (parseFloat(avgRating) % 1 != 0) this.halfStar++;
      for (var i = 1; i <= (5 - Math.ceil(parseFloat(avgRating))); i++) {
        this.emptyStarArray.push(1);
      };
    } else {
      this.emptyStarArray = [1, 1, 1, 1, 1];
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UstazProfilePage');
  }

  popoverRating(myEvent) {
    let popover = this.popoverCtrl.create(PopoverRatingPage, { "userId": this.global.getUserId(), "moderatorId": this.moderator._id }, { showBackdrop: true, cssClass: "popover-rating" });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.getUstazDetails(this.moderator._id);
      }
    })
  }

  getStoredData() {
    this.moderator = this.global.getUser();
    this.name = this.moderator.name;
    this.email = this.moderator.email;
    this.userImage = this.moderator.userImage;
    this.user_url = [];
    for (var i = 0, len = this.moderator.user_url.length; i < len; i++) {
      this.user_url[i] = {}; 
      for (var prop in this.moderator.user_url[i]) {
        this.user_url[i][prop] = this.moderator.user_url[i][prop]; // copy properties
      }
    }
  }

  editProfile() {
    this.navCtrl.push(RegisterPage, {
      "data": this.moderator,
      callback: data => {
        if (data) {
          this.getStoredData();
        }
      }
    })
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
}
