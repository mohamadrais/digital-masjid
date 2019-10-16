import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Url } from "../../app/models/MosqueEventsUrl";

/**
 * Generated class for the MosqueEventUrlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mosque-event-url',
  templateUrl: 'mosque-event-url.html',
})
export class MosqueEventUrlPage {

  public url: Url; // link, displayText for urls
  public link;
  public displayText;
  public updateMode = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController) {
    if (this.navParams.get('data')) {
      this.url = this.navParams.get('data');
      this.link = this.url.link;
      this.displayText = this.url.displayText;
      this.updateMode = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MosqueEventUrlPage');
  }

  addUpdateUrl() {
    if (this.link == "" || this.displayText == "") {
      this.showAlert();
    }
    else {
      if (this.url && this.url.link && this.url.link.length > 0) {
        this.url.link = this.link;
        this.url.displayText = this.displayText;
      } else {
        this.url = new Url(this.link, this.displayText);
      }

      console.log("current URL: " + JSON.stringify(this.url));
      this.navParams.get('callback')(this.url);
      this.navCtrl.pop();
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: "Incomplete information",
      subTitle: 'Please make sure the URL and Display Text are not empty.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
