import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdminHomePage } from '../admin-home/admin-home';
import { AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { User } from '../../app/models/User';

/**
 * Generated class for the RegisterUstazPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-register-ustaz',
  templateUrl: 'register-ustaz.html',
})
export class RegisterUstazPage {
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
  fromSearch: string = "";
  deviceInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController, public global: Globals) {
    this.fromSearch = navParams.get('data');
    this.name = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterUstazPage');
  }


  adminhomePage() {
    this.navCtrl.push(AdminHomePage)
  }

  async registerUstaz() {
    if (this.email && this.name && this.password && this.icnumber
      && this.mobile && this.gender) {
      this.valid = true;
      this.user = new User();
      this.user.email = this.email;
      this.user.name = this.name;
      this.user.nickname = "Moderator";
      this.user.password = this.password;
      this.user.gender = this.gender;
      this.user.icnumber = this.icnumber;
      this.user.mobile = this.mobile;
      this.user.preferredMosque = "";
      this.user.active = "Y";
      this.user.userType = "USTAZ";
      this.user.createdTimestamp = (new Date()).toISOString();
      this.user.updatedTimestamp = (new Date()).toISOString();
      this.deviceInfo = await this.getDeviceInfo();
      if (this.deviceInfo) {
        this.httpService.registerUser(this.user, this.deviceInfo).subscribe(data => {
          if (data) {
            if (data.status && data.status == "failure") {
              this.showError(data.message);
            }
            else {
              this.showConfirm();
              if (this.fromSearch) {
                this.navCtrl.pop().then(() => {
                  this.navParams.get('callback')(this.user.name);
                });
              } else {
                this.navCtrl.setRoot(AdminHomePage);
              }
            }
          }
        }, error => {
          //Rais: Show proper validation error message here
          console.log("error during registerUstaz: ", error);
        })
      }
    } else {
      this.valid = false;
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
      title: 'New Ustaz created!',
      message: 'Account for ' + this.user.name + ' has been successfully created.',
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
