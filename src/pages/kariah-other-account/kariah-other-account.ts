import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";

/**
 * Generated class for the KariahPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-kariah-other-account',
  templateUrl: 'kariah-other-account.html',
})
export class KariahOtherAccountPage {

  public kariahHeirs = { "h_fullName": "", "h_icnumber": "", "h_relation": "" }; //name, ic, relation for heirs
  public updateMode = false;
  public kariahMosqueGooglePlaceId;
  public currentIcnumber; // to check if icnumber is changed or not during updateMode

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
    if (this.navParams.get('data')) {
      this.kariahHeirs = this.navParams.get('data');
      this.currentIcnumber = this.kariahHeirs.h_icnumber;
      this.updateMode = true;
    }
    this.kariahMosqueGooglePlaceId = this.navParams.get('mosqueGooglePlaceId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KariahOtherAccountPage');
  }

  addUpdateAccount() {
    // if it is in update mode and ic number has not changed
    if (this.updateMode && this.kariahHeirs.h_icnumber == this.currentIcnumber) {
      this.navParams.get('callback')(this.kariahHeirs);
      this.navCtrl.pop();
    }
    // otherwise check if icnumber already exists
    else {
      this.httpService.checkKariahExist(this.kariahHeirs.h_icnumber, this.kariahMosqueGooglePlaceId).subscribe(data => {
        if (data.status == "failure") { //if not found
          this.navParams.get('callback')(this.kariahHeirs);
          this.navCtrl.pop();
        } else if (data.status == "success") {
          alert("Error: Already exist")
        }
      })
    }
  }
}
