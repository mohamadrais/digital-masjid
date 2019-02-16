export class KariahUser {
    _id: string;
    userId: string;
    kariahUserFullName: string;
    kariahUserIcnumber: string;
    addressLine1: string;
    addressLine2: string;
    postCode: string;
    kariah: string; // mosque name
    maritalStatus: string;
    occupation:    string;
    kariahMosqueGooglePlaceId: string; // mosque google place id
    heirs: Array<{
        h_fullName: string, 
        h_icnumber: string, 
        h_relation: string
    }>;
    billImage: string;
    approvalStatus: string;
    approvalComment: string;
    approvalBy: string;
}