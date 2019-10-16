import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { Diagnostic } from '@ionic-native/diagnostic';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MosquePage } from '../mosque/mosque';
import { MosqueEventUrlPage } from '../mosque-event-url/mosque-event-url'
/**
 * Generated class for the KariahPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-mosque-manage',
  templateUrl: 'mosque-manage.html',
})
export class MosqueManagePage {

  userId;
  userType;
  mosques;
  isAdmin = false;
  mosquesManaged = [];
  mosque_url: any = []; // link, displayText

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public global: Globals, public alertCtrl: AlertController, private diagnostic: Diagnostic, private iab: InAppBrowser) {

    this.userId = this.global.getUserId();
    this.userType = this.global.getUserType();
    this.mosquesManaged = this.global.getUserMosquesManaged();

    if (this.userType === AppConstants.USER_TYPE_ADMIN) {
      //getListOfKariah_admin
      this.isAdmin = true;
      this.getAdminMosqueList();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MosqueManagePage');
  }


  getAdminMosqueList() {
    // this.userId here refers to currently logged in admin's managed mosques' google place ids
    this.httpService.getRegisteredMosquesById(this.mosquesManaged).subscribe(data => {
      this.mosques = data;
      if (this.mosques.length > 0) {
        for (var i = 0; i < this.mosques.length; i++) {
          if (this.mosques[i].mosque_url == null || !this.mosques[i].mosque_url)
            this.mosques[i].mosque_url = [];
        }
      }

    });
  }

  showConfirmDeleteURL(m, i, mosqueIndex) {
    const confirm = this.alertCtrl.create({
      title: 'Do you wish to delete this URL?',
      message: 'By clicking delete, this URL will be no longer be visible.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this.deleteUrl(m, i, mosqueIndex);
          }
        }
      ]
    });
    confirm.present();
  }


  //URL

  addUpdateMosqueUrl(m, index, mosqueIndex) {
    this.navCtrl.push(MosqueEventUrlPage, {
      "data": (index != null) ? m.mosque_url[index] : '',
      callback: data => {
        console.log('current mosque url: ' + m.mosque_url);
        if (index != null) {
          m.mosque_url[index] = data;
          this.mosques[mosqueIndex] = m;
          this.updateMosqueURL(this.mosques[mosqueIndex], mosqueIndex);
        } else {
          m.mosque_url.push(data);
          this.mosques[mosqueIndex] = m;
          this.updateMosqueURL(this.mosques[mosqueIndex], mosqueIndex);
        }
      }
    })
  }

  deleteUrl(m, i: number, mosqueIndex) {
    m.mosque_url.splice(i, 1);
    this.mosques[mosqueIndex] = m;

    this.updateMosqueURL(this.mosques[mosqueIndex], mosqueIndex);
  }

  updateMosqueURL(newMosqueDetails, mosqueIndex) {
    this.httpService.updateMosque(newMosqueDetails).subscribe(data => {
      this.mosques[mosqueIndex] = data;
      if (this.mosques[mosqueIndex].mosque_url == null || !this.mosques[mosqueIndex].mosque_url)
        this.mosques[mosqueIndex].mosque_url = [];
    });
  }

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

  // openKariahDetail(kariahMember) {
  //   this.navCtrl.push(KariahPage, { "admin_kariahMemberDetail": kariahMember });
  // }
}
