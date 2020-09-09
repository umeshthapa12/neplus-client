import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DeputationService {

    constructor() { }

    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any) {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else { }
        List.push(body);
        body.id = List.length + 1;
        body.sn = List.length + 1;
        return of(body);
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);
    }

}

let List = [
    { id: 1, sn: 1, name: 'Employee', nameNepali: 'Employee', status: 'Active' },
    { id: 2, sn: 2, name: 'Helper', nameNepali: 'Helper', status: 'Inactive' },
    { id: 3, sn: 3, name: 'Helper', nameNepali: 'Helper', status: 'Approve' },
    { id: 4, sn: 4, name: 'Manager', nameNepali: 'Manager', status: 'Pending' },
    { id: 5, sn: 5, name: 'Co-worker', nameNepali: 'Co-worker', status: 'Rejected' },
];
