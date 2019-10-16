import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { Device } from '@ionic-native/device';
import { User } from '../models/User';
import { AppConstants } from '../constants/app-constants';
import { KariahUser } from '../models/KariahUser';
import { Url } from '../models/MosqueEventsUrl';


@Injectable()
export class Globals {
  //Constants
  private readonly APP_USER = "APP_USER";
  private readonly KARIAH_USER = "KARIAH_USER";
  private readonly GENERAL_SETTINGS = "GENERAL_SETTINGS";
  private readonly DATABASE_VERSION = "DATABASE_VERSION";

  public currentUser: User;
  public generalSettings: GeneralSettings;
  public currentDbVersion: number;
  public kariahUser: KariahUser;

  constructor(public storage: Storage, private device: Device) {
    this.currentUser = new User();
    this.generalSettings = new GeneralSettings();
  }


  /**
   * Initilize all global data.
   */
  initGlobals(): Observable<any> {
    return Observable.create(observer => {

      this.storage.get(this.GENERAL_SETTINGS).then((val) => {
        if (val) this.generalSettings = <GeneralSettings>val;
      });

      this.storage.get(this.KARIAH_USER).then((val) => {
        if (val) this.kariahUser = <KariahUser>val;
      });

      this.storage.get(this.APP_USER).then((val) => {
        if (val) this.currentUser = <User>val;
        observer.next(this.currentUser);
        observer.complete();
      });

    });
  }

  initCurrentDbVersion(): Observable<any> {
    return Observable.create(observer => {
      this.storage.get(this.DATABASE_VERSION).then((val) => {
        if (val) this.currentDbVersion = <number>val;
        observer.next(val);
        observer.complete();
      }, error => {
        console.log(error);
        observer.error("Failure");
      });
    })
  }

  /**
   * Persist all global data.
   */
  saveAllGlobals() {
    console.log("Saving all Globals");
    this.storage.set(this.APP_USER, this.currentUser);
    this.storage.set(this.KARIAH_USER, this.kariahUser);
    this.storage.set(this.GENERAL_SETTINGS, this.generalSettings);
    this.storage.set(this.DATABASE_VERSION, this.currentDbVersion);
  }

  setUser(user: User) {
    this.currentUser = <User>user;
    this.storage.set(this.APP_USER, user);
  }

  setKariahUser(kariahUser:KariahUser){
    this.kariahUser = <KariahUser> kariahUser;
    this.storage.set(this.KARIAH_USER, this.kariahUser);
  }

  getKariahUser(){
    return this.kariahUser;
  }

  setCurrentDbVersion(version: number) {
    this.currentDbVersion = version
    this.storage.set(this.DATABASE_VERSION, version);
  }

  /**
   * Clear all global data.
   */
  clearAllGlobals() {
    console.log("Globals.clearAllGlobals");

    this.storage.remove(this.APP_USER);
    this.currentUser = null;
    this.storage.remove(this.KARIAH_USER);
    this.kariahUser = null;

    this.storage.remove(this.GENERAL_SETTINGS);
    this.generalSettings = new GeneralSettings();
  }

  public set(settingName, value) {
    return this.storage.set(settingName, value);
  }
  public async get(settingName) {
    return await this.storage.get(settingName);
  }

  /**
 * Set General Settings
 */
  setGeneralSettings(generalSettings: GeneralSettings) {
    console.log("setting Globals.generalSettings:" + generalSettings);
    this.generalSettings = generalSettings;
    this.storage.set(this.GENERAL_SETTINGS, generalSettings);
  }

