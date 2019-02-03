import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Events } from "../../app/models/Events";
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { EventDetailsPage } from '../event-details/event-details';
import { RegisterPage } from '../register/register';
import { User } from '../../app/models/User';
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
  events_history: Array<Events> = [];
  events_upcoming: Array<Events> = [];
  // eventsSize:number = 0;
  name: string = "";
  email: string = "";
  pointsCollected: number = 0;
  userData: User;
  isUserTypeUser: boolean = false;

  constructor(public navCtrl: NavController, public httpService: HttpService, public navParams: NavParams, public global: Globals) {
    this.getStoredData();
  }

  getStoredData() {
    this.global.get(AppConstants.USER).then(data => {
      if (data) {
        this.userData = data;
        this.name = this.userData.name;
        this.email = this.userData.email;
        // this.pointsCollected = this.userData.pointsCollected;

        if (this.userData.userType == AppConstants.USER_TYPE_USER) {
          this.isUserTypeUser = true;
        }
        this.pointsCollected = 0;
        this.findEvents(AppConstants.EVENT_HISTORY);
        this.findEvents(AppConstants.EVENT_UPCOMING);
      }
    });
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
  findEvents(eventEndType) {
    this.httpService.findEventsForUser(this.userData._id, this.userData.userType, eventEndType).subscribe(data => {
      console.log(" events data " + data);
      console.log(JSON.stringify(data));

      if (data) {
        if (eventEndType == AppConstants.EVENT_HISTORY) {
          this.events_history = data;
          data.forEach(element => {
            this.pointsCollected += element.points;
          });
        } else if (eventEndType == AppConstants.EVENT_UPCOMING) {
          this.events_upcoming = data;
          data.forEach(element => {
            this.pointsCollected += element.points;
          });
        }

        // this.eventsSize = data.length;
      }
    }, error => {
      console.log(error)
    })
  }

  eventdetailsPage(event: Events, isUpcoming, index) {
    if (isUpcoming) {
      this.navCtrl.push(EventDetailsPage, {
        'data': event, "fromProfile": AppConstants.EVENT_UPCOMING,
        callback: data => {
          if (!data.joined) {
            this.events_upcoming.splice(index,1);
          }
        }
      });
    } else {
      this.navCtrl.push(EventDetailsPage, { 'data': event, "fromProfile": AppConstants.EVENT_HISTORY });
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

    return date;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
