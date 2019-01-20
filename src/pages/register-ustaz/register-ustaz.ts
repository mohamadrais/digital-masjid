import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdminHomePage } from '../admin-home/admin-home';
import { AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController) {
    this.fromSearch = navParams.get('data');
    this.name = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterUstazPage');
  }


  adminhomePage() {
    this.navCtrl.push(AdminHomePage)
  }

  registerUstaz() {
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
      this.httpService.registerUser(this.user).subscribe(data => {
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
        //Rais: Throw validation error message here
      })
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
}