  /**
   * Set user id.
   */
  setUserId(_id: string) {
    console.log("setting Globals._id:" + _id);
    this.currentUser._id = _id;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * Get login user first name.
   */
  getUserId() {
    return this.currentUser._id;
  }

  /**
   * Get user object.
   */
  getUser() {
    return this.currentUser;
  }

  /**
   * Set login user name.
   */
  setUserName(name: string) {
    console.log("setting Globals.name:" + name);
    this.currentUser.name = name;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * Get login user name.
   */
  getUserName() {
    return this.currentUser.name;
  }

  /**
   * Set login user email.
   */
  setUserEmail(email: string) {
    console.log("setting Globals.email:" + email);
    this.currentUser.email = email;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * Get login user email.
   */
  getUserEmail() {
    return this.currentUser.email;
  }

  /**
   * Set login user mobile number.
   */
  setUserMobile(mobile: string) {
    console.log("setting Globals.mobile:" + mobile);
    this.currentUser.mobile = mobile;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user mobile number.
   */
  getUserMobile() {
    return this.currentUser.mobile;
  }

  /**
   * Set login user type.
   */
  setUserType(userType: string) {
    console.log("setting Globals.userType:" + userType);
    this.currentUser.userType = userType;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user userType number.
   */
  getUserType() {
    return this.currentUser.userType;
  }

  /**
   * Set login user avg rating for ustaz.
   */
  setUserAvgRating(avgRating: string) {
    console.log("setting Globals.avgRating:" + avgRating);
    this.currentUser.avgRating = avgRating;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user avg rating for ustaz.
   */
  getUserAvgRating() {
    return this.currentUser.avgRating;
  }

  /**
   * Set login user raters count for ustaz.
   */
  setUserRatersCount(ratersCount: string) {
    console.log("setting Globals.ratersCount:" + ratersCount);
    this.currentUser.ratersCount = ratersCount;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user raters count for ustaz.
   */
  getUserRatersCount() {
    return this.currentUser.ratersCount;
  }

  /**
   * Set login user points collected.
   */
  setUserPointsCollected(pointsCollected: string) {
    console.log("setting Globals.pointsCollected:" + pointsCollected);
    this.currentUser.pointsCollected = pointsCollected;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user points collected.
   */
  getUserPointsCollected() {
    return this.currentUser.pointsCollected;
  }

  /**
   * Set login user events bookmarked.
   */
  setUserEventsBookmarked(eventsBookmarked: Array<string>) {
    console.log("setting Globals.eventsBookmarked:" + eventsBookmarked);
    this.currentUser.eventsBookmarked = eventsBookmarked;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user events bookmarked.
   */
  getUserEventsBookmarked() {
    return this.currentUser.eventsBookmarked;
  }

    /**
   * Set login user date of birth.
   */
  setUserDob(dob: string) {
    console.log("setting Globals.dob:" + dob);
    this.currentUser.dob = dob;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user date of birth.
   */
  getUserDob() {
    return this.currentUser.dob;
  }

  /**
   * Set login admin mosques managed.
   */
  setUserMosquesManaged(mosquesManaged: Array<string>) {
    console.log("setting Globals.mosquesManaged:" + mosquesManaged);
    this.currentUser.mosquesManaged = mosquesManaged;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login admin mosques managed.
   */
  getUserMosquesManaged() {
    return this.currentUser.mosquesManaged;
  }

  /**
   * Set login ustaz URLs.
   */
  setUserURL(user_url: Array<Url>) {
    console.log("setting Globals.user_url:" + user_url);
    this.currentUser.user_url = user_url;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login ustaz URLs.
   */
  getUserURL() {
    return this.currentUser.user_url;
  }

  /**
   * Set login user profile image.
   */
  setUserImage(userImage: string) {
    console.log("setting Globals.userImage:" + userImage);
    this.currentUser.userImage = userImage;
    this.storage.set(this.APP_USER, this.currentUser);
  }

  /**
   * get login user profile image.
   */
  getUserImage() {
    return this.currentUser.userImage;
  }

  /**
  * This function will return unique device id
  */
  getDeviceId(): string {
    return this.device.uuid;
  }

  /**
   * This function will return cordova version
   */
  getCordovaVersion(): string {
    return this.device.cordova;
  }

  /**
   * This function will return device model
   */
  getDeviceModel(): string {
    return this.device.model;
  }

  /**
   * Get the device's operating system name.
   */
  getDevicePlatform(): string {
    return this.device.platform;
  }

  /**
   * Check whether Android or not
   */
  isAndroid(): boolean {
    return this.device.platform && this.device.platform == 'Android';
  }

  /**
   * Get the operating system version. 
   */
  getDevicePlatformVersion(): string {
    return this.device.version;
  }

  /**
   * Get the device's manufacturer.
   */
  getDeviceManufacturer(): string {
    return this.device.manufacturer;
  }

  /**
   * Get the push Notification token.
   */
  getPushToken() {
    return this.generalSettings.pushToken;
  }

  /**
   * Set the push Notification token.
   */
  setPushToken(pushToken: string) {
    console.log("setting Globals.pushToken:" + pushToken);
    this.generalSettings.pushToken = pushToken;
    this.storage.set(this.GENERAL_SETTINGS, this.generalSettings);
  }

  /**
  * Set network available.
  */
  setNetworkAvailable(networkAvailable: boolean) {
    console.log("setting Globals.networkAvailable:" + networkAvailable);
    this.generalSettings.networkAvailable = networkAvailable;
  }

  /**
   * Get network available.
   */
  getNetworkAvailable() {
    return this.generalSettings.networkAvailable;
  }

  

  public setDatabaseAvailability(available: boolean): Promise<any> {
    return this.storage.set("DATABASECREATED", available);
  }

  public getDatabaseAvailability(): Promise<any> {
    return this.storage.get("DATABASECREATED");
  }

  getCurrentDbVersion() {
    return this.currentDbVersion;
  }
}


export class GeneralSettings {

  //other data vars
  //periodic sync in milliseconds
  public periodicSyncDelay = 300000; //120000 2min 3600000 5min
  public periodicSyncIntervalFunc: any;
  public dataCleanupDays = 21;
  public timeOutDelay = 15000;

  //device info vars
  public pushToken: string;
  public textDirection: string;
  public networkAvailable: boolean;
  public pushTokenSentFlag: boolean = false;
}