import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttendanceShiftWorkingService {

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
            body.sn = d.sn;
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
    {
        id: 1,
        sn: 1,
        code: 'E-453',
        shiftCode: 'M-456',
        workingDay: '6 days',
        workingDayName: 'Monday',
        workingTime: '10-06',
        workingHour: '8 hours',
        minWorkingHour: '5 hours',
    },
    {
        id: 2,
        sn: 2,
        code: 'E-453',
        shiftCode: 'M-456',
        workingDay: '6 days',
        workingDayName: 'Sunday',
        workingTime: '10-06',
        workingHour: '8 hours',
        minWorkingHour: '5 hours',
    },
];
