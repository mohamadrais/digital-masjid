import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NotificationPage } from '../notification/notification';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { HttpService } from "../../app/service/http-service";
/**
 * Generated class for the NotificationBellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notification-bell',
  templateUrl: 'notification-bell.html',
})
export class NotificationBellPage {

  userType;
  userId;
  showButtonFlag;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: Globals, public events: Events, public httpService: HttpService) {
    this.showButtonFlag = (this.global.getUserType() == AppConstants.USER_TYPE_USER);
    this.userId = this.global.getUserId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationBellPage');
    this.events.subscribe('userType:admin', data => {
      this.showButtonFlag = false;
    });
    this.events.subscribe('userType:user', data => {
      this.showButtonFlag = true;
    });
    this.events.subscribe("notification:updateView", data => {
      this.countUnreadByUser();
    });
  }

  async ionViewDidEnter() {
    // await this.countUnreadByUser();
  }

  async ionViewWillEnter() {
  }

  async countUnreadByUser() {
    this.httpService.notificationCountUnreadByUser(this.global.getUserId()).subscribe(data => {
      if (data && data.status && data.status.toLowerCase() != "failure") {
        this.global.generalSettings.totalUnreadNotificationBellCount = data.result;
      }
    });
  }

  notificationPage() {
    this.navCtrl.push(NotificationPage)
  }

}
