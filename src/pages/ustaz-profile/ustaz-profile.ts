import { Component } from '@angular/core';
import { NavController, NavParams,  PopoverController  } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { User } from "../../app/models/User";
import { HttpService } from "../../app/service/http-service";
import { Events } from "../../app/models/Events";
import { EventDetailsPage } from '../event-details/event-details';
import { PopoverRatingPage } from './popover-rating';

/**
 * Generated class for the UstazProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-ustaz-profile',
  templateUrl: 'ustaz-profile.html',
})
export class UstazProfilePage {
  events_history:Array<Events> = [];
  events_upcoming:Array<Events> = [];
  name: string = "";
  email: string = "";
  avgRating: string = "0";
  ratersCount: string = "0";
  userType: string = "";
  userId:string=""; //generic user who currently logged in
  moderator:User;
  halfStar: number = 0;
  fullStaryArray: Array<number> = [];
  emptyStarArray: Array<number> = [];
  eventsSize: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: Globals, public httpService: HttpService, public popoverCtrl: PopoverController) {
    this.moderator = navParams.get('data');
    console.log('nav params from ustaz profile page constructor: ' + navParams.get('data'));
    console.log(this.moderator);
    this.global.get(AppConstants.USER).then(data => {
      if (data) {
        // if ustaz profile page is reached from an event
        if (this.moderator) {
          // check if current logged in user id = nav param moderator id
          if (data._id == this.moderator._id) {
            this.moderator=data;
            this.moderator._id = data._id;
            this.moderator.name = data.name;
            this.moderator.email = data.email;
            this.moderator.avgRating = data.avgRating;
            this.moderator.ratersCount = data.ratersCount;
            this.calculateStar(this.moderator.avgRating);
          }
          // get ustaz details from server
          else {
            this.getUstazDetails(this.moderator._id);
            this.userId = data._id;
          }
        }
        // if ustaz profile page is reached by ustaz 
        else {
          this.moderator=data;
          this.moderator._id = data._id;
          this.moderator.name = data.name;
          this.moderator.email = data.email;
          this.moderator.avgRating = data.avgRating;
          this.moderator.ratersCount = data.ratersCount;
          this.getRating(this.moderator._id);
          // this.calculateStar(this.avgRating);
        }
        this.userType = data.userType;
        this.userId = data._id;

        this.findEvents(AppConstants.EVENT_HISTORY);
        this.findEvents(AppConstants.EVENT_UPCOMING);
       
      }
    });
  }
  
  //@aishah
  //todo: save the events history and upcoming specific for user in sqlite
  findEvents(eventEndType){
    this.httpService.findEventsForUser(this.userId, this.userType, eventEndType).subscribe(data => {
      console.log(" events data "+data);
      console.log(JSON.stringify(data));
      
      if( data ){
        if(eventEndType==AppConstants.EVENT_HISTORY){
          this.events_history = data;
        }else if(eventEndType==AppConstants.EVENT_UPCOMING){
          this.events_upcoming = data;
        }
        
        this.eventsSize = data.length;
      } 
    }, error => {
      console.log(error)
    })
  }
  
  getUstazDetails(moderatorId: string) {
    this.httpService.findUser(moderatorId).subscribe(data => {
      console.log(" user details from getUstazDetails: " + data);
      console.log(JSON.stringify(data));
      this.moderator = data;
      if (data) {
        this.moderator = data;
        this.name = this.moderator.name;
        this.email = this.moderator.email;
        this.getRating(moderatorId);
      }
    }, error => {
      console.log(error)
    })
  }

  getRating(moderatorId){
    this.httpService.getAvgRating(moderatorId).subscribe(data=>{
      if(data.length>0){
        this.fullStaryArray=[];
        this.halfStar=0;
        this.emptyStarArray=[];
        this.avgRating = data[0].avgRating;
        this.ratersCount = data[0].ratersCount;
        this.calculateStar(this.avgRating);
      }else if(data.length==0){
        this.emptyStarArray=[1,1,1,1,1];
        this.avgRating="0";
        this.ratersCount="0";
      }
    });
  }

  getSeatsLeft(event: Events): number {
    return (event.quota - event.users.length);
  }

  eventdetailsPage(event: Events) {
    this.navCtrl.push(EventDetailsPage, { 'data': event });
  }

  public getEventDate(event_date: string): string {
    var date = null;
    if (event_date) {
      try {
        var eventdate = new Date(event_date);
        date = eventdate.getDate() + "/" + (eventdate.getMonth()+1) + "/" + eventdate.getFullYear() + " " + eventdate.getUTCHours() + ":" + eventdate.getMinutes();
      } catch (e) {

      }
    } else {
      var today = new Date();
      date = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear() + " " + today.getUTCHours() + ":" + today.getMinutes();
    }

    return date;
  }

  calculateStar(avgRating) {
    if(avgRating && avgRating>0){
      for (var i = 1; i <= Math.floor(parseFloat(avgRating)); i++) {
        this.fullStaryArray.push(1);
      };
      if (parseFloat(avgRating) % 1 != 0) this.halfStar++;
      for (var i = 1; i <= (5 - Math.ceil(parseFloat(avgRating))); i++) {
        this.emptyStarArray.push(1);
      };
    }else{
      this.emptyStarArray=[1,1,1,1,1];
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UstazProfilePage');
  }

  popoverRating(myEvent) {
    let popover = this.popoverCtrl.create(PopoverRatingPage,{"userId":this.userId,"moderatorId":this.moderator._id}, {showBackdrop: true, cssClass:"popover-rating"});
      popover.present({
        ev: myEvent
      });
    popover.onDidDismiss(data=>{
      if(data){
        this.getUstazDetails(this.moderator._id);
      }
    })
  }

}
