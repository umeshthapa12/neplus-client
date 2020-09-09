import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DocumentManagementService {

    constructor() {
        const data = JSON.parse(localStorage.getItem('d'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('d', JSON.stringify([
                { id: 1, sn: 1, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
                { id: 2, sn: 2, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
                { id: 3, sn: 3, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
                { id: 4, sn: 4, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
            ]));
        } else if (data === null) {
            localStorage.setItem('d', JSON.stringify([
                { id: 1, sn: 1, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
                { id: 2, sn: 2, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
                { id: 3, sn: 3, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
                { id: 4, sn: 4, title: 'Document Title', category: ['Text Document'], fiscalYear: '2079/80', date: '2020', description: 'Description' },
            ]));
        }
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        return of(data);
    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('d'));
        const e = d.find(_ => _.id === id);
        return of(e);
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        const i = data.findIndex(_ => _.id === id);
        data.splice(i, 1);
        localStorage.setItem('d', JSON.stringify(data));
        return of(data);
    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('d'));
        const eValue = d.findIndex(x => x.id === body.id);
        body.sn = d[eValue].sn;
        d[eValue] = body;
        localStorage.setItem('d', JSON.stringify(d));
        return of(body);
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('d'));
        data.push(body);
        body.id = data.length + 1;
        body.sn = data.length + 1;
        localStorage.setItem('d', JSON.stringify(data));
        return of(body);
    }
}
