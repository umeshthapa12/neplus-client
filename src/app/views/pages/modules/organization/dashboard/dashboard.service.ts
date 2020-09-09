import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DashboardService {

    getStock(): Observable<any> {
        return of(stock);
    }

    getItemGroup(): Observable<any> {
        return of(itemGroup);
    }

    getStore(): Observable<any> {
        return of(store);
    }

    getPurchaseOrder(): Observable<any> {
        return of(purchaseOrder);
    }

    getItemRequest(): Observable<any> {
        return of(itemRequest);
    }
}
const stock = [
    { id: 1, sn: 1, storeName: 'Store A', itemName: 'Item AXK-1', minStore: '192', stock: '30012' },
    { id: 2, sn: 2, storeName: 'Store B', itemName: 'Item ISD-134', minStore: '321', stock: '623' },
    { id: 3, sn: 3, storeName: 'Store C', itemName: 'Item KAS-987', minStore: '23', stock: '56' },
    { id: 4, sn: 4, storeName: 'Store D', itemName: 'Item AKLS-1299', minStore: '46', stock: '65' },
    { id: 5, sn: 5, storeName: 'Store E', itemName: 'Item NASI-65', minStore: '67', stock: '423' },
    { id: 6, sn: 6, storeName: 'Store F', itemName: 'Item AFL-320', minStore: '876', stock: '342' },
];

const itemGroup = [
    { id: 1, sn: 1, name: 'Item NKA-123' },
    { id: 2, sn: 2, name: 'Item ISD-134' },
    { id: 3, sn: 3, name: 'Item NKA-123' },
    { id: 4, sn: 4, name: 'Item AKLS-1299' },
    { id: 5, sn: 5, name: 'Item AFL-320' },
    { id: 6, sn: 6, name: 'Item AFL-320' },
];

const store = [
    { id: 1, sn: 1, name: 'Item NKA-123' },
    { id: 2, sn: 2, name: 'Item ISD-134' },
    { id: 3, sn: 3, name: 'Item NKA-123' },
    { id: 4, sn: 4, name: 'Item AKLS-1299' },
    { id: 5, sn: 5, name: 'Item AFL-320' },
];

const purchaseOrder = [
    {
        id: 1, sn: 1, storeName: 'Store AEP', supplierName: 'Supplier AWAG', transactionDate: '2020', orderStatus: 'Approved',
        totalAmount: '1278110'
    },
    {
        id: 2, sn: 2, storeName: 'Store NWA', supplierName: 'Supplier AAG', transactionDate: '2020', orderStatus: 'Rejected',
        totalAmount: '21025'
    },
    {
        id: 3, sn: 3, storeName: 'Store NQE', supplierName: 'Supplier POAS', transactionDate: '2020', orderStatus: 'Pending',
        totalAmount: '98550'
    },
    {
        id: 4, sn: 4, storeName: 'Store POAE', supplierName: 'Supplier KQSD', transactionDate: '2020', orderStatus: 'Approved',
        totalAmount: '10256'
    },
    {
        id: 5, sn: 5, storeName: 'Store GAA', supplierName: 'Supplier AALD', transactionDate: '2020', orderStatus: 'Approved',
        totalAmount: '80102'
    },
];

const itemRequest = [
    {
        sn: 1, id: 1, requestedDate: '2020', requestedBy: 'Store A', requestedTo: 'Store A', totalQty: '12912',
        storeName: 'Store X', storeNameTo: 'Store M', projectName: 'Project A'
    },
    {
        sn: 2, id: 2, requestedDate: '2020', requestedBy: 'Store Q', requestedTo: 'Store M', totalQty: '878',
        storeName: 'Store L', storeNameTo: 'Store M', projectName: 'Project N'
    },
    {
        sn: 3, id: 3, requestedDate: '2020', requestedBy: 'Store I', requestedTo: 'Store L', totalQty: '586',
        storeName: 'Store A', storeNameTo: 'Store M', projectName: 'Project D'
    },
    {
        sn: 4, id: 4, requestedDate: '2020', requestedBy: 'Store O', requestedTo: 'Store G', totalQty: '58',
        storeName: 'Store B', storeNameTo: 'Store M', projectName: 'Project Z'
    },
    {
        sn: 5, id: 5, requestedDate: '2020', requestedBy: 'Store P', requestedTo: 'Store Q', totalQty: '257',
        storeName: 'Store C', storeNameTo: 'Store M', projectName: 'Project R'
    },
];





