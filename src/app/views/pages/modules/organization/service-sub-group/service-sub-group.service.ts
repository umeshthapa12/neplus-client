import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ServiceSubGroupService {

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
    { id: 1, sn: 1, name: 'Local Transport', nameNepali: 'Local Transport', serviceGroup: 'Transport', description: 'This is the  servic Group to deliver the things', status: 'Active' },
    { id: 2, sn: 2, name: 'External Transport', nameNepali: 'External Transport', serviceGroup: 'Transport', description: 'This is the account Group for the cash in the company', status: 'Inactive' },
    { id: 3, sn: 3, name: 'Indestrial Security', nameNepali: 'Indestrial Security', serviceGroup: 'Security', description: 'Security Group Responsible for protection of the company ..', status: 'Active' },
    { id: 4, sn: 4, name: 'Low Level Manufacturing', nameNepali: 'Low Level Manufacturingfacturing', serviceGroup: 'Manufacturing ', description: 'Mainly responsible for then production in the ..', status: 'Inactive' },
    { id: 5, sn: 5, name: 'xyz', nameNepali: 'Help Desk', serviceGroup: 'Help Desk', description: 'Help for the Customer by Describing about compamy and company services.', status: 'Active' },
    { id: 6, sn: 6, name: 'xyz', nameNepali: 'xyz', serviceGroup: 'xyz', description: 'xyz', status: 'Pending' },
];
