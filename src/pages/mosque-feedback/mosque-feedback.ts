import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { AppConstants } from "../../app/constants/app-constants";
import { MosqueFeedback } from "../../app/models/MosqueFeedback";
import { HomePage } from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';
import { Mosques } from '../../app/models/Mosques';
import { MosquePage } from '../mosque/mosque';
import { MosqueManagePage } from '../mosque-manage/mosque-manage';
import { User } from "../../app/models/User";
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-mosque-feedback',
  templateUrl: 'mosque-feedback.html',
})
export class MosqueFeedbackPage {
  mosque: Mosques;
  category: string;
  page: string;
  suggestion: string;
  mosqueFeedback: MosqueFeedback;
  isAdmin: boolean = false;
  currentUser: User;
  feedbackList: Array<MosqueFeedback>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService: HttpService,
    public global: Globals, public alertCtrl: AlertController) {
    this.mosque = navParams.get('mosqueData');
    this.currentUser = this.global.getUser();
    if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_ADMIN) {
      this.isAdmin = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MosqueFeedbackPage');
  }

  async ionViewCanEnter() {
    if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_ADMIN) {
      await this.viewMosqueFeedback(this.mosque.google_place_id);
    }
  }

  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage() {
    this.navCtrl.setRoot(AdminHomePage)
  }

  goBack() {
    if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_ADMIN) {
      this.navCtrl.setRoot(MosqueManagePage, {
        "data": this.mosque
      });

    } else {
      this.navCtrl.setRoot(MosquePage, {
        "data": this.mosque
      });
    }
  }

  mosqueManagePage() {
    this.navCtrl.setRoot(MosqueManagePage);
  }

  sendMosqueFeedback() {
    // if( this.category && this.page &&  this.suggestion ){
    if (this.category && this.suggestion) {
      this.global.get(AppConstants.USER).then(userData => {
        this.mosqueFeedback = new MosqueFeedback();
        this.mosqueFeedback.mosqueGooglePlaceId = this.mosque.google_place_id;
        this.mosqueFeedback.category = this.category;
        // this.mosqueFeedback.page = this.page;
        this.mosqueFeedback.suggestion = this.suggestion;
        this.mosqueFeedback.userId = userData._id;
        this.mosqueFeedback.createdTimestamp = (new Date()).toISOString();
        this.httpService.saveMosqueFeedback(this.mosqueFeedback).subscribe(data => {
          this.showResult(data, userData);
        }, error => {
          console.log(`Error from sendFeedback(): ${error}`);
        })
      })
    }
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Do you wish to submit?',
      message: 'By clicking submit, your feedback will be sent to mosque administrators.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            this.sendMosqueFeedback();
          }
        }
      ]
    });
    confirm.present();
  }

  showResult(data, userData) {
    let alertTitle, alertMessage, alertButtons;
    alertButtons = [
      {
        text: 'Go back',
        handler: () => {
          if (userData.userType.toUpperCase() === AppConstants.USER_TYPE_ADMIN) {
            this.mosqueManagePage();
          } else {
            this.goBack();
          }
        }
      }
    ];
    if (data.status && data.status == "success") {
      alertTitle = "Success!";
      alertMessage = "Thank you for your time! Your feedback has been successfully sent to mosque administrators.";
    }
    else {
      alertTitle = "Sorry... something went wrong.";
      alertMessage = "Our sincere apologies. There was a problem with sending feedback. Plese re-try or contact mosque administrators directly if issue persists. Thank you.";
      alertButtons.push([
        {
          text: 'Try again',
          handler: () => {
          }
        }
      ]);
    }
    const confirm = this.alertCtrl.create({
      title: alertTitle,
      message: alertMessage,
      buttons: alertButtons
    });
    confirm.present();
  }

  async viewMosqueFeedback(mosqueGooglePlaceId) {
    return new Promise((resolve, reject) => {
      this.httpService.viewMosqueFeedback(mosqueGooglePlaceId).subscribe(data => {
        if (data && data.status && data.status == 'success') {
          this.feedbackList = data.result;
          for( var i=0; i < this.feedbackList.length; i++){
            this.feedbackList[i].formattedCreatedTimestamp = momenttz(this.feedbackList[i].createdTimestamp).tz("Asia/Singapore").fromNow();
          }
          resolve(true);
        }
        else {
          this.feedbackList = [];
          resolve(true);
        }
      });
    })
  }
}
