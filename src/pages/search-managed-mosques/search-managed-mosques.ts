import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";

/**
 * Generated class for the SearchManagedMosquesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-managed-mosques',
  templateUrl: 'search-managed-mosques.html',
})
export class SearchManagedMosquesPage {
  mosqueSearch = { title: "" };
  mosqueList: Array<string> = [];
  selectedMosque;
  userData;
  userEmail;
  callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public global: Globals) {
    this.userData = this.global.getUser();
    this.userEmail = this.userData.email;
    console.log("userEmail: " + this.userEmail);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchManagedMosquesPage');
  }

  onInput(event) {
    console.log("onInput event:");
    console.log(event);
    if (event._value.length >= 1) {
      this.getManagedMosquesList(event._value, this.userEmail)
    }
  }

  getManagedMosquesList(input: string, email: string) {
    this.httpService.getManagedMosquesList(input, email).subscribe(data => {
      console.log("get managed mosques list from getManagedMosquesList: ");
      //console.log(JSON.stringify(data));
      //console.log(data[0].mosqueObjects);
      if (data) {
        this.mosqueList = data[0].mosqueObjects;
        //console.log("this.mosqueList: "+this.mosqueList);
      }
    }, error => {
      console.log(error)
    })
  }

  selectMosque(mod) {
    if (!this.selectedMosque || (this.selectedMosque && (this.selectedMosque.email != mod.email))) {
      this.selectedMosque = mod;
    } else {
      this.selectedMosque = '';
    }

    console.log(this.selectedMosque);
  }

  close() {
    this.navCtrl.pop().then(() => {
      this.navParams.get('callback')(this.selectedMosque);
    });

  }
}
