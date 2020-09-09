import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttendanceManualService {

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
        id: 1,
        sn: 1,
        deviceLog: 'Facial Recognition ',
        logDate: '2019/12/12',
        logDateNepali: '2076/12/12',
        logTime: '09: 00 Am',
        attendanceCode: 'A-453',
        deviceId: 'Att-453',
        direction: 'Left',
        request: 'Manual',
        empCode: 'E-453',
        logSource: 'Identity Card',

    },
    {
        id: 2,
        sn: 2,
        deviceLog: 'Fingerprint Reader',
        logDate: '2019/12/12',
        logDateNepali: '2076/12/12',
        logTime: '09: 00 Am',
        attendanceCode: 'A-453',
        deviceId: 'Att-453',
        direction: 'Left',
        request: 'By username',
        empCode: 'E-453',
        logSource: 'Identity Card',

    },
];
