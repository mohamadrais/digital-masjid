import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpService } from "../../app/service/http-service";
import { ImageProvider } from '../../providers/image/image';
import { KhairatOtherAccountPage } from '../khairat-other-account/khairat-other-account'
import { Globals} from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
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

  public cameraImage: String
  public billName: any;
  public billThumbnail: any; //Model for storing selected image value
  public billImage: any; //Model for storing selected image value
  public khairatMembers: any=[]; //name, ic, gender
  private _ID: String; // Stores the MongoDB document ID for the record being displayed/amended

  isAdmin;
  mosqueGooglePlaceId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, private _IMAGE: ImageProvider, public httpService:HttpService, public alertCtrl:AlertController, public global:Globals) {

    this.mosqueGooglePlaceId = this.navParams.get("mosqueGooglePlaceId");
    this.global.get(AppConstants.USER).then(data => {
      if( data){
        if(data.userType === AppConstants.USER_TYPE_ADMIN){
          this.isAdmin = true;
        } else if( data.userType === AppConstants.USER_TYPE_USER ) {
          //getListOfKhairat_user
          this.isAdmin = false;
          this.getUserKhairat(data._id);
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KhairatPage');
  }

  getUserKhairat(userId){
    this.httpService.getKhairatDetails(userId, this.mosqueGooglePlaceId).subscribe(data =>{
      // this.khairats = data;
      console.log(data);
    });
  }

  pay() {
    const browser = this.iab.create('https://app.senangpay.my/payment/898154475783162');
    browser.show();
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

  getKhairatMembersIdArray() {
    let uList = [];
    for (let x = 0; x < this.khairatMembers.length; x++) {
      uList.push(this.khairatMembers[x]._id);
    }
    return uList;
  }

  addUpdateKhairatMember(index){
    this.navCtrl.push(KhairatOtherAccountPage, {
      "data": (index!=null)?this.khairatMembers[index]:'',
      "mosqueGooglePlaceId":this.mosqueGooglePlaceId,
      callback: data => {
        if (index!=null) {
          this.khairatMembers[index] = data
        }else{
          this.khairatMembers.push(data);
        }
      }
    })
  }

  deleteKhairatMember(i: number) {
    this.khairatMembers.splice(i, 1)
  }

}
