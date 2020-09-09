import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TravelDetailsService {

    getList(): Observable<any> {
        return of(DATA);
    }

    delete(id: number): Observable<any> {
        const d = DATA.findIndex(_ => _.id === id);
        DATA.splice(d, 1);
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const data = DATA.find(_ => _.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const d = DATA.find(_ => _.id === body.id);
            const i = DATA.findIndex(_ => _.id === body.id);
            DATA[i] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            const d = DATA.find(_ => _.id === body.id);
            DATA.push(body);
            body.id = DATA.length + 1;
            body.sn = DATA.length + 1;
            return of(body);
        }
    }
}

let DATA = [
    {
        id: 1,
        sn: 0,
        empCode: 'ASD-122',
        name: 'RAM',
        travelMode: 'Mode A',
        place: 'Kathmandu',
        dateFrom: '2020',
        dateTo: '2025',
        description: 'asasd asdkasd ',
        status: 'Active'
    },
];
