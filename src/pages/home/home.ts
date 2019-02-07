import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { CreateEventPage } from '../create-event/create-event';
import { FeedbackPage } from '../feedback/feedback';
import { FeedbackAltPage } from '../feedback-alt/feedback-alt';
import { MosquePage } from '../mosque/mosque';
import { HttpService } from "../../app/service/http-service";
import { Events } from "../../app/models/Events";
import { User } from "../../app/models/User";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Globals } from "../../app/constants/globals";
import { AppConstants } from "../../app/constants/app-constants";
import { LocationsProvider } from '../../providers/locations/locations'
import { Mosques } from '../../app/models/Mosques';
import { NotificationPage } from '../notification/notification';
import { SearchMosquePage } from '../search-mosque/search-mosque';
import { Network } from '@ionic-native/network';
import { Observable } from 'rxjs/Rx';
import { googlemaps } from 'googlemaps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  events:Array<Events> = [];
  mosques:Array<Mosques> = [];
  mosquesSize:number = 0;
  user:Array<User> = [];
  address:string = "";
  updated:string = "";
  nickname:string = "";
  userData:User;

  geocoderGoogle: any;
  GooglePlaces: any;
  nearbyItems: any = new Array<any>();
  autocomplete: any;
  GoogleAutocomplete: any;

  constructor(public navCtrl: NavController, public httpService:HttpService,
    public geolocation: Geolocation, public geocoder: NativeGeocoder, public global:Globals, public locations: LocationsProvider, public loadingCtrl: LoadingController, public network:Network, public alertCtrl:AlertController,public zone: NgZone) {
    this.global.get(AppConstants.USER).then(data => {
      if( data){
        this.userData = data;
        this.nickname = this.userData.name; //this.userData.nickname;
      }
    });
    this.geocoderGoogle = new google.maps.Geocoder;
    let elem = document.createElement("div");
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
  }

  ionViewDidLoad(){
    this.startMosqueList();
  }

  startMosqueList(){
    if(!this.network || this.network.type.toLowerCase()=="none" || this.network.type.toLowerCase()=="unknown"){
      let alert = this.alertCtrl.create({
        title: "Can't connect to server",
        subTitle: 'Please make sure there is internet connection',
        buttons: ['Dismiss']
      });
      alert.present();
      
    }else{
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Loading...'
      });
  
      loading.present();
      
      // get permission for location status
      this.locations.getPermissionLocation().subscribe(dataGrantedAccess =>{

        if(dataGrantedAccess){
          // get gps location sensor is enabled...
          this.locations.getGPSLocationEnabled().subscribe(locationEnabled =>{
            console.log("location is enabled???"+locationEnabled);
            
            if(locationEnabled==true){
              
                this.locations.getMosqueList().subscribe(data =>{
                  console.log("datareturned???"+data);
                  console.log(data);
                  this.mosques=data;
                  console.log(this.mosques);
                  this.readCurrentLocation();
                  loading.dismiss();
                });
            }else{
              //request gps enable
              this.locations.requestEnableGPS().subscribe(requestedStatus=>{
                console.log("successss???"+requestedStatus);
                if(requestedStatus==true){
                    this.locations.getMosqueList().subscribe(data =>{
                      console.log("datareturned???"+data);
                      console.log(data);
                      this.mosques=data;
                      this.readCurrentLocation();
                      loading.dismiss();
                    },
                    error => {
                      loading.dismiss();
                      console.log(error);
                    });
                }else{
                  loading.dismiss();
                }
              },
              error => {
                loading.dismiss();
                console.log(error);
              })
            }
          },
          error => {
            loading.dismiss();
            console.log(error);
          });
        }else{
          loading.dismiss();
        }
      },
      error => {
        loading.dismiss();
        console.log(error);
      });
    }  
  }
  
  eventdetailsPage(event:Events){
    this.navCtrl.push(EventDetailsPage,{'data':event});
  }
  createeventPage(){
    this.navCtrl.push(CreateEventPage)
  }

  public getEventDate(event_date:string):string{
    var date = null;
    if( event_date ){
        try{
           var eventdate = new Date(event_date);
           date = eventdate.getDate()+"/"+(eventdate.getMonth()+1)+"/"+eventdate.getFullYear()+" "+eventdate.getUTCHours()+":"+eventdate.getMinutes();
        }catch(e){

        }
    } else {
        var today = new Date();
        date = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear()+" "+today.getUTCHours()+":"+today.getMinutes();
    }

    return date;
  }
  feedbackAltPage(){
    this.navCtrl.push(FeedbackAltPage)
  }
  mosquePage(mosque:Mosques){
    this.navCtrl.push(MosquePage,{'data':mosque})
  }
  notificationPage(){
    this.navCtrl.push(NotificationPage)
  }
  searchmosquePage(){
    this.navCtrl.push(SearchMosquePage)
  }

  getSeatsLeft(event:Events):number{
    return (event.quota - event.userCount);
  }

  readCurrentLocation(){
    let today:Date = new Date();
    this.updated = today.getDate()+"/"+(today.getMonth()+1)+" "+today.getUTCHours()+":"+today.getMinutes();
    let options = {
      maximumAge: 3000,
      enableHighAccuracy: true,
      timeout: 50000
    };
  
    this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
      this.geocoder.reverseGeocode(position.coords.latitude, position.coords.longitude).then((res: NativeGeocoderReverseResult[]) => {
        this.address = res[0].locality
        console.log('home.address : '+this.address );
       })
    }).catch((err) => {
      console.log(err);
    })
  }

  // getListOfMosques(){
  //   this.httpService.findMosques().subscribe(data => {
  //     console.log(" getListOfMosques() response data: ");
  //     console.log(JSON.stringify(data));
  //     this.mosques = data;
  //     console.log(" mosques data ");
  //     console.log(this.mosques);
  //     if( data ){
  //       this.mosquesSize = data.length;
  //     } 
  //   }, error => {
  //     console.log(error)
  //   })
  // }
}
