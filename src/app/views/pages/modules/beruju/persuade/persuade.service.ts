import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class PersuadeService {

    private readonly api = this.url.createUrl('', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getPersuades<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getPersuadeById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }
    getPersuadeByGuid<T extends ResponseModel>(guid: string): Observable<T> {
        return this.http.get<T>(`${this.api}/GetLazy/${guid}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deletePersuade<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        return of(DATA);
    }

    getDataById(id: number): Observable<any> {
        const d = DATA.find(x => x.id === id);
        return of(d);
    }

    delete(id: number): Observable<any> {
        let i = DATA.findIndex(_ => _.id === id);
        DATA.splice(i, 1);
        localStorage.setItem('p', JSON.stringify(DATA));
        return of(i);
    }

    addOrUpdates(body: any): Observable<any> {
        if (body.id > 0) {
            let i = DATA.findIndex(_ => _.id === body.id);
            let d = DATA.find(_ => _.id === body.id);
            DATA[i] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            DATA.push(body);
            body.id = DATA.length + 1;
            body.sn = DATA.length + 1;
            return of(body);
        }
    }

}

const DATA = [
    {
        sn: 1,
        id: 32,
        name: 'William',
        role: 'Manager',
        userName: 'William',
        address: '12, COA street, USA',
        email: 'willi@gmail.com',
        contactNumber: '+33564673216'
    },
    {
        sn: 2,
        id: 30,
        name: 'John',
        role: 'Employee',
        userName: 'Joe',
        address: 'Paris, France',
        contactNumber: '+899126583764',
        email: 'joe22@gmail.com'
    },
    {
        sn: 3,
        id: 50,
        name: 'Seth',
        role: 'Employee',
        userName: 'Rollen',
        address: 'Deo, Germany',
        contactNumber: '+88103197562',
        email: 'rollen@gmail.com'
    },
    {
        sn: 4,
        id: 60,
        name: 'Jerry',
        role: 'Employee',
        userName: 'Jee',
        address: 'WAS-street, USA',
        contactNumber: '123654789',
        email: 'jee@gmail.com'
    }
];
