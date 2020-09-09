import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ServiceGroupService {

    constructor() { }
    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            List[data] = body;
            body.sn = List[data].sn;
            body.id = List[data].id;
            return of(body);
        } else {
            List.push(body);
            body.sn = List.length + 1;
            body.id = List.length + 1;
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);
    }

}


let List = [
    { id: 1, sn: 1, name: 'Transport', nameNepali: 'Transport', service: 'Delivery', description: 'This is the  servic Group to deliver the things', status: 'Active' },
    { id: 2, sn: 2, name: 'Account', nameNepali: 'Account', service: 'Cash', description: 'This is the account Group for the cash in the company', status: 'Inactive' },
    { id: 3, sn: 3, name: 'Security', nameNepali: 'Security', service: 'concierge', description: 'Security Group Responsible for protection of the company ..', status: 'Active' },
    { id: 4, sn: 4, name: 'Manufacturing', nameNepali: 'Manufacturing', service: 'Production ', description: 'Mainly responsible for then production in the ..', status: 'Inactive' },
    { id: 5, sn: 5, name: 'Help Desk', nameNepali: 'Help Desk', service: 'Receptio', description: 'Help for the Customer by Describing about compamy and company services.', status: 'Active' },
    { id: 6, sn: 6, name: 'xyz', nameNepali: 'xyz', service: 'xyz', descriptio: 'xyz', status: 'Pending' },
];
