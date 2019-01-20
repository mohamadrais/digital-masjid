import { Component,  ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import {HttpService} from "../../app/service/http-service";
import { Globals} from "../../app/constants/globals";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgotPassword.html',
})
export class ForgotPassword {
  @ViewChild(Slides) slides: Slides;
  email:string;
  code:string;
  resetPassword:string;
  resetPassword2:string;
  flowButton="Next";
  registered:boolean=true;
  failure:boolean=false;
  emailSuccess:boolean=false;
  verifySuccess:boolean=false;
  resetSuccess:boolean=false;
  serverError:boolean=false;
  invalidInput=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public httpService:HttpService, public global:Globals) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPassword');
    this.slides.lockSwipeToPrev(true);
    this.slides.lockSwipeToNext(true);
  }

  forgotPasswordButton(){
    if(this.flowButton=="Close"){
      this.navCtrl.pop();
    }else{
      if((this.email && this.slides.isBeginning())||
         (this.code && this.slides.getActiveIndex()==1)||
         (this.resetPassword && this.resetPassword2 && this.slides.getActiveIndex()==2)){
        this.invalidInput=false;
        
          if(!this.registered || !this.slides.isEnd()){
            if(this.slides.isBeginning()){
              console.log("expected slide 0, gotten: "+this.slides.getActiveIndex());
              this.sendVerificationCode();
            }else if(this.slides.getActiveIndex()==1){// if current slide is second slide
              console.log("expected slide 1, gotten: "+this.slides.getActiveIndex());
              this.verifyToken();
            }else if(this.slides.getActiveIndex()==2){// if current slide is third slide
              console.log("expected slide 2, gotten: "+this.slides.getActiveIndex());
              this.saveResettedPassword(this.code);
            }
          }else{
            this.flowButton="Close";
          }
        
      }else{
        this.invalidInput=true;
      }
    }
  }

  sendVerificationCode(){
    this.failure=false;
    this.httpService.forgotPassword(this.email).subscribe(data => {
      if(data.status=="success"){
        console.log("data from sendVerificationCode: "+data);
        this.emailSuccess=true;
        if(this.slides.getActiveIndex()==0){
          this.moveSlide();
          this.flowButton="Next";
        }
      }else if(data.status=="failure"){
        this.registered=false;
      }else{
        this.serverError=true;
      }
    })
    //this.moveSlide();
  }

  verifyToken(){
    this.httpService.verifyToken(this.code, this.email).subscribe(data => {
      if(data.status=="success"){
        console.log("data from verifyToken: "+data);
        this.verifySuccess=true;
        this.moveSlide();
        this.flowButton="Next";
      }else if(data.status=="failure"){
        this.failure=true;
      }else{
        this.serverError=true;
      }
    })
    //this.moveSlide();
  }

  saveResettedPassword(code:string){
    console.log("code from saveResettedPassword: "+code);
    this.httpService.resetPassword(this.email, code, this.resetPassword).subscribe(data => {
      if(data.status=="success"){
        console.log("data from saveResettedPassword: "+data);
        this.resetSuccess=true;
        this.moveSlide();
      }else{
        this.serverError=false;
      }
    })
    //this.moveSlide();
  }

  moveSlide(){
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
    console.log("moved slide once");
    if(this.slides.isEnd()){
      console.log("reached last slide");
      this.flowButton="Close";
    }
  }

}


//@aishah
//TODO:write catch block for server fail