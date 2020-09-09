import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NomineeInformationService {

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
            const data = List.findIndex(_ => _.id === body.id);
            const d = List.find(_ => _.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            List.push(body);
            body.sn = List.length + 1;
            body.id = List.length + 1;
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(_ => _.id === id);
        List.splice(index, 1);
        return of(List);
    }

}


let List = [

    {
        id: 1,
        sn: 1,
        empCode: 'E3954',
        name: 'John',
        permanentAddress: 'Butwal, Rupendehi Nepal',
        currentAddress: 'Kathmandu, Nepal',
        relation: 'Helper',
        age: '29',
        mobileNumber: '9845673892',
        status: 'Active'
    },

    {
        id: 2,
        sn: 2,
        empCode: 'E3754',
        name: 'Jenny',
        permanentAddress: 'Dhangadhi Nepal',
        currentAddress: 'Lalitpur, Nepal',
        relation: 'Helper',
        age: '28',
        mobileNumber: '9845676792',
        status: 'Inactive'
    }
];
