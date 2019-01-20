import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { UstazProfilePage } from '../ustaz-profile/ustaz-profile';
import { CreateEventPage } from '../create-event/create-event';
import { Events } from "../../app/models/Events";
import { HttpService } from "../../app/service/http-service";
import { HomePage } from '../home/home';
import { Globals } from "../../app/constants/globals";
import { AdminHomePage } from '../admin-home/admin-home';
import { AlertController } from 'ionic-angular';
import { User } from "../../app/models/User";
import { Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppConstants } from '../../app/constants/app-constants';

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
  event: Events;
  isAdmin: boolean = false;
  isModerator: boolean = false;
  eventAlreadyJoined: boolean = false;
  favoriteClicked: boolean = false;

  currentUser: User;
  updated: boolean = false;
  fromProfile:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService: HttpService, public global: Globals, public alertCtrl: AlertController,
    public platform: Platform, private socialSharing: SocialSharing) {
    this.event = navParams.get('data'); //for homepage flow with multiuser list per event, current user may have not joined yet
    this.fromProfile = navParams.get('fromProfile'); //for profile flow of current user joined
    if(this.fromProfile){
      this.eventAlreadyJoined = true;
    }
    this.global.get("USER").then(data => {
      this.currentUser = data;
      if (this.event.users && this.event.users.length > 0) {
        if (this.contains(this.event.users, data._id)) {
          this.eventAlreadyJoined = true;
        }
      }
      if (this.currentUser.eventsBookmarked && this.currentUser.eventsBookmarked.length > 0) {
        if (this.contains(this.currentUser.eventsBookmarked, this.event._id)) {
          this.favoriteClicked = true;
        }
      }
      if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_ADMIN) {
        this.isAdmin = true;
      } else if (this.currentUser && this.currentUser.userType === AppConstants.USER_TYPE_MODERATOR) {
        this.isModerator = true;
      }
    });
    if (!this.event.moderator_details || !this.event.mosque_details || this.event.mosque_details.length <= 0 || this.event.moderator_details.length <= 0) {
      this.httpService.findEventDetailsById(this.event._id).subscribe(data => {
        this.event = data;
      })
    }

    this.httpService.countMaleParticipants(this.event._id).subscribe(data => {
      this.event.maleCount = data;
      this.event.femaleCount = this.event.userCount - this.event.maleCount;
    });
  }

  goBack() {
    this.navCtrl.pop().then(() => {
      if (this.updated) {
        this.navParams.get('callback')(this.event);
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

  joinEvent() {

    this.httpService.subscribeEvents(this.event, this.currentUser._id).subscribe(data => {
      this.navigate();
    }, error => {
      console.log("Issue occured while joining the event");
    });
  }

  declineEvent() {
    this.httpService.unSubscribeEvents(this.event, this.currentUser._id).subscribe(data => {
      this.navigate();
    }, error => {
      console.log("Issue occured while declining the event");
    });
  }

  navigate(){
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

    return date;
  }
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Do you wish to join this event?',
      message: 'By clicking join, you will be registered to be a participant for this event.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Join',
          handler: () => {
            console.log('Join clicked');
            this.joinEvent();
          }
        }
      ]
    });
    confirm.present();
  }

  showDeclineConfirmation() {
    const confirm = this.alertCtrl.create({
      title: 'Do you wish to decline this event?',
      message: 'By clicking Decline, you will be unregistered from this event.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Decline',
          handler: () => {
            console.log('Join clicked');
            this.declineEvent();
          }
        }
      ]
    });
    confirm.present();
  }

  contains(a, obj) {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        return true;
      }
    }
    return false;
  }

  changeColor() {
    this.favoriteClicked = true;
  }
  getSeatsLeft(event: Events): number {
    return (event.quota - event.users.length);
  }

  openMap(event: Events) {
    if (this.platform.is('ios')) {
      window.open('maps://?q=' + event.mosque_details[0].title, '_system');
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + event.mosque_details[0].title, '_system');
    }
  }

  shareEvent() {
    let linkMap = this.event.mosque_details[0].title;
    for (let i = 0; i < linkMap.length; i++) {
      linkMap = linkMap.replace("-", "+");
      linkMap = linkMap.replace(" ", "+");
    }

    let mString = "";

    for (let x = 0; x < this.event.moderator_details.length; x++) {
      if (x < (this.event.moderator_details.length - 1)) {
        mString += this.event.moderator_details[x].name + ", ";
      } else {
        mString += " and " + this.event.moderator_details[x].name;
      }
    }

    this.socialSharing.share("Come join " + this.event.event_title + "(" + this.event.category + ")" + " by " + mString + " on " + this.getEventDate(this.event.event_start_date) + "-" + this.getEventDate(this.event.event_end_date) + " at " + this.event.mosque_details[0].title, this.event.event_title + "(" + this.event.category + ")", "", "https://www.google.com/maps/search/?api=1&query=" + linkMap). //temporary link. need to use place id or lat lng. this link may crash in ios 11
      then(() => {
        console.log("Sharing success");
        // Success!
      }).catch(() => {
        // Error!
        console.log("Share failed");
      });
  }
}
