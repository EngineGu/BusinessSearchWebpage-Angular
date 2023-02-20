export interface Geocode {
    latitude: number;
    longitude: number;
}

export interface Business {
    id: string;
    image_url: string;
    name: string;
    rating: number;
    distance: number
}

export interface Detail {
    name: string;
    status: string;
    category: string;
    address: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    phoneNumber: string;
    price:string;
    moreInfoLink:string;
    photoLinks:string[];
    twitterLink:string;
    facebookLink:string;
}

export interface Review {
    rating:number;
    text:string;
    time_created:string;
    username:string;
}

export interface IpInfo {
    city: string;
    country: string;
    hostname: string;
    ip: string;
    loc: string;
    org: string;
    postal: string;
    region: string;
    timezone: string;
}

export interface Reservation {
    id:string,
    name:string,
    date:string,
    time:string,
    email:string,
}