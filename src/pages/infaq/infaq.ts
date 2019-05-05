import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Mosques } from '../../app/models/Mosques';
import { User } from "../../app/models/User";
import { Globals } from "../../app/constants/globals";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the InfaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-infaq',
  templateUrl: 'infaq.html',
})
export class InfaqPage {

  mosque: Mosques;
  currentUser: User;


  constructor(public navCtrl: NavController, public navParams: NavParams, public global: Globals) {
    this.mosque = navParams.get('data');
    this.currentUser = this.global.getUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfaqPage');
  }

}
