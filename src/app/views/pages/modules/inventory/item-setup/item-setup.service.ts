import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ItemSetupService {

    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        let data = DATA.find(_ => _.id === id);
        return of(data);
    }

    deleteList(id: number): Observable<any> {
        let i = DATA.findIndex(_ => _.id === id);
        DATA.splice(i, 1);
        return of(DATA);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            let data = DATA.find(_ => _.id === body.id);
            let index = DATA.findIndex(_ => _.id === body.id);
            DATA[index] = body;
            body.id = data.sn;
            body.sn = data.sn;
            return of(body);
        } else {
            let value = DATA.find(_ => _.id === body.id);
            DATA.push(value);
            body.id = DATA.length + 1;
            body.sn = DATA.length + 1;
            return of(body);
        }
    }

    update(body: any): Observable<any> {
            const eValue = DATA.findIndex(x => x.id === body.id);
            body.sn = DATA[eValue].sn;
            DATA[eValue] = body;
            return of(body);
    }

    add(formData: any): Observable<any> {
        DATA.push();
        formData.id = DATA.length + 1;
        formData.sn = DATA.length + 1;
        return of(formData);
    }
}

const DATA: any = [
    {
        id: 9,
        sn: 1,
        itemCode: 'YCX-12',
        itemName: 'Machine',
        groupName: 'Stationery',
        unitName: 'Unit XQM',
        purchaseRate: '1291',
        minStockQty: 109,
        remarks: 'Fine'
    },
    {
        id: 19,
        sn: 2,
        itemCode: 'VNY-23',
        itemName: 'Computer',
        groupName: 'Stamp Print',
        unitName: 'Unit XQM',
        purchaseRate: '50000',
        minStockQty: 429,
        remarks: 'Fine'
    },
    {
        id: 94,
        sn: 3,
        itemCode: 'PAE-31',
        itemName: 'Other',
        groupName: 'Cheque',
        unitName: 'Unit XQM',
        purchaseRate: '1241',
        minStockQty: 513,
        remarks: 'Fine'
    },
    {
        id: 23,
        sn: 4,
        itemCode: 'ZMX-15',
        itemName: 'Computer',
        groupName: 'Printing',
        unitName: 'Unit OAR',
        purchaseRate: '50000',
        minStockQty: 429,
        remarks: 'Fine'
    }
];
