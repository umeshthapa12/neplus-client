import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

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


let List = [
    { id: 1, sn: 1, name: 'Manager', nameNepali: 'Manager', maxGradeLimit: 'A', position: 'Branch Manager', status: 'Active' },
    { id: 2, sn: 2, name: 'Manager', nameNepali: 'Manager', maxGradeLimit: 'b', position: 'Office manager', status: 'Inactive' },
    { id: 3, sn: 3, name: 'Manager', nameNepali: 'Manager', maxGradeLimit: 'c', position: 'Marketing manager', status: 'Active' },
    { id: 4, sn: 4, name: 'Staff', nameNepali: 'Manager', maxGradeLimit: 'A', position: 'Professional staf', status: 'Active' },
    { id: 5, sn: 5, name: 'supervisor', nameNepali: 'Manager', maxGradeLimit: 'A', position: ' Project supervisor', status: 'Active' },
];
