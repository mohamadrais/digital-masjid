import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Globals} from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
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

  userType;
  kariahs;
  isAdmin = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public global:Globals, public alertCtrl: AlertController,) {
    this.global.get(AppConstants.USER).then(data => {
      if( data){
        this.userType = data.userType;
        if(data.userType === AppConstants.USER_TYPE_ADMIN){
          //getListOfKariah_admin
          this.isAdmin = true;
        } else if( data.userType === AppConstants.USER_TYPE_USER ) {
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

  getUserKariahList(userId){
    this.httpService.getKariahDetails(userId, null).subscribe(data =>{
      this.kariahs = data;
    });
  }

  getAdminKariahList(){

  }
    
  downloadKariahMembersList(){
    //to download csv file
    this.httpService.getKariahMemberList("ChIJb_FgVqO1zTERF5BtL8rX80M").subscribe(res => {
      if(res && res.status && res.status.toLowerCase() == "failure"){
        this.failAlert();
      }
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
}
