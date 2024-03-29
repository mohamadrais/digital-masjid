import { Component, ViewChild } from '@angular/core';
import { Platform, Events, ToastController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterUstazPage } from '../pages/register-ustaz/register-ustaz';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { CreateEventPage } from '../pages/create-event/create-event';
// import { QiblaPage } from '../pages/qibla/qibla';
import { ProfilePage } from '../pages/profile/profile';
import { UstazProfilePage } from '../pages/ustaz-profile/ustaz-profile';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { MosqueFeedbackPage } from '../pages/mosque-feedback/mosque-feedback';
// import { FeedbackPage } from '../pages/feedback/feedback';
import { MosquePage } from '../pages/mosque/mosque';
import { MarketPage } from '../pages/market/market';
import { InfaqPage } from '../pages/infaq/infaq';
// import { InfaqListPage } from '../pages/infaq-list/infaq-list';
import { KariahListPage } from '../pages/kariah-list/kariah-list';
import { MosqueManagePage } from '../pages/mosque-manage/mosque-manage';
import { KariahPage } from '../pages/kariah/kariah';
import { AskPage } from '../pages/ask/ask';
import { BookmarkPage } from '../pages/bookmark/bookmark';
import { NotificationPage } from '../pages/notification/notification';
import { ParticipantsPage } from '../pages/participants/participants';
import { Nav } from 'ionic-angular';
import { Globals } from "../app/constants/globals";
import { AppConstants } from "../app/constants/app-constants";
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { Network } from '@ionic-native/network';
import { FcmProvider } from '../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
import { HttpService } from "../app/service/http-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;
  toastOffline;
  toastOnline;
  prevConnectivityStatus: boolean = true;
  userType: String;
  userId: String;
  userMobile: String;

  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen,
    public global: Globals, public httpService: HttpService, public connectivity: ConnectivityProvider, public events: Events, public network: Network, private toastCtrl: ToastController, private fcm: FcmProvider, private app: App) {
    platform.ready().then(() => {

      this.global.initGlobals().subscribe(async data => {
        if (data) {
          this.userId = data._id;
          this.userMobile = data.mobile;
          this.userType = data.userType;
          if (data.userType === AppConstants.USER_TYPE_ADMIN) {
            events.publish('userType:admin', true);
            this.adminhomePage();
          } else if (data.userType === AppConstants.USER_TYPE_USER) {
            events.publish('userType:user', true);
            this.initKariah(data._id);
            this.homePage();
          } else if (this.userType === AppConstants.USER_TYPE_MODERATOR) {
            events.publish('userType:ustaz', true);
            this.ustazProfilePage();
          }
          if (this.userId && (!this.global.generalSettings.pushTokenSentFlag) && this.global.generalSettings.networkAvailable) {
            if (this.global.generalSettings.pushToken != "") {
              if (await this.sendPushTokenToServer(this.global.generalSettings.pushToken, this.userId, this.userMobile)) {
                this.global.generalSettings.pushTokenSentFlag = true;
                console.log("pushTokenSentFlag inside if user logged in: " + this.global.generalSettings.pushTokenSentFlag);
              }
            }
          }

          await this.countUnreadByUser();

          // if user is not logged in
        } else {
          this.nav.setRoot(LoginPage);
        }
      });

      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Profile', component: ProfilePage },
        { title: 'Waktu Solat', component: null },
        // { title: 'Settings', component: SettingsPage },
        { title: 'Bookmark', component: BookmarkPage },
        { title: 'Kariah', component: KariahPage },
        // { title: 'Infaq List', component: InfaqListPage },
        // { title: 'Market', component: MarketPage },
        // { title: 'Feedback', component: FeedbackPage },
        { title: 'About', component: AboutPage },
        { title: 'Log Out', component: LoginPage }
      ];

      // if user is logged in
      // this.global.get(AppConstants.USER).then(async data => {
      //   if (data) {
      //     this.userId = data._id;
      //     this.userMobile = data.mobile;
      //     this.userType = data.userType;
      //     if (data.userType === AppConstants.USER_TYPE_ADMIN) {
      //       this.adminhomePage();
      //       events.publish('userType:admin', true);
      //     } else if (data.userType === AppConstants.USER_TYPE_USER) {
      //       this.homePage();
      //     } else if (this.userType === AppConstants.USER_TYPE_MODERATOR) {
      //       this.ustazProfilePage();
      //       events.publish('userType:ustaz', true);
      //     }
      //     if ((!this.global.generalSettings.pushTokenSentFlag) && this.global.generalSettings.networkAvailable) {
      //       if (this.global.generalSettings.pushToken != "") {
      //         if (await this.sendPushTokenToServer(this.global.generalSettings.pushToken, this.userId, this.userMobile)) {
      //           this.global.generalSettings.pushTokenSentFlag = true;
      //           console.log("pushTokenSentFlag inside if user logged in: " + this.global.generalSettings.pushTokenSentFlag);
      //         }
      //       }
      //     }

      //     // if user is not logged in
      //   } else {
      //     this.nav.setRoot(LoginPage);
      //   }
      // });

      events.subscribe('userType:admin', data => {
        this.pages = [
          { title: 'Home', component: AdminHomePage },
          { title: 'Profile', component: ProfilePage },
          { title: 'Waktu Solat', component: null },
          // { title: 'Settings', component: SettingsPage },
          // { title: 'Infaq List', component: InfaqListPage },
          { title: 'Kariah List', component: KariahListPage },
          { title: 'Manage Mosque', component: MosqueManagePage },
          // { title: 'Feedback', component: FeedbackPage },
          { title: 'About', component: AboutPage },
          { title: 'Log Out', component: LoginPage }
        ];
      });

      events.subscribe('userType:ustaz', data => {
        this.pages = [
          { title: 'Home', component: UstazProfilePage },
          { title: 'Waktu Solat', component: null },
          // { title: 'Settings', component: SettingsPage },
          // { title: 'Feedback', component: FeedbackPage },
          { title: 'About', component: AboutPage },
          { title: 'Log Out', component: LoginPage }
        ];
      });

      events.subscribe('userType:user', data => {
        this.pages = [
          { title: 'Home', component: HomePage },
          { title: 'Profile', component: ProfilePage },
          { title: 'Waktu Solat', component: null },
          // { title: 'Settings', component: SettingsPage },
          { title: 'Bookmark', component: BookmarkPage },
          // { title: 'Infaq List', component: InfaqListPage },
          { title: 'Kariah', component: KariahPage },
          // { title: 'Market', component: MarketPage },
          // { title: 'Feedback', component: FeedbackPage },
          { title: 'About', component: AboutPage },
          { title: 'Log Out', component: LoginPage }
        ];
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      this.statusBar.backgroundColorByHexString('#00A79D');

      splashScreen.hide();
      setTimeout(() => {
        this.connectivity.initializeNetworkEvents();
      }, 1000);

      if (!this.network || this.network.type.toLowerCase() == "none" || this.network.type.toLowerCase() == "unknown") {
        if (this.toastOnline) {
          this.toastOnline.dismiss();
          this.toastOnline = null;
        }
        this.presentOfflineToast();
        this.prevConnectivityStatus = false;
      }
      // Offline event
      this.events.subscribe('network:offline', () => {
        if (this.toastOnline) {
          this.toastOnline.dismiss();
          this.toastOnline = null;
        }
        this.presentOfflineToast();
        this.prevConnectivityStatus = false;
      });

      // Online event
      this.events.subscribe('network:online', async () => {
        console.log('network:online ==> ' + this.network.type);
        //need to be careful in case error happen in push, below code is not fully tested after new fix by aishah
        this.userId = this.global.getUserId();
        if (!this.global.generalSettings.pushTokenSentFlag) {
          if ((this.global.generalSettings.pushToken != "")
            && this.userId) {
            if (await this.sendPushTokenToServer(this.global.generalSettings.pushToken, this.userId, this.userMobile)) {
              this.global.generalSettings.pushTokenSentFlag = true;
              console.log("pushTokenSentFlag inside network online: " + this.global.generalSettings.pushTokenSentFlag);
            }
          }
        }

        await this.countUnreadByUser();

        if (this.toastOffline) {
          this.toastOffline.dismiss();
          this.toastOffline = null;
        }
        if (!this.prevConnectivityStatus) {
          this.presentOnlineToast();
          this.prevConnectivityStatus = true;
        }
      });

      // Get push token
      fcm.getToken()
        .then(pushToken => {
          console.log('Device registered', pushToken);
          this.global.generalSettings.pushToken = pushToken;
        })
        .catch(err => console.log(`Error registering device: ${err}`));

      // Listen to incoming messages
      fcm.listenToNotifications().pipe(

        tap(msg => {
          this.countUnreadByUser();

          let notiData = { "notification": msg };

          let customData = (JSON.parse(msg.customData));
          let notificationType = customData.notificationType;

          if (notificationType == AppConstants.NOTIFICATION_TYPE_KARIAH_MEMBERSHIP_STATUS) {
            if (this.global.getUserId() && this.global.getUserId().length > 0)
              this.initKariah(this.global.getUserId());

            if (this.nav.getActive().component != KariahPage) {
              let duration: number = 3000;
              let elapsedTime: number = 0;
              let intervalHandler = setInterval(() => { elapsedTime += 10; }, 10);

              let toastNotification = this.toastCtrl.create({
                message: msg.title,
                position: 'top',
                showCloseButton: true,
                dismissOnPageChange: true,
                duration: duration,
                closeButtonText: "View",
                cssClass: "top-toast"
              });

              toastNotification.onWillDismiss(() => {
                console.log('Dismissed notification toast');
                clearInterval(intervalHandler);
                if (elapsedTime < duration) {
                  this.app.getActiveNav().push(KariahPage);
                }
              });

              toastNotification.present();
            } else {
              //update notification page live view
              this.events.publish("kariah:updateView");
            }
            return true;
          }

          if (this.nav.getActive().component != NotificationPage) {
            let duration: number = 3000;
            let elapsedTime: number = 0;
            let intervalHandler = setInterval(() => { elapsedTime += 10; }, 10);

            let toastNotification = this.toastCtrl.create({
              message: msg.title,
              position: 'top',
              showCloseButton: true,
              dismissOnPageChange: true,
              duration: duration,
              closeButtonText: "View",
              cssClass: "top-toast"
            });

            toastNotification.onWillDismiss(() => {
              console.log('Dismissed notification toast');
              clearInterval(intervalHandler);
              if (elapsedTime < duration) {
                this.app.getActiveNav().push(NotificationPage, notiData);
              }
            });

            toastNotification.present();
          } else {
            //update notification page live view
            this.events.publish("notification:updateView", notiData);
          }

        })
      ).subscribe();

    });
  }

  async sendPushTokenToServer(pushToken, userId, userMobile) {
    return new Promise(async (resolve, reject) => {
      try {
        var deviceInfo;
        try {
          deviceInfo = await this.getDeviceInfo();
        } catch (err) {
          console.log(`error getting device info: ${err}`);
          reject(false);
        }
        if (deviceInfo) {
          this.httpService.sendPushToken(pushToken, deviceInfo, userId, userMobile).subscribe(data => {
            if (data) {
              console.log("data returned from sendPushToken: " + JSON.stringify(data));
              resolve(true);
            } else {
              console.log("no data returned from sendPushToken");
              reject(false);
            }
          }, error => {
            console.log("error during sendPushToken to server: ", error);
            reject(false);
          })
        }
      }
      catch (error) {
        console.log("error during sendPushToken to server: ", error);
        reject(false);
      }
    })
  }

  private async getDeviceInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        var deviceInfo = {
          "device_unique_id": this.global.getDeviceId(),
          "osVersion": this.global.getDevicePlatformVersion(),
          "deviceModel": this.global.getDeviceModel(),
          "platform": this.global.getDevicePlatform(),
          "manufacturer": this.global.getDeviceManufacturer()
        };
        resolve(deviceInfo);
      }
      catch (error) {
        console.log("error during getDeviceInfo: ", error);
        reject(false);
      }
    })
  }

  presentOfflineToast() {
    this.toastOffline = this.toastCtrl.create({
      message: AppConstants.OFFLINE_NETWORK,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: false
    });

    this.toastOffline.onDidDismiss(() => {
      console.log('Dismissed offline toast');
    });

    this.toastOffline.present();
  }

  presentOnlineToast() {
    this.toastOnline = this.toastCtrl.create({
      message: AppConstants.ONLINE_NETWORK,
      position: 'bottom',
      duration: 3000,
      showCloseButton: false,
      dismissOnPageChange: false
    });

    this.toastOnline.onDidDismiss(() => {
      console.log('Dismissed online toast');
    });

    this.toastOnline.present();
  }

  homePage() {
    this.nav.setRoot(HomePage);
  }

  adminhomePage() {
    this.nav.setRoot(AdminHomePage);
  }

  ustazProfilePage() {
    this.nav.setRoot(UstazProfilePage);
  }

  async countUnreadByUser() {
    this.httpService.notificationCountUnreadByUser(this.global.getUserId()).subscribe(data => {
      if (data && data.status && data.status.toLowerCase() != "failure") {
        this.global.generalSettings.totalUnreadNotificationBellCount = data.result;
      }
    });
  }

  async initKariah(userId) {
    this.httpService.getKariahDetails(userId, null).subscribe(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        let kariahUser = data[0];
        this.global.setKariahUser(kariahUser);
      }
    });
  }

  async openPage(p) {
    if (p.component && p.component != this.nav.getActive().component) {
      if (p.title == 'Log Out') {
        var deviceInfo;
        try {
          deviceInfo = await this.getDeviceInfo();
        } catch (err) {
          console.log(`Logout: error getting device info: ${err}`);
        }
        if (deviceInfo) {
          await this.httpService.logoutUser(deviceInfo, this.global.getUserId()).subscribe(data => {
            if (data) {
              console.log("successfully marked user as logged out in server");
              this.global.generalSettings.pushTokenSentFlag = false;
              this.global.clearAllGlobals();
              // Get push token
              this.fcm.getToken()
                .then(pushToken => {
                  console.log('Device registered', pushToken);
                  this.global.generalSettings.pushToken = pushToken;
                  this.nav.setRoot(p.component);
                })
                .catch(err => {
                  console.log(`Error registering device: ${err}`);
                  this.nav.setRoot(p.component);
                });
            } else {
              console.log("no data returned from logoutUser");
              this.global.clearAllGlobals();
              this.nav.setRoot(p.component);
            }

          }, error => {
            console.log("error during logoutUser", error);
            this.nav.setRoot(p.component);
            this.global.clearAllGlobals();
          })
        }
      }
      this.nav.setRoot(p.component, { fromSideMenu: true });
    } else if (p.component == null || p.component == undefined) {
      //do nothing
      if (p.title == 'Waktu Solat') {
        window.open('https://www.waktusolat.xyz/', '_blank');
      }
    }

  }

  // feedbackPage() {
  //   this.nav.push(FeedbackPage)
  // }
}
