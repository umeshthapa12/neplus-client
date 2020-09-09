import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttendanceShiftService {

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
        code: 'AE-234',
        name: 'Morning',
        beginTime: '06: 00 AM',
        endTime: '12:00 PM',
        break1BeginTime: '07: 30 AM',
        break1EndTime: '08: 00 AM',
        break2BeginTime: '10: 30 AM',
        break2EndTime: '11:00 AM',
        break1Duration: '30 minuts',
        break2Duration: '30 minuts',
        shiftDuration: '6 hours',
        isNight: false,
        punchBeginDuration: '1 hrs',
        punchEndDuration: '2 hrs',
        isLead: true,
        shiftOutStartTime: '11: 45 Am',
        shiftOutEndTime: '12: 00 PM',
        isCheckNextDayOut: true,
        lateGraceTime: '11: 00 Am',
        earlyGraceTime: '10: 00 AM'
    }
];
