import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, PopoverController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { AdminHomePage } from '../admin-home/admin-home';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { UstazProfilePage } from '../ustaz-profile/ustaz-profile';
import { ForgotPassword } from '../forgot-password/forgotPassword';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //password:string;
  //username:string;
  validUser: boolean = true;
  loginForm = { username: '', password: '' }
  //userLoggedIn=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: Facebook, private googlePlus: GooglePlus,
    public httpService: HttpService, public global: Globals, public events: Events, public popoverCtrl: PopoverController) {
    console.log('login form:' + this.loginForm)
    // if(this.global.currentUser && (this.global.currentUser.email != null || this.global.currentUser.email != undefined)){
    //   this.userLoggedIn=true;
    // }
  }

  forgotPasswordPage() {
    this.navCtrl.push(ForgotPassword)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  registerPage() {
    this.navCtrl.push(RegisterPage)
  }

  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage() {
    this.navCtrl.setRoot(AdminHomePage)
  }

  ustazProfilePage() {
    this.navCtrl.setRoot(UstazProfilePage);
  }

  authenticateUser(username, password) {
    this.httpService.authenticateUser(username, password).subscribe(async data => {
      //if( data && data.userType != undefined ){
      if (data && data.userType != undefined) {

        this.global.set(AppConstants.USER, data);
        this.global.setUser(data);
        console.log("AppConstants.USER = " + data);
        if (data.userType.toUpperCase() === AppConstants.USER_TYPE_ADMIN) {
          this.adminhomePage();
          this.events.publish('userType:admin');
        } else if (data.userType.toUpperCase() === AppConstants.USER_TYPE_MODERATOR) {
          this.ustazProfilePage();
          this.events.publish('userType:ustaz');
        }
        else {
          this.homePage();
          this.events.publish('userType:user');
        }

        // send push token to server each time succesfully login
        if (data._id && (!this.global.generalSettings.pushTokenSentFlag)) {// && this.global.generalSettings.networkAvailable) {
          if (this.global.generalSettings.pushToken != "") {
            var resultSendPushTokenToServer = await this.sendPushTokenToServer(this.global.generalSettings.pushToken, data._id, data.mobile);
            if (resultSendPushTokenToServer) {
              this.global.generalSettings.pushTokenSentFlag = true;
              console.log("pushTokenSentFlag inside authenticate user: " + this.global.generalSettings.pushTokenSentFlag);
            }
          }
        }
      } else {
        this.validUser = false;
      }
    }, error => {
      console.log("error during authenticateUser: ", error);
      return false;
    })
  }

  async sendPushTokenToServer(pushToken, userId, userMobile) {
    return new Promise(async (resolve, reject) => {
      try {
        var deviceInfo;
        try {
          deviceInfo = await this.getDeviceInfo();
        } catch (err) {
          console.log(`error getting device info: ${err}`);
          reject(false);
        }
        if (deviceInfo) {
          this.httpService.sendPushToken(pushToken, deviceInfo, userId, userMobile).subscribe(data => {
            if (data) {
              console.log("data returned from sendPushToken: " + JSON.stringify(data));
              resolve(true);
            } else {
              console.log("no data returned from sendPushToken");
              reject(false);
            }
          }, error => {
            console.log("error during sendPushToken to server: ", error);
            reject(false);
          })
        }
      }
      catch (error) {
        console.log("error during sendPushToken to server: ", error);
        reject(false);
      }
    })
  }

  private async getDeviceInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        var deviceInfo = {
          "device_unique_id": this.global.getDeviceId(),
          "osVersion": this.global.getDevicePlatformVersion(),
          "deviceModel": this.global.getDeviceModel(),
          "platform": this.global.getDevicePlatform(),
          "manufacturer": this.global.getDeviceManufacturer()
        };
        resolve(deviceInfo);
      }
      catch (error) {
        console.log("error during getDeviceInfo: ", error);
        reject(false);
      }
    })
  }

  loginFB() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', res);
        alert(JSON.stringify(res));
      })
      .catch(e => {
        console.log('Error logging into Facebook', e)
        alert(JSON.stringify(e));
      });
  }

  loginGoogle() {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        alert(JSON.stringify(res));
      })
      .catch(err => {
        console.error(err);
        alert(JSON.stringify(err));
      });
  }
}
