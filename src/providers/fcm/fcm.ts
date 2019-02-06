import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(public firebaseNative: Firebase, private platform: Platform) {
    console.log('Hello FcmProvider Provider');
  }

  // Get permission from the user
  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    return token;
    //return this.saveTokenToFirestore(token)
  }

  // Save the token to firestore
  // private saveTokenToFirestore(token) {
  //   if (!token) return;

  //   const devicesRef = this.afs.collection('devices')

  //   const docData = {
  //     token,
  //     userId: 'testUser',
  //   }

  //   return devicesRef.doc(token).set(docData)
  // }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }
}
