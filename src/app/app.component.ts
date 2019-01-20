import { Component, ViewChild} from '@angular/core';
import { Platform, Events,ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterUstazPage } from '../pages/register-ustaz/register-ustaz';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { CreateEventPage } from '../pages/create-event/create-event';
import { QiblaPage } from '../pages/qibla/qibla';
import { ProfilePage } from '../pages/profile/profile';
import { UstazProfilePage } from '../pages/ustaz-profile/ustaz-profile';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { FeedbackPage } from '../pages/feedback/feedback';
import { FeedbackAltPage } from '../pages/feedback-alt/feedback-alt';
import { MosquePage } from '../pages/mosque/mosque';
import { MarketPage } from '../pages/market/market';
import { InfaqPage } from '../pages/infaq/infaq';
import { KhairatListPage } from '../pages/khairat-list/khairat-list';
import { AskPage } from '../pages/ask/ask';
import { BookmarkPage } from '../pages/bookmark/bookmark';
import { NotificationPage } from '../pages/notification/notification';
import { Nav } from 'ionic-angular';
import { Globals} from "../app/constants/globals";
import {AppConstants} from "../app/constants/app-constants";
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any}>;
  toastOffline;
  toastOnline;
  prevConnectivityStatus:boolean=true;
  userType: String;

  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen, 
    public global:Globals, public connectivity:ConnectivityProvider, public events:Events, public network: Network,private toastCtrl: ToastController) {
    platform.ready().then(() => {

      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Profile', component: ProfilePage },
        { title: 'Qibla Finder', component: QiblaPage },
        { title: 'Settings', component: SettingsPage },
        { title: 'Feedback', component: FeedbackPage },
        { title: 'Bookmark', component: BookmarkPage },
        { title: 'Khairats', component: KhairatListPage },
        { title: 'Market', component: MarketPage },
        { title: 'About', component: AboutPage },
        { title: 'Log Out', component: LoginPage }
      ];
      
      this.global.get(AppConstants.USER).then(data => {
        if( data){
          this.userType = data.userType;
          if(data.userType === AppConstants.USER_TYPE_ADMIN){
            this.adminhomePage();
            events.publish('userType:admin', true);
          } else if( data.userType === AppConstants.USER_TYPE_USER ) {
            this.homePage();
          } else if( this.userType === AppConstants.USER_TYPE_MODERATOR ) {
            this.ustazProfilePage();
            events.publish('userType:ustaz', true);
          }
        } else {
          this.nav.setRoot(LoginPage);
        }
      });
      
      events.subscribe('userType:admin', data => {
        this.pages = [
          { title: 'Home', component: AdminHomePage },
          { title: 'Profile', component: ProfilePage },
          { title: 'Qibla Finder', component: QiblaPage },
          { title: 'Settings', component: SettingsPage },
          { title: 'Feedback', component: FeedbackPage },
          { title: 'Khairats', component: KhairatListPage },
          { title: 'About', component: AboutPage },
          { title: 'Log Out', component: LoginPage }
        ];
      });

      events.subscribe('userType:ustaz', data => {
        this.pages = [
          { title: 'Home', component: UstazProfilePage },
          { title: 'Qibla Finder', component: QiblaPage },
          { title: 'Settings', component: SettingsPage },
          { title: 'Feedback', component: FeedbackPage },
          { title: 'About', component: AboutPage },
          { title: 'Log Out', component: LoginPage }
        ];
      });

      events.subscribe('userType:user', data => {
        this.pages = [
          { title: 'Home', component: HomePage },
          { title: 'Profile', component: ProfilePage },
          { title: 'Qibla Finder', component: QiblaPage },
          { title: 'Settings', component: SettingsPage },
          { title: 'Feedback', component: FeedbackPage },
          { title: 'Bookmark', component: BookmarkPage },
          { title: 'Khairats', component: KhairatListPage },
          { title: 'Market', component: MarketPage },
          { title: 'About', component: AboutPage },
          { title: 'Log Out', component: LoginPage }
        ];
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      this.statusBar.backgroundColorByHexString('#db954a');

      splashScreen.hide();
      setTimeout(()=>{
        this.connectivity.initializeNetworkEvents();
      },1000);

      if(!this.network || this.network.type.toLowerCase()=="none" || this.network.type.toLowerCase()=="unknown"){
        if(this.toastOnline){
          this.toastOnline.dismiss();
          this.toastOnline=null;
        }
        this.presentOfflineToast();
        this.prevConnectivityStatus=false;
      }
      // Offline event
      this.events.subscribe('network:offline', () => {
        if(this.toastOnline){
          this.toastOnline.dismiss();
          this.toastOnline=null;
        }
        this.presentOfflineToast();
        this.prevConnectivityStatus=false;
      });

      // Online event
      this.events.subscribe('network:online', () => {
          console.log('network:online ==> '+this.network.type);  
          if(this.toastOffline){
            this.toastOffline.dismiss();
            this.toastOffline=null;
          }
          if(!this.prevConnectivityStatus){
            this.presentOnlineToast();
            this.prevConnectivityStatus=true;
          }
      });
    });
  }

  presentOfflineToast() {
    this.toastOffline = this.toastCtrl.create({
      message: AppConstants.OFFLINE_NETWORK,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange:false
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
      duration:3000,
      showCloseButton: false,
      dismissOnPageChange:false
    });
  
    this.toastOnline.onDidDismiss(() => {
      console.log('Dismissed online toast');
    });
  
    this.toastOnline.present();
  }

  homePage(){
    this.nav.setRoot(HomePage);
  }

  adminhomePage(){
    this.nav.setRoot(AdminHomePage);
  }

  ustazProfilePage(){
    this.nav.setRoot(UstazProfilePage);
  }

  openPage(p) {
    if( p.title == 'Log Out' ){
      this.global.set("USER", null);
    }
    
    this.nav.setRoot(p.component);  
    
  }

  feedbackPage(){
    this.nav.push(FeedbackPage)
  }
}
