import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';
import { Globals } from "../../app/constants/globals";

/*
  Generated class for the ConnectivityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export enum ConnectionStatusEnum {
  Online,
  Offline
}
@Injectable()
export class ConnectivityProvider {

  onDevice: boolean;
  previousStatus;

  constructor(public eventCtrl:Events, private network: Network, public global: Globals) {
    console.log('Hello ConnectivityProvider Provider');
    // this.onDevice = this.platform.is('cordova');
    this.previousStatus = ConnectionStatusEnum.Online;
    if(!this.network || this.network.type.toLowerCase()=="none" || this.network.type.toLowerCase()=="unknown"){
      this.previousStatus = ConnectionStatusEnum.Offline;
      this.global.generalSettings.networkAvailable = false;
    }else{
      this.previousStatus = ConnectionStatusEnum.Online;
      this.global.generalSettings.networkAvailable = true;
    }
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
        if (this.previousStatus === ConnectionStatusEnum.Online) {
            this.eventCtrl.publish('network:offline');
        }
        this.previousStatus = ConnectionStatusEnum.Offline;
        this.global.generalSettings.networkAvailable = false;
    });
    this.network.onConnect().subscribe(() => {
        if (this.previousStatus === ConnectionStatusEnum.Offline) {
            this.eventCtrl.publish('network:online');
        }
        this.previousStatus = ConnectionStatusEnum.Online;
        this.global.generalSettings.networkAvailable = true;
    });
  }
}
