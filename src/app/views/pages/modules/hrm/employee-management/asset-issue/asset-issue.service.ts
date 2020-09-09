import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AssetIssueService {

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
        assetCode: 'A-09J',
        description: 'fine',
        empCode: 'EMP--9090',
        id: 2,
        issueDate: 'Sun May 03 2020 00:00:00 GMT+0545 (Nepal Time)',
        issueDateUpTo: 'Thu May 28 2020 00:00:00 GMT+0545 (Nepal Time)',
        issuedForName: 'Issued Name',
        name: 'Name',
        returnDate: 'Fri May 29 2020 00:00:00 GMT+0545 (Nepal Time)',
        returnStatus: 'Inactive',
        returnToName: 'Returned To Name',
        status: 'Active',
        value: '123800'
    }

];
