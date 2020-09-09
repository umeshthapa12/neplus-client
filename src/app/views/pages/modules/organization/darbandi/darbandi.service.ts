import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DarbandiService {

    constructor() { }

    getList(): Observable<any> {
        return of (List);
    }
    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }
    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            // body.sn = d.sn;
            return of (body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            // body.sn = List.length + 1;
            return of (body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of (List);
    }

}

let List = [
    {
        id: 1, sn: 1, branch: 'Butwal', position: 'xyz', designation: 'Manager', department: 'IT', section: 'A',
        removeDate: '2074/12/12', removeDateNepali: '2074/12/12', noOfDarbandi: '5',
        description: 'This is the darbandi for the person who want to join with us'
    },
    {
        id: 2, sn: 2, branch: 'Kathmandu', position: 'xyz', designation: 'Co-ordinator', department: 'IT', section: 'A',
        removeDate: '2074/12/12', removeDateNepali: '2074/12/12', noOfDarbandi: '5',
        description: 'This is the darbandi for the person who want to join with us'
    },
    {
        id: 3, sn: 3, branch: 'Bhaktapur', position: 'xyz', designation: 'Manager', department: 'IT', section: 'A',
        removeDate: '2074/12/12', removeDateNepali: '2074/12/12', noOfDarbandi: '5',
        description: 'This is the darbandi for the person who want to join with us'
    },
    {
        id: 4, sn: 4, branch: 'Pokhara', position: 'xyz', designation: 'Manager', department: 'IT', section: 'A',
        removeDate: '2074/12/12', removeDateNepali: '2074/12/12', noOfDarbandi: '5',
        description: 'This is the darbandi for the person who want to join with us'
    },
    {
        id: 5, sn: 5, branch: 'Chitwan', position: 'xyz', designation: 'Manager', department: 'IT', section: 'A',
        removeDate: '2074/12/12', removeDateNepali: '2074/12/12', noOfDarbandi: '5',
        description: 'This is the darbandi for the person who want to join with us'
    },
];
