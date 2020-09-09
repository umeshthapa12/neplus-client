import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PreviousEmploymentDetailService {

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
        empCode: 'E-450',
        organization: 'Butwal Dhago Karkhana',
        employeeLevel: 'Manager',
        dateFrom: '1990/03/30',
        dateFromNepali: '2048/12/30',
        dateTo: '2000/05/23',
        dateToNepali: '2056/12/12',
        description: 'In this Organization I am Workin in this Ogranization ......',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'E-499',
        organization: 'Chaudari Foundation',
        employeeLevel: 'Employee',
        dateFrom: '1990/03/30',
        dateFromNepali: '2048/12/30',
        dateTo: '2000/05/23',
        dateToNepali: '2056/12/12',
        description: 'In this Organization I am Workin in this Ogranization ......',
        status: 'Inactive',
    },
];
