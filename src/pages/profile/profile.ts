import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { EventDetailsPage } from '../event-details/event-details';
import { RegisterPage } from '../register/register';
import { User } from '../../app/models/User';
import * as moment from 'moment';
import { MosqueEventsUtil } from "../../app/util/mosque-events-util";
import { MosqueEventsGroup } from '../../app/models/MosqueEventsGroup';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  events: Array<MosqueEvent> = [];
  eventsGroup: Array<MosqueEventsGroup> = [];
  // eventsSize:number = 0;
  name: string = "";
  email: string = "";
  pointsCollected: number = 0;
  userData: User;
  isUserTypeUser: boolean = false;
  userImage;
  // userThumbnail;

  constructor(public navCtrl: NavController, public mosqueEventsUtil: MosqueEventsUtil, public httpService: HttpService, public navParams: NavParams, public global: Globals) {
    this.getStoredData();
  }

  getStoredData() {
        this.userData = this.global.getUser();
        this.name = this.userData.name;
        this.email = this.userData.email;
        this.pointsCollected = parseInt(this.userData.pointsCollected);

        if (this.userData.userType == AppConstants.USER_TYPE_USER) {
          this.isUserTypeUser = true;
        }

        if (this.userData.userImage && this.userData.userImage.length > 0) {
          this.userImage = this.userData.userImage;
          // this.userThumbnail = this.userData.userThumbnail.toString();
        }
        // this.pointsCollected = 0;
        this.findEvents();
  }

  editProfile() {
    this.navCtrl.push(RegisterPage, {
      "data": this.userData,
      callback: data => {
        if (data) {
          this.getStoredData();
        }
      }
    })
  }

  //@aishah
  //todo: save the events history and upcoming specific for user in sqlite
  findEvents() {
    this.httpService.findEventsForUser(this.userData._id, this.userData.userType, null).subscribe(data => {
      console.log(" events data " + data);
      console.log(JSON.stringify(data));

      this.events = data;
      this.eventsGroup = this.mosqueEventsUtil.groupMosqueEvents(this.events);
      
    }, error => {
      console.log(error)
    })
  }

  eventdetailsPage(event: MosqueEvent, groupName, i, j) {
    if(this.isUserTypeUser){
      if (groupName==AppConstants.EVENT_UPCOMING) {
        this.navCtrl.push(EventDetailsPage, {
          'data': event, "fromUserFlow": true,
          callback: data => {
            if (!data.joined) {
              this.eventsGroup[i].mosqueEvents.splice(j,1);
            }
          }
        });
      } else {
        this.navCtrl.push(EventDetailsPage, { 'data': event, "fromUserFlow": true });
      }
    }else{
      this.navCtrl.push(EventDetailsPage, {
        'data': event,
        callback: data => {
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
      })
    }
    

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
