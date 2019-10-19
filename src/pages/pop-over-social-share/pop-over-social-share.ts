import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SocialShare } from "../../app/models/SocialShare";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Clipboard } from '@ionic-native/clipboard';

/**
 * Generated class for the PopOverSocialSharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pop-over-social-share',
  templateUrl: 'pop-over-social-share.html',
  providers:[Clipboard]
})
export class PopOverSocialSharePage {

  socialShare:SocialShare = new SocialShare();
  showExplanation=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser, private socialSharing: SocialSharing, private clipboard: Clipboard, private toastCtrl: ToastController) {
    this.socialShare = this.navParams.get("data");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverSocialSharePage');
  }

  share(){
    this.socialSharing.share(this.socialShare.message, this.socialShare.subject, this.socialShare.file, this.socialShare.url). //temporary link. need to use place id or lat lng. this link may crash in ios 11
      then(() => {
        console.log("Sharing success");
        // Success!
      }).catch(error => {
        // Error!
        alert("Error occured:"+ JSON.stringify(error));
      });
  }

  openMoreExplanation(){
    window.open('https://developers.facebook.com/docs/apps/review/prefill', '_blank', 'location=yes');
  }

  copyIntoClipboard(){  
    this.clipboard.copy(this.socialShare.message);
    this.presentToast();
  }
  
  presentToast() {
    let toast = this.toastCtrl.create({
      duration: 3000,
      message: 'Pre-filled message is copied!',
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: true,
      cssClass: "popover-social"
    });

    toast.onDidDismiss(() => {
      console.log('Toast dismissed');
    });

    toast.present();
  }
}
