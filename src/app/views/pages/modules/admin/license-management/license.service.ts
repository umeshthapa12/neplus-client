import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ParamGenService, BaseUrlCreator } from '../../../../../../../src/app/utils';

@Injectable()
export class LicenseService {

    private readonly api = this.url.createUrl('License', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getLicenses<T extends any>(params?: any): Observable<T> {
        return this.http.get<T>(`${this.api}/Get`);
    }

    createRequest<T extends any>(body: any): Observable<T> {
        return this.http.post<T>(`${this.api}/CreateRequest`, body);
    }

}

