import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PassportDetailsService {

    constructor() { }
    getList(): Observable<any> {
        return of (List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of (data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of (body);
        } else {
            List.push(body);
            body.sn = List.length + 1;
            body.id = List.length + 1;
            return of (body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index , 1);
        return of (List);
    }

}

let List = [
    {
        id: 1,
        sn: 1,
        empCode: 'e200',
        passportNo: '239076474',
        passportIssuedPlace: 'Nepal',
        passportExpireDate: '2080/03/76',
        visaDetails: 'This is ......',
        visaExpireDate: '2080/06/09',
        visaIssueDate: '2080/07/09',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'e289',
        passportNo: '239088474',
        passportIssuedPlace: 'Nepal',
        passportExpireDate: '2080/03/76',
        visaDetails: 'This is ......',
        visaExpireDate: '2080/06/09',
        visaIssuedDate: '2080/07/09',
        status: 'Inactive',
    },
];
