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
  providers:[LoginPage]
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
  dob: string;
  deviceInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController, public global: Globals, public login: LoginPage) {
    //if loggedIn
    this.userData = this.navParams.get("data");
    if (this.userData) {
      this.email = this.userData.email;
      this.name = this.userData.name;
      // this.nickname = this.userData.nickname;
      // this.icnumber = this.userData.icnumber;
      // this.gender = this.userData.gender;
      this.mobile = this.userData.mobile;
      // this.preferredMosque = this.userData.preferredMosque;
      this.dob = this.userData.dob;
      this.editMode = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  async registerUser() {
    if (this.validateData()) {
      this.prepareData();
      this.deviceInfo = await this.getDeviceInfo();
      if (this.deviceInfo) {
        this.httpService.registerUser(this.user, this.deviceInfo).subscribe(data => {
          if (data) {
            if (data.status && data.status == "failure") {
              this.showError(data.message);
            }
            else {
              this.showConfirm();
              this.login.authenticateUser(this.email, this.password);
            }
          }
        }, error => {
          //Rais: Show proper validation error message here
          console.log("error during registerUser: ", error);
        })
      }
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
        //Rais: Show proper validation error message here
        console.log("error during updateUser: ", error);
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
    // this.user.nickname = this.nickname;
    this.user.password = this.password;
    // this.user.gender = this.gender;
    // this.user.icnumber = this.icnumber;
    this.user.mobile = this.mobile;
    // this.user.preferredMosque = this.preferredMosque;
    this.user.dob = this.dob;
    this.user.active = "Y";
    this.user.createdTimestamp = (new Date()).toISOString();
    this.user.updatedTimestamp = (new Date()).toISOString();
  }

  validateData() {
    if (this.editMode) {
      // return ((this.name && this.name != this.userData.name) || (this.password && this.password != this.userData.password) || (this.mobile && this.mobile != this.userData.mobile) || (this.preferredMosque && this.preferredMosque != this.userData.preferredMosque) || (this.gender && this.gender != this.userData.gender) || (this.nickname && this.nickname != this.userData.nickname));
      return ((this.name && this.name != this.userData.name) || (this.password && this.password != this.userData.password) || (this.mobile && this.mobile != this.userData.mobile) || (this.dob && this.dob != this.userData.dob));
    } else {
      // return (this.email && this.name && this.password && this.icnumber && this.mobile && this.preferredMosque && this.gender && this.nickname);
      return (this.email && this.name && this.password && this.mobile && this.dob);
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
      message: 'Welcome to Digital Masjid where you will never miss a single event again.',
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
    // infoString += (this.nickname) ? "<br/>Nickname:" + this.nickname + ',' : '';
    // infoString += (this.gender) ? "<br/>Gender:" + this.gender + ',' : '';
    infoString += (this.dob) ? "<br/>Date of Birth:" + this.dob + ',' : '';
    infoString += (this.mobile) ? "<br/>Mobile:" + this.mobile + ',' : '';
    infoString += (this.password) ? "<br/>Password:*************" + ',' : '';
    // infoString += (this.preferredMosque) ? "<br/>Preferred Mosque:" + this.preferredMosque + ',' : '';
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
    // (this.nickname) ? this.userData.nickname = this.nickname : '';
    // (this.gender) ? this.userData.gender = this.gender : '';
    (this.dob) ? this.userData.dob = this.dob : '';
    (this.mobile) ? this.userData.mobile = this.mobile : '';
    // (this.preferredMosque) ? this.userData.preferredMosque = this.preferredMosque : '';

    this.global.set(AppConstants.USER, this.userData).then(() => {
      this.navCtrl.pop().then(() => {
        this.navParams.get('callback')({ "done": true });
      });
    });
  }

  private async getDeviceInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        var deviceInfo = {
          "device_unique_id": this.global.getDeviceId(),
          "osVersion": this.global.getDevicePlatformVersion(),
          "deviceModel": this.global.getDeviceModel(),
          "platform": this.global.getDevicePlatform(),
          "manufacturer": this.global.getDeviceManufacturer(),
          "pushToken": this.global.getPushToken()
        };
        resolve(deviceInfo);
      }
      catch (error) {
        console.log("error during getDeviceInfo: ", error);
        reject(false);
      }
    })
  }
}
