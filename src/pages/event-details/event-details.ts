import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { UstazProfilePage } from '../ustaz-profile/ustaz-profile';
import { CreateEventPage } from '../create-event/create-event';
import { ParticipantsPage } from '../participants/participants';
import { MosqueEvent } from "../../app/models/MosqueEvents";
import { HttpService } from "../../app/service/http-service";
import { HomePage } from '../home/home';
import { Globals } from "../../app/constants/globals";
import { AdminHomePage } from '../admin-home/admin-home';
import { User } from "../../app/models/User";
import { Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppConstants } from '../../app/constants/app-constants';
import * as moment from 'moment';

/**
 * Generated class for the EventDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  event: MosqueEvent;
  isAdmin: boolean = false;
  isModerator: boolean = false;
  eventAlreadyJoined: boolean = false;
  favoriteClicked: boolean = false;

  currentUser: User;
  updated: boolean = false;
  expiredEvent: boolean = false;
  cancelledEvent:boolean = false;

  percent = 0;
  count = 0;

  toast;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService: HttpService, public global: Globals, public alertCtrl: AlertController,
    public platform: Platform, private socialSharing: SocialSharing, private toastCtrl: ToastController) {

    this.event = navParams.get('data'); //for homepage flow with multiuser list per event, current user may have not joined yet
    let event_id = (this.event && this.event._id) ? this.event._id : this.navParams.get("eventId");

    if (navParams.get('fromUserFlow') == true) {
      this.eventAlreadyJoined = true;
    }

    this.currentUser = this.global.getUser();
    if (this.event) {
      if (this.event && this.event.users && this.event.users.length > 0) {
        if (!this.eventAlreadyJoined && this.event.users.indexOf(this.currentUser._id) != -1) {
          this.eventAlreadyJoined = true;
        }
      }
      if (this.currentUser.eventsBookmarked && this.currentUser.eventsBookmarked.length > 0) {
        if (this.currentUser.eventsBookmarked.indexOf(this.event._id) != -1) {
          this.favoriteClicked = true;
        }
      }

      if(this.event.event_status && this.event.event_status=="Cancelled"){
        this.cancelledEvent = true;
      }
    }
    if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_ADMIN) {
      this.isAdmin = true;
    } else if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_MODERATOR) {
      this.isModerator = true;
    }

    if (!this.event || !this.event.moderator_details || !this.event.mosque_details || this.event.mosque_details.length <= 0 || this.event.moderator_details.length <= 0) {

      this.httpService.findEventDetailsById(event_id).subscribe(data => {

        //do validation for event expiry
        if (!this.event) {
          this.event = data;
          if (this.currentUser.eventsBookmarked && this.currentUser.eventsBookmarked.length > 0) {
            if (!this.eventAlreadyJoined && this.event.users.indexOf(data._id) != -1) {
              this.eventAlreadyJoined = true;
            }
            if (this.currentUser.eventsBookmarked.indexOf(this.event._id)) {
              this.favoriteClicked = true;
            }
          }

          if(this.event.event_status && this.event.event_status=="Cancelled"){
            this.cancelledEvent = true;
          }
        } else {
          this.event.moderator_details = data.moderator_details;
          this.event.mosque_details = data.mosque_details;

          if(this.event.event_status && this.event.event_status=="Cancelled"){
            this.cancelledEvent = true;
          }
        }

      })
    }

    this.httpService.countMaleParticipants(event_id).subscribe(data => {
      this.event.maleCount = data;
      this.event.femaleCount = this.event.userCount - this.event.maleCount;
    });
  }

  goBack() {
    this.navCtrl.pop().then(() => {
      if (this.updated) {
        this.navParams.get('callback')({ "event": this.event, "joined": this.eventAlreadyJoined, userId: this.currentUser._id });
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsPage');
    // this.global.get("USER").then(data => {
    //   if( data.users && data.users.length > 0  ){
    //     if(  this.contains(data.users, data._id) ){
    //       this.eventAlreadyJoined = true;
    //     }
    //   }
    //   if( data && data.userType === 'Admin'){
    //    this.isAdmin = true;
    //   } else {
    //     this.isAdmin = false;
    //   }
    // });
  }

  profilePage() {
    this.navCtrl.push(ProfilePage)
  }

  updateEvent() {
    this.navCtrl.push(CreateEventPage, {
      "data": this.event,
      callback: data => {
        if (data) {
          this.event.event_title = data.event_title;
          this.event.category = data.category;
          this.event.event_start_date = data.event_start_date;
          this.event.event_end_date = data.event_end_date;
          this.event.mosque_details = [];
          this.event.mosque_details.push(data.mosque_details);
          this.event.moderator_details = data.moderator_details;
          this.event.points = data.points;
          this.event.quota = data.quota;
          this.event.event_description = data.event_description;
          this.updated = true;
        }
      }
    })
  }

  cancelEventConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Do you wish to cancel this event?',
      message: 'Warning! You will not be able to undo this cancellation.',
      buttons: [
        {
          text: 'Yes, I want to cancel this event.',
          handler: () => {
            this.cancelEvent();
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  cancelEvent() {
    this.httpService.cancelEvent(this.event).subscribe(data => {
      this.navigate();
    }, error => {
      console.log("Issue occured while cancelling the event");
    });
  }

  ustazprofilePage(ustaz: User) {
    this.navCtrl.push(UstazProfilePage, { 'data': ustaz })
  }

  adminhomePage() {
    this.navCtrl.setRoot(AdminHomePage)
  }

  participantsPage() {
    console.log("this.event._id: " + this.event._id);
    this.navCtrl.push(ParticipantsPage, { 'eventId': this.event._id, 'eventEndDtm': this.event.event_end_date });
  }

  joinEvent() {

    this.httpService.subscribeEvents(this.event, this.currentUser._id).subscribe(data => {
      this.presentToast(AppConstants.EVENT_JOINED);
      this.eventAlreadyJoined = true;
      if (this.event.userCount != null) {
        this.event.userCount++;
      } else if (this.event.users && this.event.users.length > 0 && this.event.users.indexOf(this.currentUser._id) == -1) {
        this.event.users.push(this.currentUser._id);
      }

      this.getGenderCount();
      this.updated = true;
    }, error => {
      console.log("Issue occured while joining the event");
      this.presentToast(AppConstants.ERROR);
    });
  }

  declineEvent() {
    this.httpService.unSubscribeEvents(this.event, this.currentUser._id).subscribe(data => {
      this.presentToast(AppConstants.EVENT_DECLINED);
      this.eventAlreadyJoined = false;
      if (this.event.userCount != null) {
        this.event.userCount;
      } else if (this.event.users && this.event.users.length > 0 && this.event.users.indexOf(this.currentUser._id) != -1) {
        this.event.users.splice(this.event.users.indexOf(this.currentUser._id), 1);
      }

      this.getGenderCount();
      this.updated = true;
    }, error => {
      console.log("Issue occured while declining the event");
      this.presentToast(AppConstants.ERROR);
    });
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      duration: 3000,
      message: msg,
      position: 'top',
      showCloseButton: true,
      dismissOnPageChange: true,
      cssClass: "top-toast"
    });

    this.toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    this.toast.present();
  }

  resetToast(): Promise<any> {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
    return Promise.resolve(true);
  }

  navigate() {
    // if(this.fromProfile){
    //   this.navCtrl.pop().then(() => {
    //     this.navParams.get('callback')({"done":true});
    //   });
    // }else{
    if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_ADMIN) {
      this.adminhomePage();
    } else {
      this.homePage();
    }
    // }
  }

  toggleBookmarkEvent() {
    // if it is not yet bookmarked.. then call bookmarkEvents function
    if (!this.favoriteClicked) {
      this.httpService.bookmarkEvent(this.currentUser._id, this.event._id).subscribe(data => {
        // make favoriteClicked true
        this.favoriteClicked = true;
        this.saveBookmarkEvent();
      }, error => {
        console.log("Issue occured while bookmarking the event");
      })
    }
    // if it is bookmarked.. then call unBookmarkEvent function
    else {
      this.httpService.unBookmarkEvent(this.currentUser._id, this.event._id).subscribe(data => {
        // make favoriteClicked false
        this.favoriteClicked = false;
        this.saveBookmarkEvent();
      }, error => {
        console.log("Issue occured while unbookmarking the event");
      })
    }
  }

  saveBookmarkEvent() {
    if (this.favoriteClicked) {
      var index = this.currentUser.eventsBookmarked.indexOf(this.event._id);
      if (index == -1) this.currentUser.eventsBookmarked.push(this.event._id);
      this.global.set(AppConstants.USER, this.currentUser);
    }
    else {
      var index = this.currentUser.eventsBookmarked.indexOf(this.event._id);
      if (index !== -1) this.currentUser.eventsBookmarked.splice(index, 1);
      this.global.set(AppConstants.USER, this.currentUser);
    }

  }

  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  public getEventDate(event_date: string): string {
    var date = null;
    if (event_date) {
      try {
        var eventdate = new Date(event_date);
        date = eventdate.getDate() + "/" + (eventdate.getMonth() + 1) + "/" + eventdate.getFullYear() + " " + eventdate.getUTCHours() + ":" + eventdate.getMinutes();
      } catch (e) {

      }
    } else {
      var today = new Date();
      date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getUTCHours() + ":" + today.getMinutes();
    }

    // return date;
    return moment.utc(event_date).format("DD/MM/YYYY HH:mm");
  }
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'You are now subscribed to this event.',
      message: 'May Allah grant you his blessing for your intention to join this event.',
      buttons: [
        // {
        //   text: 'Cancel',
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   }
        // },
        {
          text: 'Alhamdulillah',
          handler: () => {
            console.log('Join clicked');
            this.resetToast().then(() => {
              this.joinEvent();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  showDeclineConfirmation() {
    const confirm = this.alertCtrl.create({
      title: 'You are now canceling your subscription on this event.',
      message: 'Insyaallah there will be another events that you can join later on.',
      buttons: [
        // {
        //   text: 'Cancel',
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   }
        // },
        {
          text: 'Insyaallah',
          handler: () => {
            console.log('Join clicked');
            this.resetToast().then(() => {
              this.declineEvent();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  changeColor() {
    this.favoriteClicked = true;
  }
  getSeatsLeft(event: MosqueEvent): number {
    return (event.quota - event.users.length);
  }

  getGenderCount() {
    this.httpService.countMaleParticipants(this.event._id).subscribe(data => {
      this.event.maleCount = data;
      this.event.femaleCount = this.event.userCount - this.event.maleCount;
    });
  }

  openMap(event: MosqueEvent) {
    if (this.platform.is('ios')) {
      window.open('maps://?q=' + event.mosque_details[0].title, '_system');
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + event.mosque_details[0].title, '_system');
    }
  }

  shareEvent() {

    let mString = "";

    if (this.event.moderator_details.length == 1) {
      mString += this.event.moderator_details[0].name;
    } else {
      for (let x = 0; x < this.event.moderator_details.length; x++) {

        if (x < (this.event.moderator_details.length - 1)) {
          mString += this.event.moderator_details[x].name + ", ";
        } else {
          mString += " and " + this.event.moderator_details[x].name;
        }
      }
    }


    this.socialSharing.share("Come join " + this.event.event_title + " by " + mString + " on " + this.getEventDate(this.event.event_start_date) + "-" + this.getEventDate(this.event.event_end_date) + " at " + this.event.mosque_details[0].title, this.event.event_title, "", "https://www.google.com/maps/place/?q=place_id:" + this.event.mosque_details[0].google_place_id). //temporary link. need to use place id or lat lng. this link may crash in ios 11
      then(() => {
        console.log("Sharing success");
        // Success!
      }).catch(() => {
        // Error!
        console.log("Share failed");
      });
  }

  getJoinedPercent() {

    if (this.event.userCount != null) {
      this.count = this.event.userCount;
    } else if (this.event.users && this.event.users.length > 0) {
      this.count = this.event.users.length;
    } else {
      this.count = 0;
    }
    this.percent = this.count / this.event.quota * 100;

    return this.percent
  }

  validateEventExpired() {
    let today = new Date().toISOString();
    if (this.event && this.event.event_end_date) {
      if (today > this.event.event_end_date) {
        this.expiredEvent = true;
        return true;
      } else {
        this.expiredEvent = false;
        return false
      }
    }else{
      return false;
    }

  }
}
