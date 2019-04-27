import { Component } from '@angular/core';
import { ViewController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";
import { HttpService } from "../../app/service/http-service";
import { KariahUser } from "../../app/models/KariahUser";
import { e } from '@angular/core/src/render3';

@Component({
    selector: 'page-popover-kariah-approval',
    templateUrl: 'popover-kariah-approval.html',
})
export class PopoverKariahApprovalPage {
    kariahUser: KariahUser;
    newApproverId: string;
    currentUserType: string;

    currentApprovalStatus: string;
    currentApprovalComment: string;
    currentApprovalBy: string;
    newApprovalComment: string = "";
    newApprovalStatus: string;

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public global: Globals, public httpService: HttpService, public popoverCtrl: PopoverController, public alertCtrl: AlertController) {
        this.kariahUser = this.navParams.get("kariahUser");
        this.currentUserType = this.navParams.get("currentUserType");
        this.newApproverId = this.navParams.get("newApproverId");
        this.currentApprovalStatus = this.navParams.get("currentApprovalStatus");
        this.currentApprovalComment = this.navParams.get("currentApprovalComment");
        this.currentApprovalBy = this.navParams.get("currentApprovalBy");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopoverKariahApproval');
    }

    close() {
        this.viewCtrl.dismiss();
    }

    sendApprovalUpdate(formApprovalStatus) {
        if (formApprovalStatus == 'Rejected' && (this.newApprovalComment == null || this.newApprovalComment == '' || this.newApprovalComment == this.currentApprovalComment)) {
            this.showAlert("invalid", "Please provide a new reject reason in the New Approval Comment field.");
        }
        else {
            this.newApprovalStatus = formApprovalStatus;
            this.httpService.updateKariahStatusByAdmin(
                this.currentUserType,
                this.kariahUser._id,
                this.kariahUser.userId,
                this.kariahUser.kariah,
                this.newApprovalStatus,
                this.newApprovalComment,
                this.newApproverId
            ).subscribe(data => {
                if (data && data.status && data.status == "success") {
                    this.showAlert(data.status, data.message);
                    //this.viewCtrl.dismiss();
                }
                else if (data && data.status && data.status == "failure") {
                    if (data.message) {
                        console.log("Sorry, " + data.message);
                    }
                    this.showAlert(data.status, data.message);
                    // this.viewCtrl.dismiss(data);
                }
                else if (!data) {
                    this.showAlert("failure", "Sorry, approval not be updated at the moment.");
                    // this.viewCtrl.dismiss(data);
                }
            }, error => {
                console.log("error from sendApprovalUpdate popover: " + error)
                this.showAlert("failure", "Sorry, approval could not be updated at the moment.");
                // this.viewCtrl.dismiss(data);
            });

        }


    }

    showAlert(msgStatus, msgType) {
        var alertTitle = "";
        var messageBody = "";
        if (msgStatus == "success") {
            alertTitle = 'Kariah membership successfully ' + this.newApprovalStatus.toLowerCase();
            messageBody = "";
        }
        else if (msgStatus == "failure") {
            alertTitle = 'Something went wrong...';
            messageBody = msgType + " Please retry later."
        }
        else if (msgStatus == "invalid") {
            alertTitle = 'Please provide reason ... ';
            messageBody = msgType;
        }

        const confirm = this.alertCtrl.create({
            title: alertTitle,
            message: messageBody,
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        if (msgStatus == "success") {
                            this.kariahUser.approvalBy = this.newApproverId;
                            this.kariahUser.approvalComment = this.newApprovalComment;
                            this.kariahUser.approvalStatus = this.newApprovalStatus;
                            let returnData = {
                                "kariahUser": this.kariahUser,
                                "newApproverId": this.newApproverId,
                                "newApprovalComment": this.newApprovalComment,
                                "newApprovalStatus": this.newApprovalStatus
                            }
                            
                            this.viewCtrl.dismiss(returnData);
                        }
                    }
                }
            ]
        });
        confirm.present();
    }
}
