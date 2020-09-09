import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CompanyInformationService {

    constructor() { }

    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const d = List.find(x => x.id === id);
        return of(d);
    }

    addOrUpdate(body: any): Observable<any> {
        //  console.log(body.id);
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.sn = d.sn;
            body.id = d.id;
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
    {
        id: 1, sn: 1, name: 'CG Foundation', nameNepali: 'सि जी  फाउनडेसन ', registrationNumber: '2045/12/12',
        panNumber: 23564, registrationDate: '2019/12/12', address: 'Sanepa, Lalitpur', mailingAddress: 'Sanepa, Lalitpur',
        phone: +9779805108127, mobile: '+97715522330', email: 'info@chaudharyfoundation.org', logo: 'CGF'
    },
];
