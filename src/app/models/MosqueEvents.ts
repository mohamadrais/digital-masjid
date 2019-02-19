export class MosqueEvent {
    _id: string;
    event_title: string;
    category: string;
    ustaz: Array<string> = [];
    address: string;
    mosque_details: Array<any> = [];
    moderator_details: Array<any> = [];
    points: number = 0;
    quota: number = 0;
    users: Array<string> = [];
    userCount: number = 0;
    maleCount: number = 0;
    femaleCount: number = 0;
    event_start_date: string;
    event_end_date: string;
    createdTimestamp: string;
    updatedTimestamp: string;
    currentTimestamp: string;
    created_by: string;
    event_description:string;
    event_status:string;

    //as header seperator
    event_header=''
}