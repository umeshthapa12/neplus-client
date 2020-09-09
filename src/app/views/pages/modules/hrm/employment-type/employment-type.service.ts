import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EmploymentTypeService {

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
    { id: 1, sn: 1, name: 'Full-Time', nameNepali: 'पुरै समय', isGrade: true, isGratuity: false, status: 'Active' },
    { id: 2, sn: 2, name: 'Part-Time', nameNepali: 'आंशिक समय', isGrade: false, isGratuity: true, status: 'Inactive' },
    { id: 3, sn: 3, name: 'Temporary', nameNepali: 'अस्थायी', isGrade: true, isGratuity: false, status: 'Active' },
    { id: 4, sn: 4, name: 'Seasonal', nameNepali: 'मौसमी', isGrade: false, isGratuity: true, status: 'Inactive' },
    { id: 5, sn: 5, name: 'Mysterious', nameNepali: 'रहस्यमय', isGrade: true, isGratuity: false, status: 'Active' },
    { id: 6, sn: 6, name: 'Apprentices ', nameNepali: 'अप्रेन्टिसहरू', isGrade: false, isGratuity: true, status: 'Active' },
    { id: 7, sn: 7, name: 'Casual', nameNepali: 'आरामदायक', isGrade: true, isGratuity: false, status: 'Inactive' },
];
