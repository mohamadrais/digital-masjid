import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class Globals{
    public userId:string;

    constructor(public storage: Storage){

    }

    public set(settingName,value){
      return this.storage.set(settingName,value);
    }
    public async get(settingName){
      return await this.storage.get(settingName);
    }

    /**
     * Set user id.
     */
    setUserId(userId:string){
        console.log("setting Globals.userId:"+userId);      
        this.userId=userId;
        this.storage.set("USER_ID",this.userId);
    }

    /**
     * Get login user first name.
     */
    getUserId(){
      return this.userId;
    }
}