import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from "../../app/models/Events";
import { HttpService } from "../../app/service/http-service";
import { HomePage } from "../home/home";
import { AdminHomePage } from '../admin-home/admin-home';
import { AppConstants } from "../../app/constants/app-constants";
import { Globals } from "../../app/constants/globals";
import { AlertController } from 'ionic-angular';
import { SearchModeratorPage } from '../search-moderator/search-moderator'
import { SearchManagedMosquesPage } from '../search-managed-mosques/search-managed-mosques';

/**
 * Generated class for the CreateEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {
  valid: boolean = true;
  event_title: string;
  category: string;
  ustaz: Array<any> = [];
  mosque;
  points: string;
  quota: number
  event_start_date: string;
  event_end_date: string;
  event_description: string;
  event_status: string;
  // address:string;	
  public event: Events;
  minYear: number;
  maxYear: number;
  editMode: boolean = false;
  eventId: string = "";
  isEventDateModified: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService: HttpService,
    public global: Globals, public alertCtrl: AlertController) {
    this.minYear = ((new Date()).getFullYear() - 1);
    this.maxYear = ((new Date()).getFullYear() + 1);

    if (this.navParams.get("data")) {
      this.event = this.navParams.get("data");
      this.eventId = this.event._id;
      this.event_title = this.event.event_title;
      this.category = this.event.category;
      this.ustaz = this.event.moderator_details;
      this.mosque = this.event.mosque_details[0];
      this.points = this.event.points.toString();
      this.quota = this.event.quota;
      this.event_start_date = this.event.event_start_date;
      this.event_end_date = this.event.event_end_date;
      this.event_description = this.event.event_description;
      this.event_status = this.event.event_status;
      this.editMode = true;
    }

    // this.global.get(AppConstants.USER).then(userdata => {
    //   if( userdata){
    //     this.httpService.getPreferredMosque(userdata.email).subscribe(data => {
    //       if( data && data.length > 0){
    //         //this.navCtrl.push(HomePage)
    //         // this.address=data;
    //       }
    //     }, error => {
    //       //error message here :TODO
    //     });
    //   }
    // });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }


  homePage() {
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage() {
    this.navCtrl.setRoot(AdminHomePage)
  }

  lookupModerator() {

    this.navCtrl.push(SearchModeratorPage, {
      callback: data => {
        this.ustaz.push(data);
      }
    })
  }

  lookupMosque() {

    this.navCtrl.push(SearchManagedMosquesPage, {
      callback: data => {
        this.mosque = data;
      }
    })
  }

  deleteUstaz(i: number) {
    this.ustaz.splice(i, 1)
  }

  createEvent() {
    if (this.validateData()) {

      this.prepareData();

      this.global.get(AppConstants.USER).then(userdata => {
        this.event.created_by = userdata._id;
        this.httpService.createEvent(this.event).subscribe(data => {
          if (data && data._id.length >= 0) {
            //this.navCtrl.push(HomePage)
            if (userdata.userType.toUpperCase() === AppConstants.USER_TYPE_ADMIN) {
              this.adminhomePage();
            } else {
              this.homePage();
            }
          }
        }, error => {
          //error message here :TODO
        });
      });
    } else {
      this.valid = false;
    }
  }


  updateEvent() {
    if (this.validateData()) {

      this.prepareData();

      this.httpService.updateEvent(this.event, this.isEventDateModified).subscribe(data => {
        if (data.status == "success") {
          this.navCtrl.pop().then(() => {
            this.event.mosque_details = this.mosque;
            this.event.moderator_details = this.ustaz;
            this.navParams.get('callback')(this.event);
          });
        }
      }, error => {
        //error message here :TODO
      });
    } else {
      this.valid = false;
    }
  }

  prepareData() {
    this.event = new Events();
    this.event._id = this.eventId;
    this.event.event_title = this.event_title;
    this.event.category = this.category;
    this.event.ustaz = this.getUstazIdArray();
    this.event.points = this.points ? parseInt(this.points) : 0;
    this.event.quota = this.quota;
    this.event.event_start_date = this.event_start_date;
    this.event.event_end_date = this.event_end_date;
    this.event.address = (this.mosque.google_place_id) ? this.mosque.google_place_id : this.mosque._id;
    this.event.event_description = this.event_description;
    this.event.createdTimestamp = new Date().toISOString();
  }

  validateData() {
    if (this.editMode) {
      // set isEventDateModified flag if event start date or end date has been changed
      if ((this.event_start_date && this.event_start_date != this.event.event_start_date)
        || (this.event_end_date && this.event_end_date != this.event.event_end_date)) {
        this.isEventDateModified = true;
      }

      return ((this.event_title && this.event_title != this.event.event_title)
        || (this.category && this.category != this.event.category)
        || (this.ustaz && this.ustaz.length > 0)
        || (this.points && (this.points ? parseInt(this.points) : 0) != this.event.points)
        || (this.quota && this.quota != this.event.quota)
        || (this.event_start_date && this.event_start_date != this.event.event_start_date)
        || (this.event_end_date && this.event_end_date != this.event.event_end_date)
        || (this.mosque && this.mosque != this.event.mosque_details[0])
        || (this.event_description && this.event_description != this.event.event_description))
    } else {
      return (this.event_title && this.category && this.ustaz && this.ustaz.length > 0 && this.points && this.quota && this.event_start_date && this.event_end_date && this.mosque && this.event_description);
    }
  }

  getUstazIdArray() {
    let uList = [];
    for (let x = 0; x < this.ustaz.length; x++) {
      uList.push(this.ustaz[x]._id);
    }
    return uList;
  }

  showConfirm() {
    let mode = (this.editMode) ? 'update' : 'create';

    const confirm = this.alertCtrl.create({
      title: 'Do you wish to ' + mode + ' this event?',
      message: 'By clicking ' + mode + ', your event will be ' + mode + 'd and Displayed.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: mode,
          handler: () => {
            console.log(mode + ' clicked');
            (this.editMode) ? this.updateEvent() : this.createEvent();
          }
        }
      ]
    });
    confirm.present();
  }

}
