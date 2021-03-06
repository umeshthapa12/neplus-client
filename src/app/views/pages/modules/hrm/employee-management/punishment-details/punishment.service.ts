import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class PunishmentService {

    getList(): Observable<any> {
        return of(DATA);
    }

    delete(id: number): Observable<any> {
        const d = DATA.findIndex(_ => _.id === id);
        DATA.splice(d, 1);
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const data = DATA.find(_ => _.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const d = DATA.find(_ => _.id === body.id);
            const i = DATA.findIndex(_ => _.id === body.id);
            DATA[i] = body;
            body.id = d.id;
            return of(body);
        } else {
            const d = DATA.find(_ => _.id === body.id);
            DATA.push(body);
            body.id = DATA.length + 1;
            return of(body);
        }
    }
}

let DATA = [
    {
        date: 'Wed May 06 2020 00: 00: 00',
        description: 'Done',
        effectDateFrom: 'Wed May 06 2020 00: 00: 00',
        effectDateTo: 'Sun May 10 2020 00: 00: 00',
        empCode: 'EMP-0',
        id: 2,
        name: 'RAM',
        punishmentType: 'Type 1',
        status: 'Active'
    }
]
