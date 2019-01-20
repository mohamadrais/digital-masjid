import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
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
  selector: 'page-khairat-list',
  templateUrl: 'khairat-list.html',
})
export class KhairatListPage {

  userType;
  khairats;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public global:Globals) {
    this.global.get(AppConstants.USER).then(data => {
      if( data){
        this.userType = data.userType;
        if(data.userType === AppConstants.USER_TYPE_ADMIN){
          //getListOfKhairat_admin
        } else if( data.userType === AppConstants.USER_TYPE_USER ) {
          //getListOfKhairat_user
          this.getUserKhairatList(data._id);
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KhairatListPage');
  }

  getUserKhairatList(userId){
    this.httpService.getKhairatDetails(userId, null).subscribe(data =>{
      this.khairats = data;
    });
  }

  getAdminKhairatList(){

  }
    
}
