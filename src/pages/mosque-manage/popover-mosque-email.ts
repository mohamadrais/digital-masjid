import { Component } from '@angular/core';
import { ViewController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { HttpService } from "../../app/service/http-service";
import { Mosques } from '../../app/models/Mosques';

@Component({
    selector: 'page-popover-mosque-email',
    templateUrl: 'popover-mosque-email.html',
})
export class PopoverMosqueEmailPage {
    public mosque_email: string = "";
    public updateMode = false;
    adminId: string;
    mosque: Mosques;

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public global: Globals, public httpService: HttpService, public popoverCtrl: PopoverController, public alertCtrl: AlertController) {
        this.adminId = this.navParams.get("adminId");
        this.mosque = this.navParams.get("mosque");
        if (this.mosque.mosque_email) {
            if (this.mosque.mosque_email != "") {
                this.updateMode = true;
                this.mosque_email = this.mosque.mosque_email;
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopoverMosqueEmailPage');
    }

    close() {
        this.viewCtrl.dismiss();
    }

    addUpdateEmail() {
        if (this.mosque_email != "" && !this.validateEmailPattern(this.mosque_email)) {
            this.showAlert();
        }
        else if (this.mosque_email == this.mosque.mosque_email) {
            this.close();
        }
        else {
            this.mosque.mosque_email = this.mosque_email;
            this.httpService.updateMosque(this.mosque, this.adminId).subscribe(data => {
                if (data && data.status && data.status == "success") {
                    console.log(`result from addUpdateEmail.updateMosque: ${'\n'+JSON.stringify(data)}`);
                    this.viewCtrl.dismiss(data);
                }
                else {
                    this.failAlert(data.message);
                }


            });
        }
    }

    failAlert(msg) {
        const confirm = this.alertCtrl.create({
            title: 'Our apologies! Something went wrong...',
            message: msg,
            buttons: [
                {
                    text: 'Try again',
                    handler: () => {
                    }
                },
                {
                    text: 'Go back',
                    handler: () => {
                        this.viewCtrl.dismiss();
                    }
                }
            ]
        });
        confirm.present();
    }

    showAlert() {
        let alert = this.alertCtrl.create({
            title: "Incomplete information",
            subTitle: 'Please make sure the email is valid.',
            buttons: ['Dismiss']
        });
        alert.present();
    }

    validateEmailPattern = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
