import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../app/service/http-service";
import { RegisterUstazPage } from '../register-ustaz/register-ustaz';

/**
 * Generated class for the SearchModeratorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-moderator',
  templateUrl: 'search-moderator.html',
})
export class SearchModeratorPage {
  moderatorName:string = "";
  moderatorList:Array<string> = [];
  selectedModerator;
  callback;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService:HttpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchModeratorPage');
  }

  onInput(event){
    console.log("onInput event:");
    console.log(event);
    if (event._value.length >= 1){
      this.getModeratorList(event._value)
    }
  }

  getModeratorList(input:string){
    this.httpService.getUstazList(input).subscribe(data => {
      console.log("get ustaz list from getModeratorList: "+data);
      console.log(JSON.stringify(data));
      if( data ){
        this.moderatorList = data;
      } 
    }, error => {
      console.log(error)
    })
  }

  selectModerator(mod){
    if(!this.selectedModerator || (this.selectedModerator && (this.selectedModerator.email!= mod.email))){
      this.selectedModerator = mod;
    }else{
      this.selectedModerator = '';
    }
    
    console.log(this.selectedModerator);
  }

  close(){
    this.navCtrl.pop().then(()=>{
      this.navParams.get('callback')(this.selectedModerator);
   });
  }

  newModerator(){
    this.navCtrl.push(RegisterUstazPage, {
      callback: data =>{
        this.moderatorName=data;
        this.getModeratorList(this.moderatorName);
      },
      "data":this.moderatorName,
     });
  }
}
