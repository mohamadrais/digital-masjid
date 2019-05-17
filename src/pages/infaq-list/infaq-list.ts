import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { Diagnostic } from '@ionic-native/diagnostic';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InfaqPage } from '../infaq/infaq';
/**
 * Generated class for the InfaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-infaq-list',
  templateUrl: 'infaq-list.html',
})
export class InfaqListPage {

  userId;
  userType;
  infaqs;
  isAdmin = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public global: Globals, public alertCtrl: AlertController, private diagnostic: Diagnostic, private iab: InAppBrowser) {

    this.userId = this.global.getUserId();
    this.userType = this.global.getUserType();
    if (this.userType === AppConstants.USER_TYPE_ADMIN) {
      this.isAdmin = true;
    } else if (this.userType === AppConstants.USER_TYPE_USER) {
      this.isAdmin = false;
    }
    this.getInfaqList(this.userId, this.userType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfaqListPage');
  }

  async getInfaqList(userId, userType) {
    return new Promise(async (resolve, reject) => {
      await this.httpService.getInfaqDetails(userId, userType).subscribe(data => {
        if (data && data.status && data.status == 'true') {
          this.infaqs = data.result;
          resolve(true);
        }
        else {
          this.infaqs = [];
          resolve(true);
        }
      });
    })
  }



  // downloadInfaqMembersList() {
  //   this.httpService.downloadInfaqMemberList(this.userId);
  // }


  // failAlert() {
  //   const confirm = this.alertCtrl.create({
  //     title: 'Error occured',
  //     message: 'Please try again later',
  //     buttons: [
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  openInfaqDetail(infaq) {
    this.navCtrl.push(InfaqPage, { "infaqDetail": infaq, fromSideMenu: true});
  }
}
