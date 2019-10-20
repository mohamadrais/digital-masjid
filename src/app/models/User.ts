import { Url } from "./MosqueEventsUrl";

export class User {
    _id: string;
    email: string;
    name: string;
    nickname: string;
    password: string;
    icnumber: string;
    gender: string;
    mobile: string;
    preferredMosque: string;
    dob: string;
    active: string;
    userType: string;
    avgRating: string; // only for Ustaz to see their overall rating on Home/Profile page
    ratersCount: string; // only for Ustaz to see their overall rating on Home/Profile page
    pointsCollected: string; // only for User to see their remaining points on Profile page
    mosquesManaged: Array<string>; // only for Admin to store their managed mosques
    createdTimestamp: string;
    updatedTimestamp: string;
    eventsBookmarked: Array<string>;
    user_url: Array<Url>; // only for Ustaz to add/edit their URLs on Profile page
    userImage: string; 
}