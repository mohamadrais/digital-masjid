import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/User';
import { DateUtil } from "../../app/util/date-util";
import { HttpService } from "../../app/service/http-service";
import { HomePage } from '../home/home';
import { LoginPage } from "../login/login";
import { AlertController } from 'ionic-angular';
import { ImageProvider } from '../../providers/image/image';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ForgotPassword } from '../forgot-password/forgotPassword';
import { Url } from "../../app/models/MosqueEventsUrl";
import { MosqueEventUrlPage } from '../mosque-event-url/mosque-event-url';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [LoginPage]
})
export class RegisterPage {

  email: string;
  name: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  icnumber: string;
  gender: string;
  mobile: string;
  user_url: Array<Url> = [];
  userThumbnail: any = ""; //Model for storing selected image value
  userImage: any = ""; //Model for storing selected image value
  preferredMosque: string;
  private user: User;
  valid: boolean = true;
  userData: User;
  isUstaz: boolean = false;
  isAdmin: boolean = false;
  editMode: boolean = false;
  dob: string;
  deviceInfo: any;
  verifiedEmail = false;
  didUrlListChange: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController, public global: Globals, public login: LoginPage, public iab: InAppBrowser, private _IMAGE: ImageProvider) {
    //if loggedIn
    this.userData = this.navParams.get("data");
    if (this.userData) {
      this.email = this.userData.email;
      this.name = this.userData.name;
      if (this.userData.user_url && this.userData.user_url.length != 0) {
        this.user_url = this.userData.user_url;
      }
      if (this.userData.userImage && this.userData.user_url.length != 0) {
        this.userImage = this.userData.userImage;
        this.userThumbnail = this.userData.userImage.toString();
      }
      // this.nickname = this.userData.nickname;
      // this.icnumber = this.userData.icnumber;
      // this.gender = this.userData.gender;
      this.mobile = this.userData.mobile;
      // this.preferredMosque = this.userData.preferredMosque;
      this.dob = this.userData.dob;
      if (this.userData.userType === AppConstants.USER_TYPE_MODERATOR) {
        this.isUstaz = true;
      }
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
    this.userData.user_url = this.user_url;
    this.userData.userImage = this.userImage;
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

      // check if url changed
      if (!(this.arraysEqual(this.user_url, this.userData.user_url))) {
        this.didUrlListChange = true;
      }
      return ((this.name && this.name != this.userData.name)
        || (this.password && this.password != this.userData.password)
        || (this.mobile && this.mobile != this.userData.mobile)
        || (this.dob && this.dob != this.userData.dob)
        || (this.userImage && this.userImage != this.userData.userImage)
        || (this.didUrlListChange)
      );
    } else {
      // return (this.email && this.name && this.password && this.icnumber && this.mobile && this.preferredMosque && this.gender && this.nickname);
      return (this.email && this.name && this.password && this.mobile && this.dob && this.userImage);
    }
  }

  //URL

  addUpdateUserUrl(index) {
    this.navCtrl.push(MosqueEventUrlPage, {
      "data": (index != null) ? this.user_url[index] : '',
      callback: data => {
        console.log('current user url: ' + this.userData.user_url);
        if (index != null) {
          this.user_url[index] = data;
        } else {
          this.user_url.push(data);
        }
      }
    })
  }

  deleteUserUrl(i: number) {
    this.user_url.splice(i, 1)
  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
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

  verifyToken() {
    const confirm = this.alertCtrl.create({
      title: 'We have sent verification code to ' + this.email + ".",
      subTitle: "Please fill in the code into the input below:",
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'verificationCode',
          placeholder: 'Verification Code'
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (data.verificationCode) {
              this.httpService.verifyEmailToken(data.verificationCode, this.email).subscribe(data => {
                if (data.status == "success") {
                  this.verifiedEmail = true;
                } else if (data.status == "failure") {
                  alert(data.message);
                } else {
                  alert("Server error");
                }
              })
            }
          }
        }
      ]
    });
    confirm.present();
  }

  sendVerificationCode() {
    this.httpService.checkEmailExists(this.email).subscribe(data => {
      if (data.status == "failure") {
        this.httpService.verifyEmail(this.email).subscribe(data => {
          if (data.status == "success") {
            console.log("data from sendVerificationCode: " + data);
            this.verifyToken();
          } else if (data.status == "failure") {
            alert(data.message);
          } else {
            alert("Server error");
          }
        })
      } else if (data.status == "success") {
        const emailExistAlert = this.alertCtrl.create({
          title: 'Email address ' + this.email + ' already exists!',
          subTitle: "Please click on 'Forgot Password' if you wish to reset your password instead",
          buttons: [
            {
              text: 'Reset Password',
              handler: () => {
                this.navCtrl.pop().then(() => {
                  this.navParams.get('callback')({ "forgotPassword": true });
                });
              }
            },
            {
              text: 'Cancel',
              handler: data => {
                //do nothing
              }
            }
          ]
        });
        emailExistAlert.present();
      }

    })

    //this.moveSlide();
  }

  terms() {
    const browser = this.iab.create("https://legal.sfo2.cdn.digitaloceanspaces.com/privacy-policy.html", '_self', 'location=yes');
    browser.show();
  }

  removeVerifiedEmail() {
    this.email = '';
    this.verifiedEmail = false;
  }

  /**
  * Use the device camera to capture a photographic image
  * (courtesy of the takePhotograph method of the ImageProvider
  * service) and assign this, as a bade64-encoded string, to
  * public properties used in the component template
  *
  * @public
  * @method takePhotograph
  * @return {None}
  */
  takePhotograph(): void {

    this._IMAGE
      .takePhotograph()
      .then((image) => {
        this.userThumbnail = image.toString();
        this.userImage = image.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Use the device photolibrary to select a photographic image
   * (courtesy of the takePhotograph method of the ImageProvider
   * service) and assign this, as a bade64-encoded string, to
   * public properties used in the component template
   *
   * @public
   * @method selectImage
   * @return {None}
   */
  selectImage(): void {
    this._IMAGE
      .selectPhotograph()
      .then((image) => {
        this.userThumbnail = image.toString();
        this.userImage = image.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
