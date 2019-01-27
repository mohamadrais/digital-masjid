import { Injectable } from '@angular/core';
import { AppConstants } from '../constants/app-constants';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/User';
import { Events } from '../models/Events';
import { FeedBack } from '../models/FeedBack';
import { Mosques } from '../models/Mosques';

@Injectable()
export class HttpService {
    //private BASE_URL:string = "http://159.65.140.100:8686/"; 
    private BASE_URL:string = "http://159.65.140.100:8080/";

    constructor(public http: Http) {

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

    public getRegisteredMosques(mosqueIds: Array<String>): Observable<any> {
        var data = mosqueIds;

        return this.http.post(this.BASE_URL + "mosques/getregisteredmosques", data)
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

    public createEvent(event: Events): Observable<Events> {

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

    public updateEvent(event: Events, isEventDateModified: boolean): Observable<any> {

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

    public cancelEvent(event: Events): Observable<any> {

        var data = {
            "eventId": event._id,
            "event_title": event.event_title
        }
        console.log(JSON.stringify(data));
        return this.http.post(this.BASE_URL + "events/cancelevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEvents(): Observable<Events[]> {
        var data = {

        }

        return this.http.get(this.BASE_URL + "events/findevents", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEventDetailsById(id): Observable<Events> {
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

    public findEventsForUser(id, userType, eventEndType): Observable<Events[]> {
        var data = {
            "_id": id,
            "userType": userType,
            "eventEndType": eventEndType
        }

        return this.http.post(this.BASE_URL + "events/findEventsForUser", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public findEventsByMosque(google_place_id: string): Observable<Events[]> {
        var data = {
            "google_place_id": google_place_id
        }

        return this.http.post(this.BASE_URL + "events/findeventsbymosque", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public subscribeEvents(event: Events, userid: string): Observable<Event[]> {
        var data = {
            "id": event._id,
            "userid": userid
        }

        return this.http.post(this.BASE_URL + "events/subscribeevent", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public unSubscribeEvents(event: Events, userid: string): Observable<Event[]> {
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

    public registerUser(user: User): Observable<any> {
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
            "preferredMosque": user.preferredMosque,
            "createdTimestamp": user.createdTimestamp,
            "updatedTimestamp": user.updatedTimestamp,
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
                "preferredMosque": user.preferredMosque
            };
        } else {
            data = {
                "_id": user._id,
                "name": user.name,
                "nickname": user.nickname,
                "gender": user.gender,
                "mobile": user.mobile,
                "preferredMosque": user.preferredMosque
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

    public checkKhairatExist(icnumber: String, khairatMosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "icnumber": icnumber,
            "khairatMosqueGooglePlaceId": khairatMosqueGooglePlaceId
        };
        return this.http.post(this.BASE_URL + "khairatusers/checkexists", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getKhairatDetails(userId: String, khairatMosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "userId": userId,
            "khairatMosqueGooglePlaceId": khairatMosqueGooglePlaceId
        };
        return this.http.post(this.BASE_URL + "khairatusers/getkhairatdetails", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getKhairatApprovals(userId: String, khairatMosqueGooglePlaceId: String): Observable<any> {
        var data = {
            "userId": userId,
            "khairatMosqueGooglePlaceId": khairatMosqueGooglePlaceId
        };
        return this.http.post(this.BASE_URL + "khairatusers/getkhairatapprovals", data)
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

    public findEventsManagedByAdmin(mosquesManaged: Array<String>): Observable<Events[]> {
        var data = {
            "mosquesManaged": mosquesManaged
        }

        return this.http.post(this.BASE_URL + "events/findeventsmanagedbyadmin", data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}