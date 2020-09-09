import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttendanceDevicesService {

    constructor() {
        const data = JSON.parse(localStorage.getItem('devices'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('devices', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    lastLogDownloadDate: '2077/12/12',
                    transactionStamp: 'Haggle',
                    lastPing: '2 days ago',
                    deviceType: 'Manual recording.',
                    opStamp: 'Haggle',
                    downLoadType: 'Easy',
                    timeZone: 'Nepal',
                    deviceLocationBranch: 'Kathmandu',
                    deviceLocationDepartment: 'Manufacturing',
                    timeOut: '18:00 pm',
                    attendanceDeviceGroup: 'Development',
                    license: 'one -year Agriment',
                }
            ]));

        } else if (data === null) {
            localStorage.setItem('devices', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    lastLogDownloadDate: '2077/12/12',
                    transactionStamp: 'Haggle',
                    lastPing: '2 days ago',
                    deviceType: 'Manual recording.',
                    opStamp: 'Haggle',
                    downLoadType: 'Easy',
                    timeZone: 'Nepal',
                    deviceLocationBranch: 'Kathmandu',
                    deviceLocationDepartment: 'Manufacturing',
                    timeOut: '18:00 pm',
                    attendanceDeviceGroup: 'Development',
                    license: 'one -year Agriment',
                }
            ]));
        }
    }

    getList(): Observable<any> {
        const List = JSON.parse(localStorage.getItem('devices'));
        return of(List);
    }

    getLIstById(id: number): Observable<any> {
        const List = JSON.parse(localStorage.getItem('devices'));
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        const List = JSON.parse(localStorage.getItem('devices'));
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            localStorage.setItem('devices', JSON.stringify(List));
            return of(body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            body.sn = List.length + 1;
            localStorage.setItem('devices', JSON.stringify(List));
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const List = JSON.parse(localStorage.getItem('devices'));
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        localStorage.setItem('devices', JSON.stringify(List));
        return of(List);
    }

}
