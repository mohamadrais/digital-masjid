import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpService } from "../../app/service/http-service";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { googlemaps } from 'googlemaps';
import { NgZone } from '@angular/core';
import { Mosques } from '../../app/models/Mosques';
import { App } from 'ionic-angular';
import { AppConstants } from '../../app/constants/app-constants';
/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LocationsProvider {
  mosqueData: any;
  latLng: any;
  usersLocation: any;
  grantedAccess=false;
  
  geocoder: any;
  autocompleteItems: any;
  GooglePlaces: any;
  nearbyItems_registered: Array<Mosques>;
  nearbyItems: Array<Mosques>;
  autocomplete: any;
  GoogleAutocomplete: any;

  constructor(public http: Http, public httpService:HttpService, public geoLoc: Geolocation, 
    private diagnostic: Diagnostic, public locationAccuracy:LocationAccuracy, 
    public zone: NgZone) {
    //console.log('Hello LocationsProvider Provider');

    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div");
    this.GooglePlaces = new google.maps.places.PlacesService(elem);

  }
  
  public getPermissionLocation():Observable<any>{
    
    return Observable.create(observer => {
  // this.diagnostic.isLocationEnabled().then((enabled)=>{
    
  // });
      this.diagnostic.isLocationAuthorized().then((status) => {
        //console.log(`AuthorizationStatus`);
        //console.log(status);
        this.grantedAccess=status;
        if (!this.grantedAccess) {
          this.diagnostic.requestLocationAuthorization().then((repliedStatus) => {
            switch(repliedStatus){
              case this.diagnostic.permissionStatus.NOT_REQUESTED:
                  console.log("Permission not requested");
                  observer.next(this.grantedAccess);
                  observer.complete();
                  this.grantedAccess=false;
                  break;
              case this.diagnostic.permissionStatus.DENIED:
                  console.log("Permission denied");
                  this.grantedAccess=false;
                  observer.next(this.grantedAccess);
                  observer.complete();
                  break;
              case this.diagnostic.permissionStatus.GRANTED:
                  console.log("Permission granted always");
                  this.grantedAccess=true;
                  observer.next(this.grantedAccess);
                  observer.complete();
                  break;
              case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                  console.log("Permission granted only when in use");
                  this.grantedAccess=true;
                  observer.next(this.grantedAccess);
                  observer.complete();
                  break;
          }
          })
        } else {
          //console.log("We have the permission");
          this.grantedAccess=true;
          observer.next(this.grantedAccess);
          observer.complete();
        }
      }, (statusError) => {
        console.log('statusError: ');
        console.log(statusError);
      });
 
    }).catch((error: any) => Observable.throw(error.json().error || 'Permission error'));

  }

  public getGPSLocationEnabled():Observable<any>{
    return Observable.create(observer => {
      this.diagnostic.isLocationEnabled().then((enabled)=>{
        observer.next(enabled);
        observer.complete();
      }, error => {
        console.log(error);
        observer.error();
      });
    }).catch((error: any) => Observable.throw(error.json().error || 'Get GPS Location enable error'));
  }

  public requestEnableGPS():Observable<any>{
    return Observable.create(observer =>{
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              console.log('Request successful');
              observer.next(true);
              observer.complete();
            },
            error => {
              console.log('Error requesting location permissions', error);
              observer.error();}
          );
        }
      
      });
    }).catch((error: any) => Observable.throw(error.json().error || 'Request Location accuracy error'));;
  }

  public _getMosqueList():Observable<any>{
        return Observable.create(observer =>{
            this.setUserLocation().then(() => {
              return new Promise(resolve => {
                this.httpService.findMosques().subscribe(data => {
                  this.mosqueData = this.applyHaversineMultipleLoc(data);
                  this.mosqueData.sort((locationA, locationB) => {
                      return locationA.distance - locationB.distance;
                  });
                  observer.next(this.mosqueData);
                  observer.complete();
                }, error => {
                  console.log(error);
                  observer.error();
                })

              });
            });
      }).catch((error: any) => Observable.throw(error.json().error || 'Get Mosque List Haversine() error'));
    
  }

  public getMosqueList():Observable<any>{

    return Observable.create(observer =>{
      this.setUserLocation().then(() => {
        return new Promise(resolve => {
          this.geocoder.geocode({'location': new google.maps.LatLng(this.usersLocation.lat, this.usersLocation.lng)}, (results, status) => {
            if(status === 'OK' && results[0]){
                this.autocompleteItems = [];
                this.GooglePlaces.nearbySearch({
                location: results[0].geometry.location,
                //radius: '2000',
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: 'mosque',
                key: 'AIzaSyB1dNnSpGH7sqJZjN5i5BohrMSpEV2z0lg'
                }, (near_places) => {
                this.zone.run(() => {
                    this.nearbyItems_registered = [];
                    this.nearbyItems = [];
                    let mosque_ids = []
                    //send near_places id's to BE, BE respond with all place_id found
                    let registeredMosques:Array<any>;

                    for (var i = 0; i < near_places.length; i++) {
                      mosque_ids.push(near_places[i].place_id)
                    }

                    this.httpService.getRegisteredMosques(mosque_ids).subscribe(data => {
                      if( data ){
                        registeredMosques = data;
                        for (var i = 0; i < near_places.length; i++) {
                          let mosque:Mosques = new Mosques();
                          //console.log(mosque);
                          let foundMosque = this.findRegisteredMosqueId(near_places[i].place_id, registeredMosques);
                          if(foundMosque>=0){
                            mosque._id = registeredMosques[foundMosque].google_place_id;
                            this.httpService.countActiveEvents(mosque._id).subscribe(data =>{
                              mosque.active_events_no = data;
                            })
                            mosque.title = registeredMosques[foundMosque].title;
                            mosque.address = registeredMosques[foundMosque].address;

                            if(near_places[i].photos && near_places[i].photos.length>1){
                              mosque.icon = near_places[i].photos[0].getUrl();
                              mosque.photo = near_places[i].photos[1].getUrl();
                            }else if(near_places[i].photos && near_places[i].photos.length>0 && near_places[i].photos.length<=1){
                              mosque.icon = near_places[i].photos[0].getUrl();
                              mosque.photo = near_places[i].photos[0].getUrl();
                            }else{
                              mosque.icon = 'assets/imgs/logo.png';
                              mosque.photo = 'assets/imgs/bg-home.jpg';
                            }

                            this.nearbyItems_registered.push(mosque);
                          }else{
                            mosque._id = near_places[i].place_id;
                            mosque.title = near_places[i].name;
                            mosque.address = near_places[i].vicinity;

                            if(near_places[i].photos && near_places[i].photos.length>1){
                              mosque.icon = near_places[i].photos[0].getUrl();
                              mosque.photo = near_places[i].photos[1].getUrl();
                            }else if(near_places[i].photos && near_places[i].photos.length>0 && near_places[i].photos.length<=1){
                              mosque.icon = near_places[i].photos[0].getUrl();
                              mosque.photo = near_places[i].photos[0].getUrl();
                            }else{
                              mosque.icon = 'assets/imgs/logo.png';
                              mosque.photo = 'assets/imgs/bg-home.jpg';
                            }
                           
                            mosque.active_events_no = 0;
                            this.nearbyItems.push(mosque);
                          }
                        }
                        let finalNearbyItems = this.nearbyItems_registered.concat(this.nearbyItems);
                        if(finalNearbyItems.length>=10){
                          finalNearbyItems.splice(10);
                        }
                        observer.next(finalNearbyItems);
                        observer.complete();
                      } 
                    }, error => {
                      console.log(error)
                    })
                });
                })
            }
            },error=>{
              console.log(error);
              observer.error();
            })
        });
      });
      
    }).catch((error: any) => Observable.throw(error.json().error || 'Get Google Mosque list error'));;
    
  }

  findRegisteredMosqueId(google_place_id, registerdMosque){
    let i;
    for(i=0; i<registerdMosque.length; i++) {
        if (registerdMosque[i].google_place_id == google_place_id) {
            return i;
        }
    }
    return -1;
  }

  public async setUserLocation(){
    let options = {
      maximumAge: 3000,
      enableHighAccuracy: true,
      timeout: 50000
    };
    return await this.geoLoc.getCurrentPosition(options).then((position) => {
        this.usersLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log ('Current location lat: '+this.usersLocation.lat, ', lng: ' + this.usersLocation.lng);
 
      });

  }

  applyHaversineMultipleLoc(locations){
    locations.map((location) => {
      location = this.applyHaversine(location);
    });

    return locations;
  }

  applyHaversine(location){
    let placeLocation = {
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude)
    };
    location.distance = this.getDistanceBetweenPoints(
        this.usersLocation,
        placeLocation,
        'km'
    ).toFixed(2);
    console.log('location.mosqueAddress= '+location.mosqueAddress);
    return location;
  }


  getDistanceBetweenPoints(start, end, units){

      let earthRadius = {
          miles: 3958.8,
          km: 6371
      };

      let R = earthRadius[units || 'km'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      return d;

  }

  toRad(x){
      return x * Math.PI / 180;
  }

  geocodePlaceId(placeId):Observable<any>{
    return Observable.create(observer =>{
      this.geocoder.geocode({'placeId': placeId}, function(results, status:any) {
        if (status === 'OK') {
          if (results[0]) {
            observer.next(results[0].geometry.location);
            observer.complete();
          } else {
            window.alert('No results found');
            observer.complete();
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }
}