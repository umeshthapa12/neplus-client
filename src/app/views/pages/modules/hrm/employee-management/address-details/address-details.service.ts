import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable()
export class AddressDetailsService {
    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const i = DATA.find(_ => _.id === id);
        return of(i);
    }

    delete(id: number): Observable<any> {
        const i = DATA.findIndex(_ => _.id === id);
        DATA.splice(i, 1);
        return of(DATA);
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
        currentCity: 'Kathmandu',
        currentCountry: 'Nepal',
        currentDistrict: 'Kathmandu',
        currentHouseNo: '12-231-88',
        currentStreet: 'Kalanki',
        currentWardNo: '6',
        currentZone: 'Bagmati',
        empCode: 'EMP-123',
        id: 1,
        sn: 1,
        permanentCity: 'Kathmandu',
        permanentCountry: 'Nepal',
        permanentDistrict: 'Kathmandu',
        permanentHouseNo: '55-223-266',
        permanentStreet: 'Koteshwor',
        permanentWardNo: '5',
        permanentZone: 'Bagmati',
        status: 'Active'
    }
];


