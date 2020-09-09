import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ItemRequestService {

    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const data = DATA.find(_ => _.id === id);
        return of(data);
    }

    delete(id: number): Observable<any> {
        const index = DATA.findIndex(_ => _.id === id);
        DATA.splice(index, 1);
        return of(DATA);
    }

    update(body: any): Observable<any> {
            const i = DATA.findIndex(_ => _.id === body.id);
            const data = DATA.find(_ => _.id === body.id);
            DATA[i] = body;
            body.id = data.id;
            body.sn = data.sn;
            return of(body);
    }

    add(body): Observable<any> {
        body.id = DATA.length + 1;
        body.sn = DATA.length + 1;
        DATA.push(body);
        return of(body);
    }

}

let DATA = [
    {
        id: 1, sn: 1, requestedDate: '2020',
        requestedby: 'Daraz',
        storeRequest: 'Requested',
        requestedTo: 'Hamrobazaar',
        projectFor: 'StoreName',
        approvalRequestTo: 'Store XMAP',
        totalQty: '200 units',
        storeName: 'All in one nepal',
        storeNameTo: 'Store GAH',
        reqDescription: 'Description....'
    }
];

