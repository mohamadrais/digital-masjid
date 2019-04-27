import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { CreateEventPage } from '../create-event/create-event';
import { RegisterUstazPage } from '../register-ustaz/register-ustaz';
import { NotificationPage } from '../notification/notification';
import { HttpService } from "../../app/service/http-service";
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
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
  nickname: string = "";
  userData;
  events: Array<MosqueEvent> = [];
  eventsSize: number = 0;
  updated = "";
  address = "";
  constructor(public navCtrl: NavController, public httpService: HttpService, public global: Globals, public geolocation: Geolocation, public geocoder: NativeGeocoder) {
    this.userData = this.global.getUser();
    this.nickname = this.userData.name; //this.userData.nickname;
    this.getMosqueManaged();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  getMosqueManaged() {
    this.readCurrentLocation();
    this.httpService.findEventsManagedByAdmin(this.userData.mosquesManaged).subscribe(data => {
      this.events = data;
      if (data) {
        this.eventsSize = data.length;
      }
    }, error => {
      console.log("Issue occured while getting events managed by Admin");
    });
  }

  eventdetailsPage(events: MosqueEvent, index) {
    this.navCtrl.push(EventDetailsPage, {
      'data': events,
      callback: data => {
        if (data.events) {
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
  createeventPage() {
    this.navCtrl.push(CreateEventPage)
  }
  createustazPage() {
    this.navCtrl.push(RegisterUstazPage)
  }
  notificationPage() {
    this.navCtrl.push(NotificationPage)
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

  getSeatsLeft(event: MosqueEvent): number {
    return (event.quota - event.users.length);
  }

  readCurrentLocation() {
    // let today: Date = new Date();
    // this.updated = today.getDate() + "/" + (today.getMonth() + 1) + " " + today.getUTCHours() + ":" + today.getMinutes();
    this.updated = momenttz().tz("Asia/Singapore").format("D/M HH:mm");
    let options = {
      maximumAge: 3000,
      enableHighAccuracy: true,
      timeout: 50000
    };

    this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
      this.geocoder.reverseGeocode(position.coords.latitude, position.coords.longitude).then((res: NativeGeocoderReverseResult[]) => {
        this.address = res[0].locality
        console.log('home.address : ' + this.address);
      })
    }).catch((err) => {
      console.log(err);
    })
  }
}
