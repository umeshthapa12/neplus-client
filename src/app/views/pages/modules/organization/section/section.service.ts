import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SectionService {

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
    { id: 1, sn: 1, name: 'RECEPTION', nameNepali: 'स्वागत', department: 'Manufacturing', status: 'Active' },
    { id: 2, sn: 2, name: 'BELL DESK', nameNepali: 'बेल डेस्क', department: 'Supply', status: 'Inactive' },
    { id: 3, sn: 3, name: 'concierge ', nameNepali: 'द्वारपाल', department: 'Manufacturing', status: 'Active' },
    { id: 4, sn: 4, name: 'Travel Desk', nameNepali: ' यात्रा डेस्क', department: 'Supply', status: 'Inactive' },
    { id: 5, sn: 5, name: 'HELP DESK', nameNepali: 'सहायता केन्द्र', department: 'Shaling', status: 'Active' },
    { id: 6, sn: 6, name: 'Cash', nameNepali: 'नगद', department: 'Account', status: 'Inactive' },
];
