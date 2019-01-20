import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/User';
import { DateUtil } from "../../app/util/date-util";
import { HttpService } from "../../app/service/http-service";
import { HomePage } from '../home/home';
import { LoginPage } from "../login/login";
import { AlertController } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  email: string;
  name: string;
  nickname: string;
  password: string;
  icnumber: string;
  gender: string;
  mobile: string;
  preferredMosque: string;
  private user: User;
  valid: boolean = true;
  userData: User;
  editMode: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController, public global: Globals) {
    //if loggedIn
    this.userData = this.navParams.get("data");
    if (this.userData) {
      this.email = this.userData.email;
      this.name = this.userData.name;
      this.nickname = this.userData.nickname;
      this.icnumber = this.userData.icnumber;
      this.gender = this.userData.gender;
      this.mobile = this.userData.mobile;
      this.preferredMosque = this.userData.preferredMosque;
      this.editMode = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  registerUser() {
    if (this.validateData()) {
      this.prepareData();
      this.httpService.registerUser(this.user).subscribe(data => {
        if (data) {
          if (data.status && data.status == "failure") {
            this.showError(data.message);
          }
          else {
            this.showConfirm();
            this.navCtrl.setRoot(LoginPage);
          }
        }
      }, error => {
        //Rais: Throw validation error message here
      })
    } else {
      this.valid = false;
    }

  }

  updateUser() {
    if (this.validateData()) {
      this.prepareData();
      this.user._id = this.userData._id;
      this.httpService.updateUser(this.user).subscribe(data => {
        if (data.status == "200") {
          this.showUpdated();
        }
      }, error => {
        //Rais: Throw validation error message here
      })
    } else {
      this.valid = false;
    }

  }

  prepareData() {
    this.valid = true;
    this.user = new User();
    this.user.email = this.email;
    this.user.name = this.name;
    this.user.nickname = this.nickname;
    this.user.password = this.password;
    this.user.gender = this.gender;
    this.user.icnumber = this.icnumber;
    this.user.mobile = this.mobile;
    this.user.preferredMosque = this.preferredMosque;
    this.user.active = "Y";
    this.user.createdTimestamp = (new Date()).toISOString();
    this.user.updatedTimestamp = (new Date()).toISOString();
  }

  validateData() {
    if (this.editMode) {
      return ((this.name && this.name != this.userData.name) || (this.password && this.password != this.userData.password) || (this.mobile && this.mobile != this.userData.mobile) || (this.preferredMosque && this.preferredMosque != this.userData.preferredMosque) || (this.gender && this.gender != this.userData.gender) || (this.nickname && this.nickname != this.userData.nickname));
    } else {
      return (this.email && this.name && this.password && this.icnumber && this.mobile && this.preferredMosque && this.gender && this.nickname);
    }
  }

  showError(errorMsg) {
    const confirm = this.alertCtrl.create({
      title: 'Error',
      message: errorMsg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Congratulation!',
      message: 'Welcome to TM Saff where you will never miss a single event again.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  showUpdated() {
    let infoString = "";

    infoString += (this.name) ? "<br/>Name:" + this.name + ',' : '';
    infoString += (this.nickname) ? "<br/>Nickname:" + this.nickname + ',' : '';
    infoString += (this.gender) ? "<br/>Gender:" + this.gender + ',' : '';
    infoString += (this.mobile) ? "<br/>Mobile:" + this.mobile + ',' : '';
    infoString += (this.password) ? "<br/>Password:*************" + ',' : '';
    infoString += (this.preferredMosque) ? "<br/>Preferred Mosque:" + this.preferredMosque + ',' : '';
    infoString += "<br/>for user with email " + this.email;

    const confirm = this.alertCtrl.create({
      title: 'Updated!',
      message: 'Your profile is now updated for ' + infoString,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log("OK clicked");
          }
        }
      ]
    });
    confirm.present();

    (this.name) ? this.userData.name = this.name : '';
    (this.nickname) ? this.userData.nickname = this.nickname : '';
    (this.gender) ? this.userData.gender = this.gender : '';
    (this.mobile) ? this.userData.mobile = this.mobile : '';
    (this.preferredMosque) ? this.userData.preferredMosque = this.preferredMosque : '';

    this.global.set(AppConstants.USER, this.userData).then(() => {
      this.navCtrl.pop().then(() => {
        this.navParams.get('callback')({"done":true});
      });
    });
  }
}
