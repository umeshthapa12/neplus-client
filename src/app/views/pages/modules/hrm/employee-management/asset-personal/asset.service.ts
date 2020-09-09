import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable()
export class AssetService {

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
            return of(body);
        } else {
            const d = DATA.find(_ => _.id === body.id);
            DATA.push(body);
            body.id = DATA.length + 1;
            return of(body);
        }
    }
}

let DATA = [
    {
        assetDate: 'Tue May 26 2020 00:00:00 GMT+0545',
        assetName: 'Furniture',
        costValue: '10000',
        currentValue: '5000',
        description: 'fine',
        empCode: 'EMP--324',
        fiscalYear: '77/78',
        id: 2,
        ownerName: 'Ram',
        quantity: '5',
        sourceOfIncome: 'Business',
        status: 'Active',
    }

];


