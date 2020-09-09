import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class SalaryService {

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
        actualValue: '0900856',
        amount: '986532',
        calculationRate: '300',
        description: 'fine',
        effectByWorkingDays: '45',
        effectDateFrom: 'Tue May 05 2020 00:00:00 GMT+0545 (Nepal Time)',
        effectDateTo: 'Wed May 27 2020 00:00:00 GMT+0545 (Nepal Time)',
        empCode: 'EMP-1245',
        formula: 'asd',
        id: 2,
        isCurrentHead: true,
        natureOfCalculation: 'System Design',
        status: 'Active'
    }
];

