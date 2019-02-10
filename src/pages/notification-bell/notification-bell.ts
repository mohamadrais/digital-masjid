import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotificationPage } from '../notification/notification';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
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
  showButtonFlag;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global:Globals) {
    this.userType=this.global.getUserType();
    if(this.userType == AppConstants.USER_TYPE_USER){
      this.showButtonFlag = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationBellPage');
  }

  notificationPage(){
    this.navCtrl.push(NotificationPage)
  }

}
