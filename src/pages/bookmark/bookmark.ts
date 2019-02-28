import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConstants } from "../../app/constants/app-constants";
import { Globals } from "../../app/constants/globals";
import { HttpService } from "../../app/service/http-service";
import { EventDetailsPage } from '../event-details/event-details';
import { MosqueEvent } from "../../app/models/MosqueEvents";
import * as moment from 'moment';
/**
 * Generated class for the BookmarkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-bookmark',
  templateUrl: 'bookmark.html',
})
export class BookmarkPage {

  event_bookmarks;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: Globals, public httpService: HttpService) {
  }

  ionViewDidEnter(){
    this.httpService.bookmarkList(this.global.getUserId()).subscribe(bookmarks => {
      this.event_bookmarks = bookmarks;

      console.log(JSON.stringify(this.event_bookmarks));
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarkPage');
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

  getSeatsLeft(event: MosqueEvent): number {
    return (event.quota - event.users.length);
  }

}
