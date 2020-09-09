import { Injectable } from '@angular/core';
import { Observable, of, range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable()
export class PurchaseRecordService {

    constructor() {
        const data = JSON.parse(localStorage.getItem('d'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('d', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    transactionDate: '2020',
                    storeName: ['ASF Store'],
                    supplierName: ['ABC store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '298347354',
                    discount: '1234',
                    taxableAmount: '9876',
                    taxAmount: '32456',
                    totalAmount: '234'
                },
                {
                    id: 2,
                    sn: 2,
                    transactionDate: '2019',
                    storeName: ['WASOO Store'],
                    supplierName: ['OASD store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '68465',
                    discount: '8652',
                    taxableAmount: '9852',
                    taxAmount: '32456',
                    totalAmount: '545575'
                },
                {
                    id: 3,
                    sn: 3,
                    transactionDate: '2018',
                    storeName: ['ASF Store'],
                    supplierName: ['ABC store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '298347354',
                    discount: '1234',
                    taxableAmount: '9876',
                    taxAmount: '32456',
                    totalAmount: '234'
                },
                {
                    id: 4,
                    sn: 4,
                    transactionDate: '2017',
                    storeName: ['ASF Store'],
                    supplierName: ['ABC store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '298347354',
                    discount: '1234',
                    taxableAmount: '9876',
                    taxAmount: '32456',
                    totalAmount: '234'
                },
            ]));
        } else if (data === null) {
            localStorage.setItem('d', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    transactionDate: '2020',
                    storeName: ['ASF Store'],
                    supplierName: ['ABC store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '298347354',
                    discount: '1234',
                    taxableAmount: '9876',
                    taxAmount: '32456',
                    totalAmount: '234'
                },
                {
                    id: 2,
                    sn: 2,
                    transactionDate: '2019',
                    storeName: ['WASOO Store'],
                    supplierName: ['OASD store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '68465',
                    discount: '8652',
                    taxableAmount: '9852',
                    taxAmount: '32456',
                    totalAmount: '545575'
                },
                {
                    id: 3,
                    sn: 3,
                    transactionDate: '2018',
                    storeName: ['ASF Store'],
                    supplierName: ['ABC store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '298347354',
                    discount: '1234',
                    taxableAmount: '9876',
                    taxAmount: '32456',
                    totalAmount: '234'
                },
                {
                    id: 4,
                    sn: 4,
                    transactionDate: '2017',
                    storeName: ['ASF Store'],
                    supplierName: ['ABC store'],
                    purchaseBillDate: '2020',
                    purchaseBillNo: '12345',
                    itemTotalAmount: '298347354',
                    discount: '1234',
                    taxableAmount: '9876',
                    taxAmount: '32456',
                    totalAmount: '234'
                },
            ]));
        }
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        return of(data);
    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('d'));
        const e = d.find(_ => _.id === id);
        return of(e);
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        const i = data.findIndex(_ => _.id === id);
        data.splice(i, 1);
        localStorage.setItem('d', JSON.stringify(data));
        return of(data);
    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('d'));
        const eValue = d.findIndex(x => x.id === body.id);
        body.sn = d[eValue].sn;
        d[eValue] = body;
        localStorage.setItem('d', JSON.stringify(d));
        return of(body);
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        data.push(body);
        body.id = data.length + 1;
        body.sn = data.length + 1;
        localStorage.setItem('d', JSON.stringify(data));
        return of(body);
    }

    deleteSelected(a: any[]): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        a.forEach(item => {
            let index: number = data.findIndex(d => d === item);
            data.splice(index, 1);
            localStorage.setItem('d', JSON.stringify(data));
        });
        return of(data);
    }

}
