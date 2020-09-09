import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';
import { ResponseModel, QueryModel } from '../../../../../models';

@Injectable()
export class ItemGroupService {

    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) {
        const data = JSON.parse(localStorage.getItem('item'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('item', JSON.stringify([
                {
                    id: 1, sn: 1,
                    itemName: 'Laptop',
                    status: 'Active',

                },
                {
                    id: 2, sn: 2,
                    itemName: 'Desktop',
                    status: 'Inactive'
                },
                {
                    id: 3, sn: 3,
                    itemName: 'mac',
                    status: 'Active'

                },
                {
                    id: 4, sn: 4,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 5, sn: 5,
                    itemName: 'Fefrigenerator',
                    status: 'Active'

                },
                {
                    id: 6, sn: 6,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 7, sn: 7,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 8, sn: 8,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 9, sn: 9,
                    itemName: 'Computer',
                    status: 'Inactive'


                },
                {
                    id: 10, sn: 10,
                    itemName: 'Heater ',
                    status: 'Inactive'

                },
                {
                    id: 11, sn: 11,
                    itemName: 'Computer',
                    status: 'Inactive'
                },
            ]));
        } else if (data === null) {
            localStorage.setItem('item', JSON.stringify([
                {
                    id: 1, sn: 1,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 2, sn: 2,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 3, sn: 3,
                    itemName: 'Heater',
                    status: 'Active'


                },
                {
                    id: 4, sn: 4,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 5, sn: 5,
                    itemName: 'Heater',
                    status: 'Active'

                },
                {
                    id: 6, sn: 6,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 7, sn: 7,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 8, sn: 8,
                    itemName: 'Computer',
                    status: 'Active'

                },
                {
                    id: 9, sn: 9,
                    itemName: 'Computer',
                    status: 'Active'


                },
                {
                    id: 10, sn: 10,
                    itemName: 'Heater',
                    status: 'Active'

                },
                {
                    id: 11, sn: 11,
                    itemName: 'Computer',
                    status: 'Active'

                },
            ]));
        }
    }

    getDarta<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getDartaById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteDarta<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('item'));
        if (data !== null) {
            return of(data);
        } else {
            return of([]);
        }
    }

    getListById(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('item'));
        if (d !== null) {
            const e = d.find(_ => _.id === id);
            return of(e);
        } else {
            localStorage.setItem('item', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('item'));
            const e = data.find(_ => _.id === id);
            return of(e);
        }
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('item'));
        if (data !== null) {
            const i = data.findIndex(_ => _.id === id);
            data.splice(i, 1);
            localStorage.setItem('item', JSON.stringify(data));
            return of(data);
        } else {
            localStorage.setItem('item', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('item'));
            const i = d.findIndex(_ => _.id === id);
            d.splice(i, 1);
            localStorage.setItem('item', JSON.stringify(data));
            return of(d);
        }
    }

    update(body: any): Observable<any> {
        const d = JSON.parse(localStorage.getItem('item'));
        if (d !== null) {
            const eValue = d.findIndex(x => x.id === body.id);
            body.sn = d[eValue].sn;
            d[eValue] = body;
            localStorage.setItem('item', JSON.stringify(d));
            return of(body);
        } else {
            localStorage.setItem('item', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('item'));
            const eValue = data.findIndex(x => x.id === body.id);
            data[eValue] = body;
            localStorage.setItem('item', JSON.stringify(data));
            return of(body);
        }
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('item'));
        if (data !== null) {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('item', JSON.stringify(data));
            return of(body);
        } else {
            localStorage.setItem('item', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('item'));
            d.push(body);
            body.id = d.length + 1;
            body.sn = d.length + 1;
            localStorage.setItem('item', JSON.stringify(d));
            return of(body);
        }
    }
}


