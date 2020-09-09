import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ItemReturnService {

    constructor(private http: HttpClient) {
        const data = JSON.parse(localStorage.getItem('return'));
        if (data !== null && data.length === null) {
            localStorage.setItem('return', JSON.stringify([
                {
                    id: 11, sn: 1, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Gokul',
                    remarks: 'New Storage', sendNotification: true, status: 'Active'
                },
                {
                    id: 21, sn: 2, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Saroj',
                    remarks: 'New Storage', sendNotification: false, status: 'Inactive'
                },
                {
                    id: 31, sn: 3, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Chandra prakash',
                    remarks: 'New Storage', sendNotification: true, status: 'Active'
                },
                {
                    id: 41, sn: 4, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Gokul',
                    remarks: 'New Storage', sendNotification: true, status: 'Inactive'
                },
                {
                    id: 51, sn: 5, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Gokul',
                    remarks: 'New Storage', sendNotification: true, status: 'Active'
                },
                {
                    id: 61, sn: 6, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Chandra prakash',
                    remarks: 'New Storage', sendNotification: false, status: 'Inactive'
                }
            ]));

        } else if (data === null) {
            localStorage.setItem('return', JSON.stringify([
                {
                    id: 11, sn: 1, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Gokul',
                    remarks: 'New Storage', sendNotification: true, status: 'Active'
                },
                {
                    id: 21, sn: 2, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Saroj',
                    remarks: 'New Storage', sendNotification: false, status: 'Inactive'
                },
                {
                    id: 31, sn: 3, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Chandra prakash',
                    remarks: 'New Storage', sendNotification: true, status: 'Active'
                },
                {
                    id: 41, sn: 4, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Gokul',
                    remarks: 'New Storage', sendNotification: true, status: 'Inactive'
                },
                {
                    id: 51, sn: 5, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Gokul',
                    remarks: 'New Storage', sendNotification: true, status: 'Active'
                },
                {
                    id: 61, sn: 6, transactionDate: '2020/03/20', returnToStore: 'ABC store', returnBy: 'Chandra prakash',
                    remarks: 'New Storage', sendNotification: false, status: 'Inactive'
                }
            ]));

        }
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('return'));
        if (data !== null) {
            return of(data);
        } else {
            return of([]);
        }
    }

    getListById(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('return'));
        if (data !== null) {
            const r = data.find(_ => _.id === id);
            return of(r);
        } else {
            localStorage.setItem('return', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('return'));
            const r = d.find(_ => _.id === id);
            return of(r);
        }
    }


    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('return'));
        if (data !== null) {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('return', JSON.stringify(data));
            return of(body);
        } else {
            localStorage.setItem('return', JSON.stringify([]));
            const s = JSON.parse(localStorage.getItem('return'));
            if (s !== null) {
                s.push(body);
                body.id = s.length + 1;
                body.sn = s.length + 1;
                localStorage.setItem('return', JSON.stringify(s));
                return of(body);

            }
        }

    }
    updata(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('return'));
        if (data !== null) {
            const d = data.findIndex(x => x.id === body.id);
            body.sn = data[d].sn;
            data[d] = body;
            localStorage.setItem('return', JSON.stringify(data));
            return of(body);
        } else {
            localStorage.setItem('return', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('return'));
            const d = data.findIndex(x => x.id === body.id);
            body.sn = data[d].sn;
            data[d] = body;
            localStorage.setItem('return', JSON.stringify(data));
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('return'));
        if (data !== null) {
            const i = data.findIndex(x => x.id === id);
            data.splice(i, 1);
            localStorage.setItem('return', JSON.stringify(data));
            return of(data);
        } else {
            localStorage.setItem('return', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('return'));
            const i = data.findIndex(x => x.id === id);
            data.splice(i, 1);
            localStorage.setItem('return', JSON.stringify(data));
            return of(data);
        }
    }

}
