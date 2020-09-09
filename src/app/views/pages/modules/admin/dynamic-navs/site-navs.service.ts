import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryModel, ResponseModel, UserAccount } from '../../../../../models';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class SiteNavService {

    private readonly api = this.url.createUrl('SiteNavigation', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Gets navs
     */
    getNavs<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
    * Gets parent navs
    */
    getParents<T extends ResponseModel>(): Observable<T> {

        return this.http.get<T>(`${this.api}/GetParents`);
    }


    /**
     * Gets an nav by Id
     */
    getNavById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    /**
     * Updates an nav.
     * @param body payload
     */
    addOrUpdate<T extends ResponseModel>(body: UserAccount): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    /**
     * Updates nav's account status
     * @param body payload
     */
    updateStatus<T extends ResponseModel>(body: UserAccount): Observable<T> {
        return this.http.put<T>(`${this.api}/UpdateStatus`, body);

    }

    /**
     * Removes an nav.
     * @param body payload
     */
    deleteNav<T extends ResponseModel>(id: number): Observable<T> {

        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }
}
