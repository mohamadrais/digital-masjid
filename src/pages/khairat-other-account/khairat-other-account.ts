import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";

/**
 * Generated class for the KhairatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-khairat-other-account',
  templateUrl: 'khairat-other-account.html',
})
export class KhairatOtherAccountPage {

  public khairatHeirs ={"fullName":"", "icNumber":"", "relation":""}; //name, ic, relation for heirs
  public updateMode=false;
  public khairatMosqueGooglePlaceId;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
    if(this.navParams.get('data')){
      this.khairatHeirs = this.navParams.get('data');
      this.updateMode = true;
    }
    this.khairatMosqueGooglePlaceId = this.navParams.get('mosqueGooglePlaceId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KhairatOtherAccountPage');
  }

  addUpdateAccount() {
    this.httpService.checkKhairatExist(this.khairatHeirs.icNumber, this.khairatMosqueGooglePlaceId).subscribe(data => {
      if(data.status=="failure"){ //if not found
        this.navParams.get('callback')(this.khairatHeirs);
      }else if(data.status=="success"){
        alert("Error: Already exist")
      }
      this.navCtrl.pop();
    })
    
  }
}
