import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class FiscalYearService {

    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getFiscalYears<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getFiscalYearById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteFiscalYear<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getLists(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const d = DATA.find(_ => _.id === id);
        return of(d);
    }

    deleteList(id: number):Observable<any> {
        const d = DATA.findIndex(x => x.id === id);
        DATA.splice(d, 1);
        return of(DATA);
    }

    addOrUpdates(body: any): Observable<any> {
        if (body.id > 0) {
            let i = DATA.findIndex(_ => _.id === body.id);
            let d = DATA.find(_ => _.id === body.id);
            DATA[i] = body;
            body.sn = d.sn;
            body.id = d.id;
            return of(body);
        } else {
            DATA.push(body);
            body.id = DATA.length + 1;
            body.sn = DATA.length + 1;
            return of(body);
        }
    }
}

let DATA = [
    { id: 1, sn: 1, name: 'आर्थिक वर्ष ०७०/७१' },
    { id: 2, sn: 2, name: 'आर्थिक वर्ष ०७१/७२' },
    { id: 3, sn: 3, name: 'आर्थिक वर्ष ०७२/७३' },
    { id: 4, sn: 4, name: 'आर्थिक वर्ष ०७३/७४' },
    { id: 5, sn: 5, name: 'आर्थिक वर्ष ०७४/७५' },
];



