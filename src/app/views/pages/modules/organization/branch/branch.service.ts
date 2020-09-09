import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';


@Injectable({
    providedIn: 'root'
})
export class BranchService {
    private readonly api = this.url.createUrl('', '');

    constructor(private http: HttpClient,
                private url: BaseUrlCreator,
                private paramGen: ParamGenService) { }

    // For Real data
    getBranch<T extends ResponseModel>(params?: QueryModel): Observable<T> {
        const b = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: b });
    }

    getBranchById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Add`, body);
    }

    deleteBranch<T extends ResponseModel>(id: number): Observable<T> {
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
        let data = List.findIndex(x => x.id === id);
        List.splice(data, 1);
        return of(List);
    }

}

let List = [
    {
        id: 1, sn: 1, name: 'Butwal', address: 'Butwal 4 Golpark', phone: '984678367',
        email: 'bbbutwal@gmail.com', district: 'Rupendehi', state: 'Lumbeni',
        country: 'Nepal', mailingAddress: 'Butwal'
    },
    {
        id: 2, sn: 2, name: 'Pokhara', address: 'Chipledhunga pokhara', phone: '984678367',
        email: 'bbbutwal@gmail.com', district: 'Kaski', state: 'Gandaki',
        country: 'Nepal', mailingAddress: 'Pokhara'
    },
    {
        id: 3, sn: 3, name: 'Kathmandu', address: 'New baneshwor', phone: '984678367',
        email: 'bbbutwal@gmail.com', district: 'Kathmandu', state: 'Bagmati',
        country: 'Nepal', mailingAddress: 'Kathmandu'
    },
    {
        id: 4, sn: 4, name: 'Chitwan', address: 'Chitwan bypass road', phone: '984678367',
        email: 'bbbutwal@gmail.com', district: 'Chitwan', state: 'Bagmati',
        country: 'Nepal', mailingAddress: 'Chitwan'
    },

];
