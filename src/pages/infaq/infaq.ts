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
import { dateDataSortValue } from 'ionic-angular/umd/util/datetime-util';
import { MosquePage } from '../mosque/mosque';

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
  success: string = '';
  showPaymentResult: boolean = false;
  paymentResult: string = '';

  constructor(public navCtrl: NavController, public iab: InAppBrowser, public navParams: NavParams, public global: Globals, public httpService: HttpService, public platform: Platform) {
    console.log('constructor InfaqPage ' + new Date());
    if (navParams.get('mosqueData') != null && navParams.get('mosqueData') != '') {
      this.mosque = navParams.get('mosqueData');
      this.currentUser = this.global.getUser();
      this.donation = new Donations();
      this.paymentData = new PaymentData();
      this.donation.userId = this.currentUser._id;
      this.donation.orderId = this.currentUser._id + '-' + this.getCurrentTimestamp();

      if (this.mosque.title && this.mosque.title != '') {
        this.donation.mosqueTitle = this.mosque.title;
      }
      if (this.mosque.google_place_id && this.mosque.google_place_id != '') {
        this.donation.mosqueGooglePlaceId = this.mosque.google_place_id;
      }
    }

    if (navParams.get('success') != null) {
      this.success = navParams.get('success');

      if (this.success == 'true') {
        this.paymentResult = "Alhamdulillah, your payment was successful. Jazakallah khairan!";
        this.showPaymentResult = true;
      }
      else if (this.success == 'false') {
        this.paymentResult = "Your payment was unsuccessful. Please try again or contact support. Jazakallah kharian!";
        this.showPaymentResult = true;
      }
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfaqPage ' + new Date());
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

  getHash() {
    let secretkey = '11690-550';
    let toHash;
    let hash;
    console.log(CryptoJS.PBKDF2('aaabb', "XX").toString());
    if (this.paymentData && this.paymentData.detail && this.paymentData.detail.length > 0 &&
      this.paymentData.amount && this.paymentData.amount.length > 0 &&
      this.paymentData.order_id && this.paymentData.order_id.length > 0) {
      toHash = secretkey + decodeURIComponent(this.paymentData.detail) + decodeURIComponent(this.paymentData.amount) + decodeURIComponent(this.paymentData.order_id);
      hash = CryptoJS.MD5(toHash).toString();

    }
    return hash;
  }

  preparePaymentData() {
    this.paymentData.detail = "Donation for " + this.donation.category + " purposes for " + this.donation.mosqueTitle;
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
      let browser = this.iab.create(this.httpService.BASE_URL + "infaq/prepare", '_self', 'location=yes');
      browser.show();
      browser.on("loadstart")
        .subscribe(
          event => {
            console.log("loadstart -->", event);
            if (event.url.indexOf("failure") > -1) {
              browser.close();
              this.navCtrl.setRoot(InfaqPage, {
                success: 'false',
                mosqueData: this.mosque
              });
            }
            else if (event.url.indexOf("success") > -1) {
              browser.close();
              this.navCtrl.setRoot(InfaqPage, {
                success: 'true',
                mosqueData: this.mosque
              });
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
            console.log("loadstop -->", event);
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
            console.log("InAppBrowser exit Event Error: " + err);
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

  goBack() {
    this.navCtrl.setRoot(MosquePage, {
      "data": this.mosque
    });
  }

}
