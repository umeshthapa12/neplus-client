import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AwardDetailService {

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
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);
    }

}

let List = [
    {
        id: 1,
        sn: 1,
        empCode: 'E-399',
        name: 'For Honesty in Company',
        value: 'Rs.5000',
        date: '2019/12/12',
        dateNepali: '2076/08/23',
        description: 'This is Award given to the employee who is honest in the company .......',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'E-299',
        name: 'Sales Incentives.',
        value: 'Rs.5000',
        date: '2019/12/12',
        dateNepali: '2076/08/23',
        description: 'This is Award given to the employee To motivate for work in the company .......',
        status: 'Active',
    },
]
