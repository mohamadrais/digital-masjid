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

  public khairatHeirs = { "h_fullName": "", "h_icnumber": "", "h_relation": "" }; //name, ic, relation for heirs
  public updateMode = false;
  public khairatMosqueGooglePlaceId;
  public currentIcnumber; // to check if icnumber is changed or not during updateMode

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
    if (this.navParams.get('data')) {
      this.khairatHeirs = this.navParams.get('data');
      this.currentIcnumber = this.khairatHeirs.h_icnumber;
      this.updateMode = true;
    }
    this.khairatMosqueGooglePlaceId = this.navParams.get('mosqueGooglePlaceId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KhairatOtherAccountPage');
  }

  addUpdateAccount() {
    // if it is in update mode and ic number has not changed
    if (this.updateMode && this.khairatHeirs.h_icnumber == this.currentIcnumber) {
      this.navParams.get('callback')(this.khairatHeirs);
      this.navCtrl.pop();
    }
    // otherwise check if icnumber already exists
    else {
      this.httpService.checkKhairatExist(this.khairatHeirs.h_icnumber, this.khairatMosqueGooglePlaceId).subscribe(data => {
        if (data.status == "failure") { //if not found
          this.navParams.get('callback')(this.khairatHeirs);
          this.navCtrl.pop();
        } else if (data.status == "success") {
          alert("Error: Already exist")
        }
      })
    }
  }
}
