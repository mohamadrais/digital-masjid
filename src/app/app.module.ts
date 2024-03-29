

//Ionic Plugins and modules
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';
import { HttpModule, Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Firebase } from '@ionic-native/firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera } from '@ionic-native/camera';
// import { AndroidPermissions } from '@ionic-native/android-permissions';

//Ng modules
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FilterPipeModule } from 'ngx-filter-pipe';

//Utilies
import { Globals } from './constants/globals';


//Services & Providers
import { HttpService } from "../app/service/http-service";
import { LocationsProvider } from '../providers/locations/locations';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { ImageProvider } from '../providers/image/image';
import { FcmProvider } from '../providers/fcm/fcm';

//Pages
import { HomePage } from '../pages/home/home';
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterUstazPage } from '../pages/register-ustaz/register-ustaz';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { CreateEventPage } from '../pages/create-event/create-event';
import { MosqueEventUrlPage } from '../pages/mosque-event-url/mosque-event-url'
import { QiblaPage } from '../pages/qibla/qibla';
import { ProfilePage } from '../pages/profile/profile';
import { UstazProfilePage } from '../pages/ustaz-profile/ustaz-profile';
import { PopoverRatingPage } from '../pages/ustaz-profile/popover-rating';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { MosqueFeedbackPage } from '../pages/mosque-feedback/mosque-feedback';
import { FeedbackPage } from '../pages/feedback/feedback';
import { MosquePage } from '../pages/mosque/mosque';
import { MosqueManagePage } from '../pages/mosque-manage/mosque-manage';
import { PopoverMosqueEmailPage } from '../pages/mosque-manage/popover-mosque-email';
import { MarketPage } from '../pages/market/market';
import { InfaqPage } from '../pages/infaq/infaq';
import { InfaqListPage } from '../pages/infaq-list/infaq-list';
import { KariahPage } from '../pages/kariah/kariah';
import { KariahListPage } from '../pages/kariah-list/kariah-list';
import { KariahOtherAccountPage } from '../pages/kariah-other-account/kariah-other-account';
import { AskPage } from '../pages/ask/ask';
import { BookmarkPage } from '../pages/bookmark/bookmark';
import { ForgotPassword } from '../pages/forgot-password/forgotPassword';
import { ParticipantsPage } from '../pages/participants/participants';
import { NotificationPage } from '../pages/notification/notification';
import { SearchModeratorPage } from '../pages/search-moderator/search-moderator';
import { SearchManagedMosquesPage } from '../pages/search-managed-mosques/search-managed-mosques';
import { NotificationBellPage } from '../pages/notification-bell/notification-bell';
import { PopoverMosqueRatingPage } from '../pages/mosque/popover-mosque-rating';
import { PopoverKariahApprovalPage } from '../pages/kariah/popover-kariah-approval';
import { PopOverSocialSharePage } from '../pages/pop-over-social-share/pop-over-social-share';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { MosqueEventsUtil } from "../app/util/mosque-events-util";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    RegisterUstazPage,
    EventDetailsPage,
    CreateEventPage,
    MosqueEventUrlPage,
    ProfilePage,
    UstazProfilePage,
    PopoverRatingPage,
    PopoverMosqueRatingPage,
    PopoverKariahApprovalPage,
    PopOverSocialSharePage,
    AdminHomePage,
    MosqueFeedbackPage,
    FeedbackPage,
    SettingsPage,
    QiblaPage,
    MosquePage,
    MosqueManagePage,
    PopoverMosqueEmailPage,
    AboutPage,
    ForgotPassword,
    SearchModeratorPage,
    SearchManagedMosquesPage,
    MarketPage,
    InfaqPage,
    InfaqListPage,
    KariahPage,
    KariahListPage,
    KariahOtherAccountPage,
    AskPage,
    BookmarkPage,
    NotificationPage,
    NotificationBellPage,
    ParticipantsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    FilterPipeModule,
    IonicImageViewerModule,
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      // set defaults here
      backgroundColor: "#FDB900",
      backgroundPadding: 0,
      radius: 45,
      toFixed: 0,
      maxPercent: 100,
      unitsColor: "#483500",
      outerStrokeWidth: 5,
      outerStrokeColor: "#f3bb40",
      innerStrokeColor: "#edecef",
      titleColor: "#483500",
      titleFontSize: "20",
      subtitle: "Joined",
      subtitleColor: "#483500",
      animationDuration: 1000,
      showSubtitle: true,
      showUnits: true,
      units: '%',
      showBackground: false,
      responsive: true,
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    RegisterUstazPage,
    EventDetailsPage,
    CreateEventPage,
    MosqueEventUrlPage,
    UstazProfilePage,
    PopoverRatingPage,
    PopoverKariahApprovalPage,
    PopOverSocialSharePage,
    ProfilePage,
    AdminHomePage,
    MosqueFeedbackPage,
    FeedbackPage,
    SettingsPage,
    QiblaPage,
    MosquePage,
    MosqueManagePage,
    PopoverMosqueEmailPage,
    PopoverMosqueRatingPage,
    AboutPage,
    ForgotPassword,
    SearchModeratorPage,
    SearchManagedMosquesPage,
    MarketPage,
    InfaqPage,
    InfaqListPage,
    KariahPage,
    KariahListPage,
    KariahOtherAccountPage,
    AskPage,
    BookmarkPage,
    NotificationPage,
    NotificationBellPage,
    ParticipantsPage
  ],
  providers: [
    SocialSharing,
    Device,
    StatusBar,
    SplashScreen,
    HttpService,
    Globals,
    Geolocation,
    NativeGeocoder,
    ConnectivityProvider,
    Network,
    LocationsProvider,
    Diagnostic,
    LocationAccuracy,
    InAppBrowser,
    Camera,
    Facebook,
    GooglePlus,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ImageProvider,
    FcmProvider,
    Firebase,
    FileTransfer,
    FileTransferObject,
    File,
    MosqueEventsUtil
  ]
})
export class AppModule { }
