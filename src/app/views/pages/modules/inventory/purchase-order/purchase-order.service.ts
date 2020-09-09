import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class PurchaseOrderService {



    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        let d = DATA.find(_ => _.id === id);
        return of(d);
    }

    deleteList(id: number): Observable<any> {
        let index = DATA.findIndex(_ => _.id === id);
        DATA.splice(index, 1);
        return of(DATA);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            let index = DATA.findIndex(_ => _.id === body.id);
            let data = DATA.find(_ => _.id === body.id);
            body.id = data.id;
            body.sn = data.sn;
            DATA[index] = body;
            return of(body);
        } else {
            body.id = DATA.length + 1;
            body.id = DATA.length + 1;
            DATA.push(body);
            return of(body);
        }
    }

}


let DATA = [
    {
        id: 9,
        sn: 1,
        storeName: 'Store Name 1',
        supplierName: 'Supplier Name',
        transactionDate: 'Transaction Date',
        deliveryDate: 'Delivery Date',
        orderStatus: 'Active',
        totalAmount: '8302300',
        description: 'Description....',
        remarks: 'Fine'
    },
    {
        id: 92,
        sn: 2,
        storeName: 'Store Name 1',
        supplierName: 'Supplier Name',
        transactionDate: 'Transaction Date',
        deliveryDate: 'Delivery Date',
        orderStatus: 'Active',
        totalAmount: '8302300',
        description: 'Description....',
        remarks: 'Fine'
    },
    {
        id: 998,
        sn: 3,
        storeName: 'Store Name 1',
        supplierName: 'Supplier Name',
        transactionDate: 'Transaction Date',
        deliveryDate: 'Delivery Date',
        orderStatus: 'Active',
        totalAmount: '8302300',
        description: 'Description....',
        remarks: 'Fine'
    },
    {
        id: 129,
        sn: 4,
        storeName: 'Store Name 1',
        supplierName: 'Supplier Name',
        transactionDate: 'Transaction Date',
        deliveryDate: 'Delivery Date',
        orderStatus: 'Active',
        totalAmount: '8302300',
        description: 'Description....',
        remarks: 'Fine'
    },
    {
        id: 9871,
        sn: 5,
        storeName: 'Store Name 1',
        supplierName: 'Supplier Name',
        transactionDate: 'Transaction Date',
        deliveryDate: 'Delivery Date',
        orderStatus: 'Active',
        totalAmount: '8302300',
        description: 'Description....',
        remarks: 'Fine'
    },
];
