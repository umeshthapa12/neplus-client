import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';
import { ResponseModel, QueryModel } from '../../../../../models';

@Injectable()
export class OfficeService {

    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) {
        const data = JSON.parse(localStorage.getItem('office'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('office', JSON.stringify([
                {
                    id: 1, sn: 1,
                    name: 'Papson Nepal',
                    status: 'Active',

                },
                {
                    id: 2, sn: 2,
                    name: 'Ministory of Finance',
                    status: 'Inactive'
                },
                {
                    id: 3, sn: 3,
                    name: 'Post Office Nepal',
                    status: 'Active'

                },
                {
                    id: 4, sn: 4,
                    name: 'Nepal Turism Board',
                    status: 'Active'

                },
                {
                    id: 5, sn: 5,
                    name: 'District Agriculture Office',
                    status: 'Active'

                },
                {
                    id: 6, sn: 6,
                    name: 'Open University Nepal',
                    status: 'Active'

                },
                {
                    id: 7, sn: 7,
                    name: 'NNational Innovation Center',
                    status: 'Active'

                },
                {
                    id: 8, sn: 8,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 9, sn: 9,
                    name: 'National Innovation Center',
                    status: 'Inactive'


                },
                {
                    id: 10, sn: 10,
                    name: 'BUtwal Today ',
                    status: 'Inactive'

                },
                {
                    id: 11, sn: 11,
                    name: 'National Innovation Center',
                    status: 'Inactive'
                },
            ]));
        } else if (data === null) {
            // tslint:disable-next-line: no-unused-expression
            localStorage.setItem('office', JSON.stringify([
                {
                    id: 1, sn: 1,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 2, sn: 2,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 3, sn: 3,
                    name: 'BUtwal Today',
                    status: 'Active'


                },
                {
                    id: 4, sn: 4,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 5, sn: 5,
                    name: 'BUtwal Today',
                    status: 'Active'

                },
                {
                    id: 6, sn: 6,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 7, sn: 7,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 8, sn: 8,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
                {
                    id: 9, sn: 9,
                    name: 'National Innovation Center',
                    status: 'Active'


                },
                {
                    id: 10, sn: 10,
                    name: 'BUtwal Today',
                    status: 'Active'

                },
                {
                    id: 11, sn: 11,
                    name: 'National Innovation Center',
                    status: 'Active'

                },
            ]));
        }
    }

    getOffice<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getOfficeById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteOffice<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('office'));
        return of(data);

    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('office'));
        const e = d.find(_ => _.id === id);
        return of(e);
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('office'));
        const i = data.findIndex(_ => _.id === id);
        data.splice(i, 1);
        localStorage.setItem('office', JSON.stringify(data));
        return of(data);

    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('office'));
        const eValue = d.findIndex(x => x.id === body.id);
        body.sn = d[eValue].sn;
        d[eValue] = body;
        localStorage.setItem('office', JSON.stringify(d));
        return of(body);

    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('office'));
        data.push(body);
        body.id = data.length + 1;
        body.sn = data.length + 1;
        localStorage.setItem('office', JSON.stringify(data));
        return of(body);

    }
}



