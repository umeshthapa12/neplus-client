import { Observable, of } from 'rxjs';
import { QueryModel } from './../../../../../models/filter-sort-pager.model';
import { ResponseModel } from './../../../../../models/app.model';
import { ParamGenService } from './../../../../../utils/generators/query-params';
import { BaseUrlCreator } from './../../../../../utils/extensions/base-url';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UnitService {
    private readonly api = this.url.createUrl('', '');

    constructor(private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService,
    ) {

        const data = JSON.parse(localStorage.getItem('unit'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('unit', JSON.stringify([
                { id: 1, sn: 1, unitName: 'one', status: 'Active' },
                { id: 2, sn: 2, unitName: 'Two', status: 'Inactive' },
                { id: 3, sn: 3, unitName: 'Three', status: 'Active' },
                { id: 4, sn: 4, unitName: 'Four', status: 'Active' },
                { id: 5, sn: 5, unitName: 'Five', status: 'pending' },
                { id: 6, sn: 6, unitName: 'Six', status: 'pending' },
                { id: 7, sn: 7, unitName: 'Seven', status: 'Active' },
            ]));
        } else if (data === null) {
            localStorage.setItem('unit', JSON.stringify([
                { id: 1, sn: 1, unitName: 'one', status: 'Active' },
                { id: 2, sn: 2, unitName: 'Two', status: 'Inactive' },
                { id: 3, sn: 3, unitName: 'Three', status: 'Active' },
                { id: 4, sn: 4, unitName: 'Four', status: 'Active' },
                { id: 5, sn: 5, unitName: 'Five', status: 'pending' },
                { id: 6, sn: 6, unitName: 'Six', status: 'pending' },
                { id: 7, sn: 7, unitName: 'Seven', status: 'Active' },
            ]));
        }
    }

    getUnit<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }


    getUnitById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/{id}`);
    }
    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/update`, body)
            : this.http.post<T>(`${this.api}/create`, body);
    }

    deleteUnit<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/delete/${id}`);
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('unit'));
        if (data !== null) {
            return of(data);
        } else {
            return of([]);
        }
    }

    getListById(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('unit'));
        if (data !== null) {
            const u = data.find(x => x.id === id);
            return of(u);
        } else {
            localStorage.setItem('unit', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('unit'));
            return of(data);
        }
    }

    add(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('unit'));
        if (data !== null) {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('unit', JSON.stringify(data));
            return of(body);
        }
    }

    updata(body: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('unit'));
        if (data !== null) {
            const d = data.findIndex(x => x.id === body.id);
            body.sn = data[d].sn;
            data[d] = body;
            localStorage.setItem('unit', JSON.stringify(data));
            return of(body);

        } else {
            localStorage.setItem('unit', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('unit'));
            const d = data.findIndex(x => x.id === body.id);
            data[d] = body;
            localStorage.setItem('unit', JSON.stringify(data));
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const data = JSON.parse(localStorage.getItem('unit'));
        if (data !== null) {
            const i = data.findIndex(x => x.id === id);
            data.splice(i, 1);
            localStorage.setItem('unit', JSON.stringify(data));
            return of(data);
        } else {
            localStorage.setItem('unit', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('unit'));
            const i = data.findIndex(x => x.id === id);
            data.splice(i, 1);
            localStorage.setItem('unit', JSON.stringify(data));
            return of(data);

        }

    }
}
