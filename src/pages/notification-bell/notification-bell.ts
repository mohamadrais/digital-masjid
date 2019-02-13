import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public global:Globals, public events:Events) {
    this.showButtonFlag = (this.global.getUserType()==AppConstants.USER_TYPE_USER);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationBellPage');
    this.events.subscribe('userType:admin', data =>{
      this.showButtonFlag = false;
    });
    this.events.subscribe('userType:user', data =>{
      this.showButtonFlag = true;
    });
  }

  ionViewDidEnter(){
    
  }

  notificationPage(){
    this.navCtrl.push(NotificationPage)
  }

}
