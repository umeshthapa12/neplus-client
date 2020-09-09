import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable()
export class TraningDetailsService {

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
        id: 1,
        empCode: 'EKG-12',
        name: 'Saroj Khadka',
        dateFrom: 'Mon May 18 2020 00: 00: 00',
        dateTo: 'Sun May 31 2020 00: 00: 00',
        days: '30',
        description: '..........',
        fiscalYear: '077/78',
        grade: 'A',
        intervalDays: '3',
        country: 'Nepal',
        countAsTraning: true,
        nextPhase: true,
        nextPhaseDeclaredBy: 'Jp',
        nextPhaseRemarks: 'Good',
        place: 'Kathmandu',
        previousContinue: true,
        previousTraningNo: '558285-42',
        provider: 'Jp inter..',
        selection: 'Selection 1',
        status: 'Active',
        traningCost: '45000',
        traningHour: '5',
        traningType: 'System Design',
        year: '2020'
    }
];
