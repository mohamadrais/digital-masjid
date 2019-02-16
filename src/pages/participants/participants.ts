import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { User } from "../../app/models/User";

/**
 * Generated class for the ParticipantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-participants',
  templateUrl: 'participants.html',
})
export class ParticipantsPage {

  eventId: string = "";
  userList:Array<User> = [];

  isEventEnded = false;
  eventEndDtm:String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService, public alertCtrl: AlertController) {
    this.eventId = navParams.get('eventId');
    this.eventEndDtm = navParams.get('eventEndDtm');

    let today = new Date().toISOString();
    if(today>=this.eventEndDtm){
      this.isEventEnded = true;
    }
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

  downloadParticipantsList(){
    //to download csv file
    this.httpService.downloadParticipantList(this.eventId).subscribe(res => {
      if(res && res.status && res.status.toLowerCase() == "failure"){
        this.failAlert();
      }
    });
  }

  downloadAttendanceList(){
    //to download csv file
    this.httpService.downloadAttendanceList(this.eventId).subscribe(res => {
      if(res && res.status && res.status.toLowerCase() == "failure"){
        this.failAlert();
      }
    });
  }

  failAlert() {
    const confirm = this.alertCtrl.create({
      title: 'Error occured',
      message: 'Please try again later',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

}
