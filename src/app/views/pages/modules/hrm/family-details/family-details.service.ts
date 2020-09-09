import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FamilyDetailsService {

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
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.sn = d.sn;
            body.id = d.id;
            return of(body);
        } else {
            List.push(body);
            body.sn = List.length + 1;
            body.id = List.length + 1;
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
        id: 1,
        sn: 1,
        empCode: 'e200',
        name: 'Sonny',
        nameNepali: 'Sonny',
        relation: 'Father',
        occupation: 'Agriculter',
        phoneNumber: '079646749',
        mobileNumber: '9876890567',
        dateOfBirth: '1995/01/12',
        dateOfBirthNepali: '2050/10/23',
        description: 'He is the family memnber of  the .....',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'E-600',
        name: 'Jagat',
        nameNepali: 'Jagat',
        relation: 'Brother',
        occupation: 'Teacher',
        phoneNumber: '079646749',
        mobileNumber: '9876890567',
        dateOfBirth: '1995/01/12',
        dateOfBirthNepali: '2050/10/23',
        description: 'He is the family memnber of  the .....',
        status: 'Inactive',
    },
];
