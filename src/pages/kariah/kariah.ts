import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpService } from "../../app/service/http-service";
import { ImageProvider } from '../../providers/image/image';
import { KariahOtherAccountPage } from '../kariah-other-account/kariah-other-account'
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { KariahUser } from "../../app/models/KariahUser";
import { HomePage } from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';
import { Camera } from '@ionic-native/camera';
import { PopoverKariahApprovalPage } from './popover-kariah-approval';
import { User } from '../../app/models/User';

/**
 * Generated class for the KariahPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-kariah',
  templateUrl: 'kariah.html',
})
export class KariahPage {
  valid: boolean = true;
  editMode: boolean = false;

  private _id: String; // Stores the MongoDB document id for the record being displayed/amended
  userId: string;
  newKariahUser;
  kariahUserFullName: string;
  kariahUserIcnumber: string;
  addressLine1: string;
  addressLine2: string;
  postCode: string;
  maritalStatus: string;
  occupation: string;
  kariahMosqueGooglePlaceId: string; // mosque google place id
  kariahHeirs: any = []; //name, ic, gender
  cameraImage: String
  billName: any;
  billThumbnail: any; //Model for storing selected image value
  billImage: any; //Model for storing selected image value
  approvalStatus: string;
  approvalComment: string;
  approvalBy: string; // adminId from admin_kariahMemberDetail
  newApproverId: string;

  isAdmin;
  currentUserType;
  mosqueGooglePlaceId: any; // auto-fill mosque google place id from previous mosque page
  kariah: any; // auto-fill mosque title from previous mosque page
  kariahUser: KariahUser;
  isRoot = false;
  userData: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, private _IMAGE: ImageProvider, public httpService: HttpService, public alertCtrl: AlertController, public global: Globals, public camera: Camera, public popoverCtrl: PopoverController, public events:Events) {

    this.mosqueGooglePlaceId = this.navParams.get("mosqueGooglePlaceId");
    this.kariah = this.navParams.get("mosqueTitle");
    this.isRoot = this.navParams.get("fromSideMenu");
    this.userData = this.global.getUser();
    if (this.userData.userType === AppConstants.USER_TYPE_ADMIN) {
      this.currentUserType = AppConstants.USER_TYPE_ADMIN;
      this.isAdmin = true;
      this.kariahUser = this.navParams.get("admin_kariahMemberDetail");
      this.newApproverId = this.userData._id;
      if (this.kariahUser) {
        this.initKariahUser();
        this.setEditMode(true);
      }
    } else if (this.userData.userType === AppConstants.USER_TYPE_USER) {
      //getListOfKariah_user
      this.userId = this.userData._id;
      this.currentUserType = AppConstants.USER_TYPE_USER;
      this.isAdmin = false;

      //temp comment the global storage because to check if online search working or not
      this.kariahUser = null//this.global.getKariahUser();

      if (this.kariahUser) {
        this.initKariahUser();
        this.setEditMode(true);
      } else {
        this.getUserKariahOnline(this.userId);
      }

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KariahPage');

    this.events.subscribe('userType:admin', data => {
      this.getUserKariahOnline(this.userId);
    });
  }

  initKariahUser() {
    this._id = this.kariahUser._id;
    this.userId = this.kariahUser.userId;
    this.kariahUserFullName = this.kariahUser.kariahUserFullName;
    this.kariahUserIcnumber = this.kariahUser.kariahUserIcnumber;
    this.addressLine1 = this.kariahUser.addressLine1;
    this.addressLine2 = this.kariahUser.addressLine2;
    this.postCode = this.kariahUser.postCode;
    this.kariah = this.kariahUser.kariah;
    this.maritalStatus = this.kariahUser.maritalStatus;
    this.occupation = this.kariahUser.occupation;
    this.kariahMosqueGooglePlaceId = this.kariahUser.kariahMosqueGooglePlaceId;
    this.kariahHeirs = this.kariahUser.heirs;
    this.billImage = this.kariahUser.billImage;
    this.billThumbnail = this.kariahUser.billImage.toString();
    this.approvalStatus = this.kariahUser.approvalStatus;
    this.approvalComment = this.kariahUser.approvalComment;
    this.approvalBy = this.kariahUser.approvalBy;
  }

  getUserKariahOnline(userId) {
    this.httpService.getKariahDetails(userId, this.mosqueGooglePlaceId).subscribe(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        this.kariahUser = data[0];
        this.setEditMode(true);
        this.initKariahUser();
      }
      // } else if (data != null) {
      //   this.kariahUser = data;
      //   this.setEditMode(true);
      // }
      // this.initKariahUser();
      console.log(data);
    });
  }

  setEditMode(kariahInfoExist) {
    this.editMode = kariahInfoExist;
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
    this.newKariahUser = new KariahUser();
    this.newKariahUser.userId = this.userId;
    this.newKariahUser.kariahUserFullName = this.kariahUserFullName;
    this.newKariahUser.kariahUserIcnumber = this.kariahUserIcnumber;
    this.newKariahUser.addressLine1 = this.addressLine1;
    this.newKariahUser.addressLine2 = this.addressLine2;
    this.newKariahUser.postCode = this.postCode;
    this.newKariahUser.kariah = this.kariah;
    this.newKariahUser.maritalStatus = this.maritalStatus;
    this.newKariahUser.occupation = this.occupation;
    this.newKariahUser.kariahMosqueGooglePlaceId = this.mosqueGooglePlaceId;
    this.newKariahUser.heirs = this.kariahHeirs.slice();
    this.newKariahUser.billImage = this.billImage;
    this.newKariahUser.approvalStatus = this.approvalStatus;
    this.newKariahUser.approvalComment = this.approvalComment;
    this.newKariahUser.approvalBy = this.approvalBy;
  }

  createKariahUser() {
    if (this.validateData()) {

      this.prepareData();

      this.httpService.registerKariahUser(this.newKariahUser).subscribe(data => {
        if (data && data.userId) {
          //this.navCtrl.push(HomePage)
          if (this.isAdmin) {
            this.serverResponseSuccess(true);
          } else {
            this.serverResponseSuccess(true);
          }
        }
      }, error => {
        console.log("error creating new kariah user: " + error);
        this.serverResponseSuccess(false);
      });
    } else {
      this.valid = false;
    }
  }

  updateKariahUser() {
    if (this.validateData()) {

      this.prepareData();

      this.httpService.updateKariahUser(this.newKariahUser, this.currentUserType).subscribe(data => {
        if (data.status == "success") {
          console.log("successfully updated kariah user details");
          this.serverResponseSuccess(true);
        }
      }, error => {
        console.log("error updating kariah user: " + error);
        this.serverResponseSuccess(false);
      });
    } else {
      this.valid = false;
    }
  }

  serverResponseSuccess(resStatus) {
    let mode = (this.editMode) ? 'update' : 'create';
    let alertTitle = 'Kariah membership succesfully ' + ((this.editMode) ? 'updated' : 'created');
    if (!resStatus) {
      alertTitle = 'Kariah membership could not be' + ((this.editMode) ? 'updated' : 'created');
    }
    const confirm = this.alertCtrl.create({
      title: alertTitle,
      message: (resStatus) ? "" : "Please retry later",
      buttons: [
        {
          text: (resStatus) ? "Alhamdulillah" : "Close",
          handler: () => {
            console.log(mode + ' clicked');
            this.global.set("KARIAH_USER", this.newKariahUser)
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

  getkariahHeirsIdArray() {
    let uList = [];
    for (let x = 0; x < this.kariahHeirs.length; x++) {
      uList.push(this.kariahHeirs[x]._id);
    }
    return uList;
  }

  addUpdatekariahHeir(index) {
    this.navCtrl.push(KariahOtherAccountPage, {
      "data": (index != null) ? this.kariahHeirs[index] : '',
      "mosqueGooglePlaceId": this.mosqueGooglePlaceId,
      callback: data => {
        if (index != null) {
          this.kariahHeirs[index] = data
        } else {
          this.kariahHeirs.push(data);
        }
      }
    })
  }

  deletekariahHeir(i: number) {
    this.kariahHeirs.splice(i, 1)
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
            (this.editMode) ? this.updateKariahUser() : this.createKariahUser();
            this.global.set("KARIAH_USER", this.newKariahUser)
          }
        }
      ]
    });
    confirm.present();
  }

  popupHeirDetails(heir) {
    const viewHeir = this.alertCtrl.create({
      title: heir.h_fullName,
      message: 'IC number: ' + heir.h_icnumber + '<br/>Relation: ' + heir.h_relation,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Ok clicked');
          }
        }
      ]
    });
    viewHeir.present();
  }

  showApprovalConfirm() {
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
            (this.editMode) ? this.updateKariahUser() : this.createKariahUser();
            this.global.set("KARIAH_USER", this.newKariahUser)
          }
        }
      ]
    });
    confirm.present();
  }

  popoverKariahApproval(myEvent) {
    let popover = this.popoverCtrl.create(PopoverKariahApprovalPage, {
      "currentUserType": this.currentUserType,
      "newApproverId": this.newApproverId,
      "kariahUser": this.kariahUser,
      "currentApprovalStatus": this.kariahUser.approvalStatus,
      "currentApprovalComment": this.kariahUser.approvalComment,
      "currentApprovalBy": this.kariahUser.approvalBy
    }, { showBackdrop: true, cssClass: "popover-rating" });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.kariahUser = data.kariahUser;
        this.approvalBy = data.newApproverId;
        this.approvalComment = data.newApprovalComment;
        this.approvalStatus = data.newApprovalStatus;
      }
    })
  }

  goBack() {
    this.navCtrl.pop();
  }
}
