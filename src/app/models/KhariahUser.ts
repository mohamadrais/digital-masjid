export class KhariahUser {
    _id: string;
    userId: string;
    khariahUserFullName: string;
    khariahUserIcnumber: string;
    addressLine1: string;
    addressLine2: string;
    postCode: string;
    khariah: string; // mosque name
    maritalStatus: string;
    occupation:    string;
    khairatMosqueGooglePlaceId: string; // mosque google place id
    heirs: Array<{
        h_fullName: string, 
        h_icnumber: string, 
        h_relation: string
    }>;
    billImage: string;
}