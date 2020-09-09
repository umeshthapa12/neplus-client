import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';


@Injectable({
    providedIn: 'root'
})
export class AssetsService {
    private readonly api = this.url.createUrl('', '');

    constructor(private http: HttpClient,
                private paramGen: ParamGenService,
                private url: BaseUrlCreator) { }

    // For Real Api Data
    getAssets<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const b = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: b });
    }

    getAssetsById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Add`, body);
    }

    deletes<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdates(body: any): Observable<any> {
        if (body.id > 0) {
            let data = List.findIndex(x => x.id === body.id);
            let d = List.find(x => x.id === body.id);
            List[data] = body;
            body.sn = d.sn;
            body.id = d.id;
            return of(body);

        } else {
            List.push(body);
            body.sn = List.length + 1;
            body.id = List.length + 1;
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
    { id: 1, sn: 1, name: 'Vehicles', nameNepali: 'Vehicles', status: 'Active' },
    { id: 2, sn: 2, name: 'Goodwill', nameNepali: 'Vehicles', status: 'Inactive' },
    { id: 3, sn: 3, name: 'inventory', nameNepali: 'Vehicles', status: 'Active' },
    { id: 4, sn: 4, name: 'Goodwill', nameNepali: 'Vehicles', status: 'Inactive' },
    { id: 5, sn: 5, name: 'Vehicles', nameNepali: 'Vehicles', status: 'Active' },
    { id: 6, sn: 6, name: 'Goodwill', nameNepali: 'Vehicles', status: 'Inactive' },
];
