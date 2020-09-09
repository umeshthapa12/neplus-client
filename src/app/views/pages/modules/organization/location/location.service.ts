import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor() { }

    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            List[data] = body;
            body.sn = List[data].sn;
            body.id = List[data].id;
            return of(body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            body.sn = List.length + 1;
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);
    }

}


let List = [
    {
        id: 1, sn: 1, name: 'Kathmandu Nepal', nameNepali: 'Kathmandu Nepal', district: 'Kathmandu', country: 'Nepal',
        description: 'This is  the organization in nepal Which deliver the different types of the product for the daily Life',
        status: 'Active'
    },
    {
        id: 2, sn: 2, name: 'Chitwan, Bypass', nameNepali: 'Chitwan Bypass', district: 'Chitwan', country: 'Nepal',
        description: 'This is  the organization in nepal Which Located in the chitwan district, deliver the different types of the product for the daily Life',
        status: 'Active'
    },
    {
        id: 3, sn: 3, name: 'Butwal Traffic Chwok ', nameNepali: 'Butwal Traffic Chwok', district: 'Rupendehi', country: 'Nepal',
        description: 'This is  the organization in nepal Which is also in butwal',
        status: 'Active'
    },
    {
        id: 4, sn: 4, name: 'Chipledhunga pokhara', nameNepali: 'Chipledhunga pokhara', district: 'Kaski', country: 'Nepal',
        description: 'This is  the organization in nepal Which  branch also in pokhara, deliver the different types of the product for the daily Life',
        status: 'Active'
    },
    {
        id: 5, sn: 5, name: 'Hetauda Bazar', nameNepali: 'Hetauda Bazar', district: 'Makanpur', country: 'Nepal',
        description: 'This is  the organization in nepal Which  branch also in Hetauda, deliver the different types of the product for the daily Life',
        status: 'Active'
    },
];
