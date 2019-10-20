import { Url } from "./MosqueEventsUrl";

export class Mosques {
    _id: string;
    google_place_id: string;
    title: string;
    mosque_url: Array<Url>;
    mosque_email: string;
    latitude: string;
    longitude: string;
    address: string;
    postcode: string;
    city: string;
    state: string;
    active_events_no: number;
    icon: string;//= 'assets/imgs/logo.png';
    photo: string;//= 'assets/imgs/bg-home.jpg';
    createdTimestamp: string;
    created_by: string;
    updatedTimestamp: string;
    updated_by: string;
    isRegistered: boolean = false;
}