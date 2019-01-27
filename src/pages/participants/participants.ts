import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { User } from "../../app/models/User";

/**
 * Generated class for the ParticipantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-participants',
  templateUrl: 'participants.html',
})
export class ParticipantsPage {

  eventId: string = "";
  userList:Array<User> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
    this.eventId = navParams.get('eventId');
    console.log("navParams.get('eventId'): "+navParams.get('eventId'));
    console.log("this.eventId: "+this.eventId);
    if(this.eventId){
      this.httpService.getParticipantsList(this.eventId).subscribe(data => {
        if(data){
          this.userList = data[0].user_details;
        }
      }, error => {
        console.log("Issue occured while get participants list: "+error);
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticipantsPage');
  }

}
