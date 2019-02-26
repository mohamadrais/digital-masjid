import { Injectable } from '@angular/core';
import { AppConstants } from '../constants/app-constants';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/User';
import { MosqueEvent } from '../models/MosqueEvents';
import { FeedBack } from '../models/FeedBack';
import { Mosques } from '../models/Mosques';
import { KariahUser } from '../models/KariahUser'
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class HttpService {
    //private BASE_URL:string = "http://159.65.140.100:8686/";
    private BASE_URL:string = "http://159.65.140.100:8080/";
    
    private fileTransfer: FileTransferObject;

    constructor(public http: Http, private transfer: FileTransfer, private file: File, private iab: InAppBrowser) {

    }

    public authenticateUser(username: string, password: string): Observable<User> {
        var data = {
            "username": username,
            "password": password
        }

        return this.http.post(this.BASE_URL + "users/authenticate", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getPreferredMosque(email: string): Observable<any> {
        var data = {
            "email": email
        }

        return this.http.post(this.BASE_URL + "users/getpreferredmosque", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getRegisteredMosquesById(mosqueIds: Array<String>): Observable<any> {
        var data = {
            "google_place_ids": mosqueIds
        };

        return this.http.post(this.BASE_URL + "mosques/getRegisteredMosquesById", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getUstazList(input: string): Observable<any> {
        var data = {
            "name": input
        }

        return this.http.post(this.BASE_URL + "users/findmoderator", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getManagedMosquesList(input: string, email: string): Observable<any> {
        var data = {
            "email": email,
            "title": input
        }

        return this.http.post(this.BASE_URL + "users/getmanagedmosques", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public createEvent(event: MosqueEvent): Observable<MosqueEvent> {

        var data = {
            "users": [],
            "event_title": event.event_title,
            "category": event.category,
            "moderators": event.ustaz,
            "points": event.points,
            "quota": event.quota,
            "createdTimestamp": event.createdTimestamp,
            "created_by": event.created_by,
            "event_end_date": event.event_end_date,
            "event_start_date": event.event_start_date,
            "address": event.address,
            "event_description": event.event_description
        }
        console.log(JSON.stringify(data));
        return this.http.post(this.BASE_URL + "events/addevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateEvent(event: MosqueEvent, isEventDateModified: boolean): Observable<any> {

        var data = {
            "_id": event._id,
            "event_title": event.event_title,
            "category": event.category,
            "moderators": event.ustaz,
            "points": event.points,
            "quota": event.quota,
            "event_end_date": event.event_end_date,
            "event_start_date": event.event_start_date,
            "address": event.address,
            "event_description": event.event_description,
            "isEventDateModified": isEventDateModified
        }
        console.log(JSON.stringify(data));
        return this.http.post(this.BASE_URL + "events/updateevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public cancelEvent(event: MosqueEvent): Observable<any> {

        var data = {
            "_id" : event._id,
            "event_title": event.event_title,
            "event_start_date" : event.event_start_date,
            "event_end_date" : event.event_end_date
        }
        console.log(JSON.stringify(data));
        return this.http.post(this.BASE_URL + "events/cancelevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEvents(): Observable<MosqueEvent[]> {
        var data = {

        }

        return this.http.get(this.BASE_URL + "events/findevents", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEventDetailsById(id): Observable<MosqueEvent> {
        var data = {
            "id": id
        }

        return this.http.post(this.BASE_URL + "events/findeventdetailsbyid", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public countMaleParticipants(id): Observable<any> {
        var data = {
            "_id": id
        }

        return this.http.post(this.BASE_URL + "events/countmaleparticipants", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEventsForUser(id, userType, eventEndType): Observable<MosqueEvent[]> {
        var data = {
            "_id": id,
            "userType": userType,
            "eventEndType": eventEndType
        }

        return this.http.post(this.BASE_URL + "events/findEventsForUser", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEventsByMosque(google_place_id: string): Observable<MosqueEvent[]> {
        var data = {
            "google_place_id": google_place_id
        }

        return this.http.post(this.BASE_URL + "events/findeventsbymosque", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public subscribeEvents(event: MosqueEvent, userid: string): Observable<Event[]> {
        var data = {
            "id": event._id,
            "userid": userid
        }

        return this.http.post(this.BASE_URL + "events/subscribeevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public unSubscribeEvents(event: MosqueEvent, userid: string): Observable<Event[]> {
        var data = {
            "id": event._id,
            "userid": userid
        }

        return this.http.post(this.BASE_URL + "events/unsubscribeevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public bookmarkEvent(userId: string, eventId: string): Observable<any> {
        var data = {
            "userId": userId,
            "eventId": eventId
        }

        return this.http.post(this.BASE_URL + "users/bookmarkevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public unBookmarkEvent(userId: string, eventId: string): Observable<any> {
        var data = {
            "userId": userId,
            "eventId": eventId
        }

        return this.http.post(this.BASE_URL + "users/unbookmarkevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public bookmarkList(userId: string): Observable<any> {
        var data = {
            "userId": userId
        }

        return this.http.post(this.BASE_URL + "users/getbookmarkedevents", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public registerUser(user: User, deviceInfo: any): Observable<any> {
        var data = {
            "active": user.active,
            "email": user.email,
            "name": user.name,
            "nickname": user.nickname,
            "password": user.password,
            "icnumber": user.icnumber,
            "gender": user.gender,
            "mobile": user.mobile,
            "userType": user.userType,
            "dob": user.dob,
            "preferredMosque": user.preferredMosque,
            "createdTimestamp": user.createdTimestamp,
            "updatedTimestamp": user.updatedTimestamp,
            "deviceInfo": deviceInfo
        };

        return this.http.post(this.BASE_URL + "users/register", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateUser(user: User): Observable<any> {
        var data;
        if (user.password && user.password.length > 0) {
            data = {
                "_id": user._id,
                "name": user.name,
                "nickname": user.nickname,
                "password": user.password,
                "gender": user.gender,
                "mobile": user.mobile,
                "preferredMosque": user.preferredMosque,
                "dob": user.dob
            };
        } else {
            data = {
                "_id": user._id,
                "name": user.name,
                "nickname": user.nickname,
                "gender": user.gender,
                "mobile": user.mobile,
                "preferredMosque": user.preferredMosque,
                "dob": user.dob
            };
        }

        return this.http.post(this.BASE_URL + "users/update", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public feedBack(feedBack: FeedBack): Observable<FeedBack> {
        var data = {
            "category": feedBack.category,
            "page": feedBack.page,
            "suggestion": feedBack.suggestion,
            "userid": feedBack.userid,
            "createdTimestamp": feedBack.createdTimestamp
        };

        return this.http.post(this.BASE_URL + "feedback", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findMosques(): Observable<Mosques[]> {
        var data = {
            // "mosque_title": mosque.mosque_title,
            // "latitude": mosque.latitude,
            // "longitude": mosque.longitude,
            // "mosque_address": mosque.mosque_address,
            // "active_events_no": mosque.active_events_no,
            // "createdTimestamp": mosque.createdTimestamp,
            // "created_by": mosque.created_by
        }
        return this.http.get(this.BASE_URL + "", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    public countActiveEvents(google_place_id): Observable<any> {
        var data = {
            "google_place_id": google_place_id
        };

        return this.http.post(this.BASE_URL + "events/countactiveevents", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

    public addRating(userId: String, moderatorId: String, rating: number): Observable<any> {
        var data = {
            "userId": userId,
            "moderatorId": moderatorId,
            "rating": rating
        }
        return this.http.post(this.BASE_URL + "ratings/addrating", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateRating(userId: String, moderatorId: String, rating: number): Observable<any> {
        var data = {
            "userId": userId,
            "moderatorId": moderatorId,
            "rating": rating
        }
        return this.http.post(this.BASE_URL + "ratings/updaterating", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getRatingByUser(userId: String, moderatorId: String): Observable<any> {
        var data = {
            "userId": userId,
            "moderatorId": moderatorId
        }
        return this.http.post(this.BASE_URL + "ratings/getratingbyuser", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getAvgRating(moderatorId: String): Observable<any> {
        var data = {
            "moderatorId": moderatorId
        }
        return this.http.post(this.BASE_URL + "ratings/getavgrating", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findUser(id: String): Observable<User> {
        var data = {
            "id": id
        }
        return this.http.post(this.BASE_URL + "users/finduser", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public forgotPassword(email: String): Observable<any> {
        var data = {
            "email": email
        };
        return this.http.post(this.BASE_URL + "users/forgot", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public verifyToken(token: String, email: String): Observable<any> {
        var data = {
            "token": token,
            "email": email
        };
        return this.http.post(this.BASE_URL + "users/verify", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public verifyEmail(email: String): Observable<any> {
        var data = {
            "email": email
        };
        return this.http.post(this.BASE_URL + "users/verifyEmail", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public verifyEmailToken(token: String, email: String): Observable<any> {
        var data = {
            "token": token,
            "email": email
        };
        return this.http.post(this.BASE_URL + "users/verifyEmailToken", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public checkEmailExists(email: String): Observable<any> {
        var data = {
            "email": email
        };
        return this.http.post(this.BASE_URL + "users/checkEmailExists", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public resetPassword(email: String, code: String, resetPassword: String, ): Observable<any> {
        var data = {
            "email": email,
            "token": code,
            "password": resetPassword
        };
        return this.http.post(this.BASE_URL + "users/reset", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public checkKariahExist(icnumber: String, kariahMosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "icnumber": icnumber,
            "kariahMosqueGooglePlaceId": kariahMosqueGooglePlaceId
        };
        return this.http.post(this.BASE_URL + "kariahusers/checkexists", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getKariahDetails(userId: String, kariahMosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "userId": userId,
            "kariahMosqueGooglePlaceId": kariahMosqueGooglePlaceId
        };
        return this.http.post(this.BASE_URL + "kariahusers/getkariahdetails", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getKariahApprovals(userId: String, kariahMosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "userId": userId,
            "kariahMosqueGooglePlaceId": kariahMosqueGooglePlaceId
        };
        return this.http.post(this.BASE_URL + "kariahusers/getkariahapprovals", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public userAddPoints(userId: String, points: String, eventId: String): Observable<any> {
        var data = {
            "userId": userId,
            "points": points,
            "eventId": eventId
        };
        return this.http.post(this.BASE_URL + "users/addpoints", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getEventsToAttend(userId: String): Observable<any> {
        var data = {
            "userId": userId
        };
        return this.http.post(this.BASE_URL + "events/geteventstoattend", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getParticipantsList(eventId: String): Observable<any> {
        var data = {
            "eventId": eventId
        }

        return this.http.post(this.BASE_URL + "events/getparticipantslist", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEventsManagedByAdmin(mosquesManaged: Array<String>): Observable<MosqueEvent[]> {
        var data = {
            "mosquesManaged": mosquesManaged
        }

        return this.http.post(this.BASE_URL + "events/findeventsmanagedbyadmin", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public sendPushToken(pushToken: String, deviceInfo: any, userId: String, userMobile: string): Observable<MosqueEvent[]> {
        var data = {
            "pushToken": pushToken,
            "deviceInfo": deviceInfo,
            "userId": userId,
            "userMobile": userMobile
        };

        return this.http.post(this.BASE_URL + "users/updatePushToken", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public logoutUser(deviceInfo: any, userId: String): Observable<MosqueEvent[]> {
        var data = {
            "deviceInfo": deviceInfo,
            "userId": userId
        };

        return this.http.post(this.BASE_URL + "users/logout", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public registerKariahUser(newKariahUser: KariahUser): Observable<any> {
        var data = {
            "userId": newKariahUser.userId,
            "kariahUserFullName": newKariahUser.kariahUserFullName,
            "kariahUserIcnumber": newKariahUser.kariahUserIcnumber,
            "addressLine1": newKariahUser.addressLine1,
            "addressLine2": newKariahUser.addressLine2,
            "postCode": newKariahUser.postCode,
            "kariah": newKariahUser.kariah,
            "maritalStatus": newKariahUser.maritalStatus,
            "occupation": newKariahUser.occupation,
            "kariahMosqueGooglePlaceId": newKariahUser.kariahMosqueGooglePlaceId,
            "heirs": newKariahUser.heirs,
            "billImage": newKariahUser.billImage
        };

        return this.http.post(this.BASE_URL + "kariahusers/register", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateKariahUser(kariahUser: KariahUser, updateFrom: string): Observable<any> {
        var data = {
            "kariahId": kariahUser._id,
            "userId": kariahUser.userId,
            "kariahUserFullName": kariahUser.kariahUserFullName,
            "kariahUserIcnumber": kariahUser.kariahUserIcnumber,
            "addressLine1": kariahUser.addressLine1,
            "addressLine2": kariahUser.addressLine2,
            "postCode": kariahUser.postCode,
            "kariah": kariahUser.kariah,
            "maritalStatus": kariahUser.maritalStatus,
            "occupation": kariahUser.occupation,
            "kariahMosqueGooglePlaceId": kariahUser.kariahMosqueGooglePlaceId,
            "heirs": kariahUser.heirs,
            "billImage": kariahUser.billImage,
            "updateFrom": updateFrom
        };

        return this.http.post(this.BASE_URL + "kariahusers/update", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public notificationFindByUser(userId: String): Observable<any> {
        var data = {
            "userId": userId
        }
        return this.http.post(this.BASE_URL + "notif/findByUser", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public notificationReadUserNotification(userId: String, notificationId: String): Observable<any> {
        var data = {
            "userId": userId,
            "notificationId": notificationId
        }
        return this.http.post(this.BASE_URL + "notif/markReadUn", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public addMosqueRating(userId: String, mosqueGooglePlaceId: String, rating: number): Observable<any> {
        var data = {
            "userId": userId,
            "mosqueGooglePlaceId": mosqueGooglePlaceId,
            "rating": rating
        }
        return this.http.post(this.BASE_URL + "ratings/addMosqueRating", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateMosqueRating(userId: String, mosqueGooglePlaceId: String, rating: number): Observable<any> {
        var data = {
            "userId": userId,
            "mosqueGooglePlaceId": mosqueGooglePlaceId,
            "rating": rating
        }
        return this.http.post(this.BASE_URL + "ratings/updateMosqueRating", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMosqueRatingByUser(userId: String, mosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "userId": userId,
            "mosqueGooglePlaceId": mosqueGooglePlaceId
        }
        return this.http.post(this.BASE_URL + "ratings/getMosqueRatingByUser", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMosqueAvgRating(mosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "mosqueGooglePlaceId": mosqueGooglePlaceId
        }
        return this.http.post(this.BASE_URL + "ratings/getMosqueAvgRating", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findMosque(mosqueGooglePlaceId: String): Observable<Mosques> {
        var data = {
            "mosqueGooglePlaceId": mosqueGooglePlaceId
        }
        return this.http.post(this.BASE_URL + "mosques/findMosque", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public downloadKariahMemberList(adminId: String) {
        let url = this.BASE_URL + "kariahusers/memberList/" + adminId;
        this.iab.create(url, '_system');

    }

    public downloadParticipantList(eventId: String) {
        let url = this.BASE_URL + "events/participantsList/" + eventId;
        this.iab.create(url, '_system');
    }

    public downloadAttendanceList(eventId: String) {
        let url = this.BASE_URL + "events/attendanceList/" + eventId;
        this.iab.create(url, '_system');
    }

    public getKariahUsersByAdminIdList(adminId: String): Observable<any> {
        var data = {
            "adminId": adminId
        }
        return this.http.post(this.BASE_URL + "kariahusers/getKariahUsersByAdminId", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public updateKariahStatusByAdmin(updateFrom: string, kariahId: String, userId: String, kariah: String, approvalStatus: String, approvalComment: String, approvalBy: String): Observable<any> {
        var data = {
            "updateFrom": updateFrom, // should be current userType (ADMIN)
            "kariahId": kariahId, // kariah objectId from db
            "userId": userId, // userId for which kariah application is registered for
            "kariah": kariah, // name of the mosque (kariah)
            "approvalStatus": approvalStatus, // "Approved", "Rejected", "Pending"
            "approvalComment": approvalComment, // required if Rejected
            "approvalBy": approvalBy // should be current userId (ADMIN)
        }
        return this.http.post(this.BASE_URL + "kariahusers/update", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }




    /*
    public downloadKariahMemberList2(adminId: String): Observable<any> {
        
        return this.http.get(this.BASE_URL + "kariahusers/memberList/"+adminId)
            .map((res: Response) => {
                console.log("res from download");
                console.log(JSON.stringify(res));
            })
            .catch((error: any) => Observable.throw(error.text().error || 'Server error'));
    }

    public downloadKariahMemberList3(adminId) {  
        let url = encodeURI(this.BASE_URL + "kariahusers/memberList/"+adminId);  
        let fileName = "kariah-member-list.csv";
        this.fileTransfer = this.transfer.create();
        console.log("url: " + url);
        console.log("fileName: " + fileName);
        console.log("filePath: " + this.file.externalRootDirectory + fileName);
        
        
        this.fileTransfer.download(url, this.file.externalRootDirectory + fileName, true).then((entry) => {  
            console.log('download completed: ' + entry.toURL());  
        }, (error) => {  
            console.log('download failed: ' + JSON.stringify(error));  
        });  
    } 

    public downloadParticipantList2(eventId: String): Observable<any> {
        var data = {
            "eventId": eventId
        }
        return this.http.post(this.BASE_URL + "events/participantsList", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public downloadAttendanceList2(eventId: String): Observable<any> {
        var data = {
            "eventId": eventId
        }
        return this.http.post(this.BASE_URL + "events/attendanceList", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    */
}