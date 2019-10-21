import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  buildVersion;
  buildDate;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    this.platform.ready().then(()=>{
      this.buildVersion = BuildInfo.version
      this.buildDate = BuildInfo.buildDate
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

}
