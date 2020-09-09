import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ContractPeriodService {

    constructor() { }

    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        // console.log('===' + body.id);
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            body.sn = List.length + 1;
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);

    }
}



const List = [
    { id: 1, sn: 1, name: 'Permanent Contracts', nameNepali: 'Permanent Contracts', status: 'Active' },
    { id: 2, sn: 2, name: 'Fixed- Term Contracts ', nameNepali: 'Fixed- Term Contracts ', status: 'Inactive' },
    { id: 3, sn: 3, name: 'Casual Employment Contracts', nameNepali: 'Casual Employment Contracts', status: 'Pending' },
    { id: 4, sn: 4, name: 'Zero-Hour Contracts', nameNepali: 'Zero-Hour Contracts', status: 'Approve' },
    { id: 5, sn: 5, name: 'Agency Contract', nameNepali: 'Agency Contract', status: 'Active' }
];
