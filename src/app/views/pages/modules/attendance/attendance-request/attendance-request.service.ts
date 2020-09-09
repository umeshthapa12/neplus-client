import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttendanceRequestService {

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
        empCode: 'E-234',
        attendanceDate: '2020/05/12',
        attendanceDateNepali: '2077/03/12',
        logTime: '10:00 AM',
        attendanceCode: 'At-4342',
        direction: 'R',
        remarks: 'Good',
        approvalStatus: 'Approved',
        entryDate: '2077/05/12',
        entryBy: 'Staff',
        actionDate: '2020/04/05',
        actionBy: 'Supervisor',
        localIp: '192.168.104.1',
        publicIp: '192.168.105.5',
        actionRemarks: 'Attendance action Remarks is good',
        outPlace: 'office',
        plannedReturnTime: '6:15 pm',
        requestSource: 'I-card',
        location: 'Current-office',
        mapLocation: 'Nepal',
        mapLocationName: 'UTL-6 degree Nepal',
        imeiNumber: 'E-3467353',
    }
];
