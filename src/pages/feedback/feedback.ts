import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Globals} from "../../app/constants/globals";
import { AlertController } from 'ionic-angular';
import {HttpService} from "../../app/service/http-service";
import {AppConstants} from "../../app/constants/app-constants";
import {FeedBack} from "../../app/models/FeedBack";
import {HomePage} from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  category:string;
  page:string;
  suggestion:string;
  feedBack:FeedBack;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public httpService:HttpService, 
    public global:Globals, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  homePage(){
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage(){
    this.navCtrl.setRoot(AdminHomePage)
  }

  sendFeedBack(){
    if( this.category && this.page &&  this.suggestion ){
      this.global.get(AppConstants.USER).then(userdata => {
        this.feedBack = new FeedBack();
        this.feedBack.category = this.category;
        this.feedBack.page = this.page;
        this.feedBack.suggestion = this.suggestion;
        this.feedBack.userid = userdata._id;
        this.feedBack.createdTimestamp = (new Date()).toISOString();
        this.httpService.feedBack(this.feedBack).subscribe(data => {
          if( userdata.userType.toUpperCase() === AppConstants.USER_TYPE_ADMIN ){
            this.adminhomePage();
          } else {
            this.homePage();
          }
        }, error => {

        })
      })
    }
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Do you wish to submit?',
      message: 'By clicking submit, your event suggestion will be sent.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            console.log('Create clicked');
            this.sendFeedBack();
          }
        }
      ]
    });
    confirm.present();
  }
}
