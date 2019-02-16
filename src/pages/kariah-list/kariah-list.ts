import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { Diagnostic } from '@ionic-native/diagnostic';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { KariahPage } from '../kariah/kariah';
/**
 * Generated class for the KariahPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-kariah-list',
  templateUrl: 'kariah-list.html',
})
export class KariahListPage {

  userId;
  userType;
  kariahs;
  isAdmin = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public global: Globals, public alertCtrl: AlertController, private diagnostic: Diagnostic, private iab: InAppBrowser) {
    this.global.get(AppConstants.USER).then(data => {
      if (data) {
        this.userId = data._id;
        this.userType = data.userType;
        if (data.userType === AppConstants.USER_TYPE_ADMIN) {
          //getListOfKariah_admin
          this.isAdmin = true;
          this.getAdminKariahList();
        } else if (data.userType === AppConstants.USER_TYPE_USER) {
          //getListOfKariah_user
          this.getUserKariahList(data._id);
          this.isAdmin = false;
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KariahListPage');
  }

  getUserKariahList(userId) {
    this.httpService.getKariahDetails(userId, null).subscribe(data => {
      this.kariahs = data;
    });
  }

  getAdminKariahList() {
    this.httpService.getKariahUsersByAdminIdList(this.userId).subscribe(data => {
      this.kariahs = data;
    });
  }



  downloadKariahMembersList() {
    this.httpService.downloadKariahMemberList(this.userId);
  }

  //to download csv file
  // console.log("this.userId: " + this.userId);
  // this.diagnostic.requestExternalStorageAuthorization().then(() => {
  //   this.httpService.downloadKariahMemberList(this.userId);
  // }).catch(error => {
  //   console.log("error: "+ error)
  // });


  // .subscribe(res => {
  //   if(res && res.status && res.status.toLowerCase() == "failure"){
  //     console.log("error during download: " + res.message);
  //     this.failAlert();
  //   }
  // });

  failAlert() {
    const confirm = this.alertCtrl.create({
      title: 'Error occured',
      message: 'Please try again later',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  openKariahDetail(kariahMember){
    this.navCtrl.push(KariahPage,{"admin_kariahMemberDetail":kariahMember});
  }
}
