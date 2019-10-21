import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConstants } from "../../app/constants/app-constants";
import { Globals } from "../../app/constants/globals";
import { HttpService } from "../../app/service/http-service";
import { EventDetailsPage } from '../event-details/event-details';
import { MosqueEvent } from "../../app/models/MosqueEvents";
import * as moment from 'moment';
import { MosqueEventsUtil } from "../../app/util/mosque-events-util";
import { MosqueEventsGroup } from '../../app/models/MosqueEventsGroup';
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

  events: Array<MosqueEvent> = [];
  eventsGroup: Array<MosqueEventsGroup> = [];

  constructor(public navCtrl: NavController, public mosqueEventsUtil: MosqueEventsUtil, public navParams: NavParams, public global: Globals, public httpService: HttpService) {
  }

  ionViewWillEnter() {
    this.httpService.bookmarkList(this.global.getUserId()).subscribe(bookmarks => {

      if (bookmarks && Array.isArray(bookmarks) && bookmarks.length > 0) {
        this.events = bookmarks;
      } else {
        this.events = [];
      }

      console.log(JSON.stringify(this.events));

      this.eventsGroup = this.mosqueEventsUtil.groupMosqueEvents(this.events);
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
