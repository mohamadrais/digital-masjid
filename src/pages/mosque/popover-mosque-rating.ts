import { Component } from '@angular/core';
import { ViewController, NavParams, PopoverController } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { HttpService } from "../../app/service/http-service";
import { Mosques } from '../../app/models/Mosques';

@Component({
    selector: 'page-popover-mosque-rating',
    templateUrl: 'popover-mosque-rating.html',
})
export class PopoverMosqueRatingPage {
    halfStar: number = 0;
    fullStaryArray: Array<number> = [];
    emptyStarArray: Array<number> = [];
    ori_ratings:number = 0;
    new_ratings:number = 0;
    user_id:String;
    google_place_id:String;
    mosque:Mosques;

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public global: Globals, public httpService: HttpService, public popoverCtrl: PopoverController) {
        this.user_id = this.navParams.get("userId");
        this.mosque = this.navParams.get("mosque");
        this.google_place_id = this.mosque._id;
        this.httpService.getMosqueRatingByUser(this.user_id, this.google_place_id).subscribe(data=>{
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
            this.httpService.addMosqueRating(this.user_id, this.google_place_id, this.new_ratings).subscribe(data=>{
                data.mosque = this.mosque;
                this.viewCtrl.dismiss(data);
            });
        }else if(this.ori_ratings>0 && this.new_ratings>0){
            this.httpService.updateMosqueRating(this.user_id, this.google_place_id, this.new_ratings).subscribe(data=>{
                data.mosque = this.mosque;
                this.viewCtrl.dismiss(data);
            });
        }
        
    }
}
