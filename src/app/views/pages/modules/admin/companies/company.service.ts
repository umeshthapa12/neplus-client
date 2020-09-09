import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Companies, ResponseModel, QueryModel } from '../../../../../models';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class CompanyService {

    private readonly api = this.url.createUrl('Companies', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Gets companies
     */
    getCompanies<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
     * Gets company by Id
     */
    getCompanyById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

     /**
     * Gets company by Guid
     */
    getCompanyByGuid<T extends ResponseModel>(guid: string): Observable<T> {
        return this.http.get<T>(`${this.api}/GetLazy/${guid}`);
    }


    /**
     * Updates company.
     * @param body payload
     */
    addOrUpdateCompany<T extends ResponseModel>(body: Companies): Observable<T> {
        const fd = new FormData();

        // JSON object to FormData except array list
        Object.keys(body).forEach(key => key !== 'phoneNumbers' ? fd.append(key, body[key]) : null);

        // list value of form data
        body.phoneNumbers.forEach((obj, i) => {
            Object.keys(obj).forEach(key => fd.append(`phoneNumbers[${i}][${key}]`, obj[key]));
        });

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, fd)
            : this.http.post<T>(`${this.api}/Create`, fd);
    }

    /**
     * Removes company.
     * @param body payload
     */
    deleteCompany<T extends ResponseModel>(id: number): Observable<T> {

        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }
}
