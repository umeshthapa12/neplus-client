import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BranchHolidayGroupService {

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


const List = [
    { id: 1, sn: 1, name: 'Co-workers', nameNepali: 'सहकर्मीहरू', status: 'Active' },
    { id: 2, sn: 2, name: 'Management', nameNepali: 'व्यवस्थापन', status: 'Active' },
    { id: 3, sn: 3, name: 'Employeers', nameNepali: 'कर्मचारीहरु', status: 'Inactive' },
    { id: 4, sn: 4, name: 'Suppliers Team', nameNepali: 'आपूर्तिकर्ता टोली', status: 'Pending' },
    { id: 5, sn: 5, name: 'Account Team', nameNepali: 'खाता टोली', status: 'Approve' },
    { id: 6, sn: 6, name: 'Office Helper', nameNepali: 'कार्यालय सहायकहरू', status: 'Inactive' },
];
