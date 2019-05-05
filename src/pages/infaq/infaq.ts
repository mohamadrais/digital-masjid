import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Mosques } from '../../app/models/Mosques';
import { User } from "../../app/models/User";
import { Globals } from "../../app/constants/globals";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Donations } from "../../app/models/Donations"
import { PaymentData } from "../../app/models/PaymentData"
import * as moment from 'moment';
import { HttpService } from "../../app/service/http-service";
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import * as CryptoJS from 'crypto-js';

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
  donation: Donations;
  paymentData: PaymentData;

  constructor(public navCtrl: NavController, public iab: InAppBrowser, public navParams: NavParams, public global: Globals, public httpService: HttpService, public platform: Platform) {
    this.mosque = navParams.get('data');
    this.currentUser = this.global.getUser();
    this.donation = new Donations();
    this.paymentData = new PaymentData();
    this.donation.userId = this.currentUser._id;
    this.donation.orderId = this.currentUser._id + '-' + this.getCurrentTimestamp();
    this.donation.mosqueGooglePlaceId = this.mosque.google_place_id;
    this.donation.mosqueTitle = this.mosque.title;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfaqPage');
  }

  getCurrentTimestamp() {
    return moment.utc().format("YYYYMMDDHHmmss");
  }

  pay() {
    this.httpService.createInfaq(this.donation).subscribe(res => {
      if (res && res.status && res.status.length > 0 && res.status.toLowerCase() == "success") {
        this.openSenangPay();
      } else {
        alert(res.message);
      }
    }, err => {
      alert(err);
    })
  }

  getHash(){
    let secretkey = '11690-550';
    let toHash;
    let hash;
    console.log(CryptoJS.PBKDF2('aaabb', "XX").toString());
    if(this.paymentData && this.paymentData.detail && this.paymentData.detail.length>0 &&
      this.paymentData.amount && this.paymentData.amount.length>0 &&
      this.paymentData.order_id && this.paymentData.order_id.length>0){
        toHash = secretkey + decodeURIComponent(this.paymentData.detail) + decodeURIComponent(this.paymentData.amount) + decodeURIComponent(this.paymentData.order_id);
        hash = CryptoJS.MD5(toHash).toString();
        
      }
    return hash;
  }

  preparePaymentData(){
    this.paymentData.detail = "Donation for "+this.donation.category+" purposes for "+this.donation.mosqueTitle;
    this.paymentData.amount = this.donation.amount;
    this.paymentData.order_id = this.donation.orderId;
    this.paymentData.name = this.currentUser.name;
    this.paymentData.email = this.currentUser.email;
    this.paymentData.phone = this.currentUser.mobile;
    this.paymentData.hash = this.getHash();
  }

  openSenangPay() {

    this.preparePaymentData();
    
    if (this.platform.is('cordova')) {
      let browser = this.iab.create(this.httpService.BASE_URL+"infaq/prepare", '_self', 'location=yes');
      browser.show();
      browser.on("loadstart")
        .subscribe(
          event => {
            console.log("loadstop -->", event);
            if (event.url.indexOf("some error url") > -1) {
              //  browser.close();
              //  this.navCtrl.setRoot(BookingDetailPage,{
              //      success:false
              //   });
            }
          },
          err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
          });
      //on url load stop
      browser.on("loadstop")
        .subscribe(
          event => {
            //here we call executeScript method of inappbrowser and pass object 
            //with attribute code and value script string which will be executed in the inappbrowser
            browser.executeScript({
              code: payScript
            });
            console.log("loadstart -->", event);
          },
          err => {
            console.log("InAppBrowser loadstop Event Error: " + err);
          });
      //on closing the browser
      browser.on("exit")
        .subscribe(event => {
          console.log("exit -->", event);
        },
          err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
          });
    }

    let paymentData = this.paymentData;
    let formHtml: string = '';
    for (let key in paymentData) {
      if (paymentData.hasOwnProperty(key)) {
        let value = paymentData[key];
        formHtml += '<input type="hidden" value="' + value + '" id="' + key + '" name="' + key + '"/>';
      }
    }

    let url = "https://app.senangpay.my/payment/898154475783162"
    let payScript = "var form = document.getElementById('ts-app-payment-form-redirect'); ";
    payScript += "form.innerHTML = '" + formHtml + "';";
    payScript += "form.action = '" + url + "';";
    payScript += "form.method = 'POST';";
    payScript += "form.submit();";
  }

}
