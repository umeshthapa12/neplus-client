import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ContractTypeService {

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
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            return of(body);
        } else {
            List.push(body);
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
    { id: 1, name: ' Bill of Sale', nameNepali: ' Bill of Sale', durationMonth: '24 month' },
    { id: 2, name: 'Employment Agreement', nameNepali: 'Employment Agreement', durationMonth: '12 month' },
    { id: 3, name: 'Licensing Contract', nameNepali: 'Licensing Contract', durationMonth: '24 month' },
    { id: 4, name: 'Nondisclosure Agreement', nameNepali: 'Nondisclosure Agreement', durationMonth: '48 month' },
    { id: 5, name: 'Promissory Note', nameNepali: 'Promissory Note', durationMonth: '6 month' }
];
