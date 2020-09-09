import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable()
export class BasicInfoService {
    constructor() {
        const data = JSON.parse(localStorage.getItem('e'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('e', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    empCode: 'DEV-447R',
                    title: 'Developer',
                    firstName: 'Ram',
                    middleName: 'Bahadur',
                    lastName: 'Shah',
                    dateOfBirth: '1966/05/24',
                    maritalStatus: 'Married',
                    gender: 'Male',
                    religion: 'Hindu',
                    bloodGroup: 'A',
                    nationality: 'Neplease',
                    telNo: '01246831',
                    mobileNumber: '+977-9818780677',
                    email: 'rb@gmail.com',
                    alternativeEmail: 'reb@gmail.com',
                    refrencePerson: 'Hari Bahadur Tamang',
                    settlementStatus: 'Pending',
                    settlementDate: '2020/04/20',
                    remarks: 'Fine',
                    status: 'Active'
                }
            ]));
        } else if (data === null) {
            localStorage.setItem('e', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    empCode: 'DEV-447R',
                    title: 'Developer',
                    firstName: 'Ram',
                    middleName: 'Bahadur',
                    lastName: 'Shah',
                    dateOfBirth: '1966/05/24',
                    maritalStatus: 'Married',
                    gender: 'Male',
                    religion: 'Hindu',
                    bloodGroup: 'A',
                    nationality: 'Nepal',
                    telNo: '01246831',
                    mobileNumber: '+977-9818780677',
                    email: 'rb@gmail.com',
                    alternativeEmail: 'reb@gmail.com',
                    refrencePerson: 'Hari Bahadur Tamang',
                    settlementStatus: 'Pending',
                    settlementDate: '2020/04/20',
                    remarks: 'Fine',
                    status: 'Active'
                }
            ]));
        }
    }


    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('e'));
        if (data !== null) {
            return of(data);
        } else {
            return of([]);
        }
    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('e'));
        if (d !== null) {
            const e = d.find(_ => _.id === id);
            return of(e);
        } else {
            localStorage.setItem('e', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('e'));
            const e = data.find(_ => _.id === id);
            return of(e);
        }
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('e'));
        if (data !== null) {
            const i = data.findIndex(_ => _.id === id);
            data.splice(i, 1);
            localStorage.setItem('e', JSON.stringify(data));
            return of(data);
        } else {
            localStorage.setItem('e', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('e'));
            const i = d.findIndex(_ => _.id === id);
            d.splice(i, 1);
            localStorage.setItem('e', JSON.stringify(data));
            return of(d);
        }
    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('e'));
        if (d !== null) {
            const eValue = d.findIndex(x => x.id === body.id);
            body.sn = d[eValue].sn;
            d[eValue] = body;
            localStorage.setItem('e', JSON.stringify(d));
            return of(body);
        } else {
            localStorage.setItem('e', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('e'));
            const eValue = data.findIndex(x => x.id === body.id);
            data[eValue] = body;
            localStorage.setItem('e', JSON.stringify(data));
            return of(body);
        }
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('e'));
        if (data !== null) {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('e', JSON.stringify(data));
            return of(body);
        } else {
            localStorage.setItem('e', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('e'));
            d.push(body);
            body.id = d.length + 1;
            body.sn = d.length + 1;
            localStorage.setItem('e', JSON.stringify(d));
            return of(body);
        }
    }
}
