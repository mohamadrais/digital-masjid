import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, PopoverController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { AdminHomePage } from '../admin-home/admin-home';
import {HttpService} from "../../app/service/http-service";
import { Globals} from "../../app/constants/globals";
import {AppConstants} from "../../app/constants/app-constants";
import { UstazProfilePage } from '../ustaz-profile/ustaz-profile';
import { ForgotPassword } from '../forgot-password/forgotPassword';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //password:string;
  //username:string;
  validUser:boolean = true;
  loginForm = { username: '', password: ''}

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService:HttpService, public global:Globals, public events: Events, public popoverCtrl: PopoverController) {
      console.log('login form:' +this.loginForm)
  }

  forgotPasswordPage(){
    this.navCtrl.push(ForgotPassword)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  registerPage(){
    this.navCtrl.push(RegisterPage)
  }

  homePage(){
    this.navCtrl.setRoot(HomePage)
  }

  adminhomePage(){
    this.navCtrl.setRoot(AdminHomePage)
  }

  ustazProfilePage(){
    this.navCtrl.setRoot(UstazProfilePage);
  }

  authenticateUser(){
    this.httpService.authenticateUser(this.loginForm.username, this.loginForm.password).subscribe(data => {
      //if( data && data.userType != undefined ){
      if( data && data.userType != undefined ){
        this.global.set(AppConstants.USER, data);
        console.log("AppConstants.USER = "+ data);
        if( data.userType.toUpperCase() === AppConstants.USER_TYPE_ADMIN ){
          this.adminhomePage();
          this.events.publish('userType:admin');
        } else if (data.userType.toUpperCase() === AppConstants.USER_TYPE_MODERATOR) {
          this.ustazProfilePage();
          this.events.publish('userType:ustaz');
        }
          else {
          this.homePage();
          this.events.publish('userType:user');
        }
      } else {
        this.validUser = false;
      }
    } , error => {
        //need to handle bread crumbs here
    })
  }
}
