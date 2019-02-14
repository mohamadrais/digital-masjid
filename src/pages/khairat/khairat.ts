import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpService } from "../../app/service/http-service";
import { ImageProvider } from '../../providers/image/image';
import { KhairatOtherAccountPage } from '../khairat-other-account/khairat-other-account'
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { KhariahUser } from "../../app/models/KhariahUser";
import { HomePage } from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';

/**
 * Generated class for the KhairatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-khairat',
  templateUrl: 'khairat.html',
})
export class KhairatPage {
  valid: boolean = true;
  editMode: boolean = false;

  private _id: String; // Stores the MongoDB document id for the record being displayed/amended
  userId: string;
  newKhariahUser;
  khariahUserFullName: string;
  khariahUserIcnumber: string;
  addressLine1: string;
  addressLine2: string;
  postCode: string;
  maritalStatus: string;
  occupation: string;
  khairatMosqueGooglePlaceId: string; // mosque google place id
  khairatHeirs: any = []; //name, ic, gender
  cameraImage: String
  billName: any;
  billThumbnail: any; //Model for storing selected image value
  billImage: any; //Model for storing selected image value

  isAdmin;
  currentUserType;
  mosqueGooglePlaceId: any; // auto-fill mosque google place id from previous mosque page
  khariah: any; // auto-fill mosque title from previous mosque page
  khariahUser: KhariahUser;
  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, private _IMAGE: ImageProvider, public httpService: HttpService, public alertCtrl: AlertController, public global: Globals) {

    this.mosqueGooglePlaceId = this.navParams.get("mosqueGooglePlaceId");
    this.khariah = this.navParams.get("mosqueTitle");
    this.global.get(AppConstants.USER).then(data => {
      if (data) {
        if (data.userType === AppConstants.USER_TYPE_ADMIN) {
          this.currentUserType = AppConstants.USER_TYPE_ADMIN;
          this.isAdmin = true;
        } else if (data.userType === AppConstants.USER_TYPE_USER) {
          //getListOfKhairat_user
          this.userId = data._id;
          this.currentUserType = AppConstants.USER_TYPE_USER;
          this.isAdmin = false;

          //temp comment the global storage because to check if online search working or not
          this.khariahUser = null//this.global.getKhariahUser();

          if (this.khariahUser) {
            this.initKhariahUser();
            this.setEditMode(true);
          } else {
            this.getUserKhairatOnline(this.userId);
          }

        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KhairatPage');
  }

  initKhariahUser() {
    this._id = this.khariahUser._id;
    this.userId = this.khariahUser.userId;
    this.khariahUserFullName = this.khariahUser.khariahUserFullName;
    this.khariahUserIcnumber = this.khariahUser.khariahUserIcnumber;
    this.addressLine1 = this.khariahUser.addressLine1;
    this.addressLine2 = this.khariahUser.addressLine2;
    this.postCode = this.khariahUser.postCode;
    this.khariah = this.khariahUser.khariah;
    this.maritalStatus = this.khariahUser.maritalStatus;
    this.occupation = this.khariahUser.occupation;
    this.khairatMosqueGooglePlaceId = this.khariahUser.khairatMosqueGooglePlaceId;
    this.khairatHeirs = this.khariahUser.heirs;
    this.billImage = this.khariahUser.billImage;
    this.billThumbnail = this.khariahUser.billImage.toString();
  }

  getUserKhairatOnline(userId) {
    this.httpService.getKhairatDetails(userId, this.mosqueGooglePlaceId).subscribe(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        this.khariahUser = data[0];
        this.setEditMode(true);
        this.initKhariahUser();
      }
      // } else if (data != null) {
      //   this.khariahUser = data;
      //   this.setEditMode(true);
      // }
      // this.initKhariahUser();
      console.log(data);
    });
  }

  setEditMode(khariahInfoExist) {
    this.editMode = khariahInfoExist;
  }

  pay() {
    const browser = this.iab.create('https://app.senangpay.my/payment/898154475783162');
    browser.show();
  }

  validateData() {
    // @TODO: validate form data
    return true;
  }

  prepareData() {
    this.newKhariahUser = new KhariahUser();
    this.newKhariahUser.userId = this.userId;
    this.newKhariahUser.khariahUserFullName = this.khariahUserFullName;
    this.newKhariahUser.khariahUserIcnumber = this.khariahUserIcnumber;
    this.newKhariahUser.addressLine1 = this.addressLine1;
    this.newKhariahUser.addressLine2 = this.addressLine2;
    this.newKhariahUser.postCode = this.postCode;
    this.newKhariahUser.khariah = this.khariah;
    this.newKhariahUser.maritalStatus = this.maritalStatus;
    this.newKhariahUser.occupation = this.occupation;
    this.newKhariahUser.khairatMosqueGooglePlaceId = this.mosqueGooglePlaceId;
    this.newKhariahUser.heirs = this.khairatHeirs;
    this.newKhariahUser.billImage = this.billImage;
  }

  createKhairatUser() {
    if (this.validateData()) {

      this.prepareData();

      this.httpService.registerKhairatUser(this.newKhariahUser).subscribe(data => {
        if (data && data.userId) {
          //this.navCtrl.push(HomePage)
          if (this.isAdmin) {
            this.serverResponseSuccess(true);
          } else {
            this.serverResponseSuccess(true);
          }
        }
      }, error => {
        console.log("error creating new khariah user: " + error);
        this.serverResponseSuccess(false);
      });
    } else {
      this.valid = false;
    }
  }

  updateKhairatUser() {
    if (this.validateData()) {

      this.prepareData();

      this.httpService.updateKhairatUser(this.newKhariahUser, this.currentUserType).subscribe(data => {
        if (data.status == "success") {
          console.log("successfully updated khariah user details");
          this.serverResponseSuccess(true);
        }
      }, error => {
        console.log("error updating khariah user: " + error);
        this.serverResponseSuccess(false);
      });
    } else {
      this.valid = false;
    }
  }

  serverResponseSuccess(resStatus) {
    let mode = (this.editMode) ? 'update' : 'create';
    let alertTitle = 'Khariah membership succesfully ' + ((this.editMode) ? 'updated' : 'created');
    if(!resStatus){
      alertTitle = 'Khariah membership could not be' + ((this.editMode) ? 'updated' : 'created');
    }
    const confirm = this.alertCtrl.create({
      title: alertTitle,
      message:(resStatus)?"":"Please retry later",
      buttons: [
        {
          text: (resStatus)?"Alhamdulillah":"Close",
          handler: () => {
            console.log(mode + ' clicked');
            this.global.set("KHARIAH_USER", this.newKhariahUser)
          }
        }
      ]
    });
    confirm.present();
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
        this.billThumbnail = image.toString();
        this.billImage = image.toString();
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
        this.billThumbnail = image.toString();
        this.billImage = image.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getkhairatHeirsIdArray() {
    let uList = [];
    for (let x = 0; x < this.khairatHeirs.length; x++) {
      uList.push(this.khairatHeirs[x]._id);
    }
    return uList;
  }

  addUpdatekhairatHeir(index) {
    this.navCtrl.push(KhairatOtherAccountPage, {
      "data": (index != null) ? this.khairatHeirs[index] : '',
      "mosqueGooglePlaceId": this.mosqueGooglePlaceId,
      callback: data => {
        if (index != null) {
          this.khairatHeirs[index] = data
        } else {
          this.khairatHeirs.push(data);
        }
      }
    })
  }

  deletekhairatHeir(i: number) {
    this.khairatHeirs.splice(i, 1)
  }

  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage() {
    this.navCtrl.setRoot(AdminHomePage)
  }

  showConfirm() {
    let mode = (this.editMode) ? 'update' : 'create';

    const confirm = this.alertCtrl.create({
      title: 'Do you wish to ' + mode + ' this membership?',
      message: 'By clicking ' + mode + ', your membership will be ' + mode + 'd and Displayed.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: mode,
          handler: () => {
            console.log(mode + ' clicked');
            (this.editMode) ? this.updateKhairatUser() : this.createKhairatUser();
            this.global.set("KHARIAH_USER", this.newKhariahUser)
          }
        }
      ]
    });
    confirm.present();
  }
}
