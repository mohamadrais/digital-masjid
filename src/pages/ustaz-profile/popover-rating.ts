import { Component } from '@angular/core';
import { ViewController, NavParams, PopoverController } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { HttpService } from "../../app/service/http-service";


/**
 * Generated class for the UstazProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
    selector: 'page-popover-rating',
    templateUrl: 'popover-rating.html',
})
export class PopoverRatingPage {
    halfStar: number = 0;
    fullStaryArray: Array<number> = [];
    emptyStarArray: Array<number> = [];
    ori_ratings:number = 0;
    new_ratings:number = 0;
    user_id:String;
    moderator_id:String;

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public global: Globals, public httpService: HttpService, public popoverCtrl: PopoverController) {
        this.user_id = this.navParams.get("userId");
        this.moderator_id = this.navParams.get("moderatorId");
        this.httpService.getRatingByUser(this.user_id, this.moderator_id).subscribe(data=>{
            if(data){
                this.ori_ratings = data.rating;
                this.new_ratings = this.ori_ratings;
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ModeratorRating');
    }

    close() {
        this.viewCtrl.dismiss();
    }

    rate(){
        if(this.ori_ratings==this.new_ratings){
            this.close();
        }else if(this.ori_ratings==0 && this.new_ratings>0){
            this.httpService.addRating(this.user_id, this.moderator_id, this.new_ratings).subscribe(data=>{
                this.viewCtrl.dismiss(data);
            });
        }else if(this.ori_ratings>0 && this.new_ratings>0){
            this.httpService.updateRating(this.user_id, this.moderator_id, this.new_ratings).subscribe(data=>{
                this.viewCtrl.dismiss(data);
            });
        }
        
    }
}
