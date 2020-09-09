import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Companies, QueryModel, ResponseModel } from '../../../../../models';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class RoleService {

    private readonly api = this.url.createUrl('Roles', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Gets roles
     */
    getRoles<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
     * Gets role by Id
     */
    getRoleById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    /**
     * Updates role.
     * @param body payload
     */
    addOrUpdateRole<T extends ResponseModel>(body: Companies): Observable<T> {


        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    /**
     * Removes role.
     * @param body payload
     */
    deleteRole<T extends ResponseModel>(id: number): Observable<T> {

        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }
}
