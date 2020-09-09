import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PermissionData, QueryModel, ResponseModel, UserAccount } from '../../../../../models';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class UserService {

    private readonly api = this.url.createUrl('Users', 'Admin');
    private readonly permissionApi = this.url.createUrl('Permission', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Async validator to validate username exist
     */
    userValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

            const changed = !control.pristine && control.dirty;

            if (!changed) { return of(null); }

            return timer(800).pipe(
                switchMap(_ => this.lookup(control.value, control.parent.get('id').value)),
                catchError(_ => of({ conflict: true } as any)),
                map(error => error && error.conflict ? error : null)
            );
        };
    }

    /**
     * Gets users
     */
    getUsers<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
     * Gets an user by Id
     */
    getUserById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    /**
    * Gets an user by Guid
    */
    getUserByGuid<T extends ResponseModel>(guid: string): Observable<T> {
        return this.http.get<T>(`${this.api}/GetLazy/${guid}`);
    }

    /**
     * Gets permission data
     * @param guid if provided, permission will be validated and returned.
     */
    getPermissionData<T extends ResponseModel>(guid?: string): Observable<T> {
        return this.http.get<T>(`${this.permissionApi}/Get/${(guid || '')}`);
    }

    /**
    * Gets an user by Guid
    */
    lookup<T extends ResponseModel>(query: string, id?: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Lookup?q=${query}&id=${id}`);
    }

    /**
     * Updates an user.
     * @param body payload
     */
    addOrUpdate<T extends ResponseModel>(body: UserAccount): Observable<T> {

        const payload = {
            // login account
            userAccount: {
                id: body.accountId,
                userGuid: body.guid,
                username: body.username,
                password: body.password,
                roleId: body.roleId,
            },
            // user info
            personalInfo: {
                id: body.id,
                guid: body.guid,
                fName: body.fName,
                mName: body.mName,
                lName: body.lName,
                dateOfBirth: body.dateOfBirth,
                gender: body.gender,
                address: body.address,
                email: body.email
            },
            // user contacts
            phoneNumbers: body.phoneNumbers
        };

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, payload)
            : this.http.post<T>(`${this.api}/Create`, payload);
    }

    /**
     * adds or updates user permission data
     * @param body payload
     */
    updatePermission<T extends ResponseModel>(body: PermissionData[]): Observable<T> {
        return this.http.put<T>(`${this.api}/UpdatePermissions`, body);
    }

    /**
     * Updates user's account status
     * @param body payload
     */
    updateStatus<T extends ResponseModel>(body: UserAccount): Observable<T> {
        return this.http.put<T>(`${this.api}/UpdateStatus`, body);
    }


    /**
     * Removes an user.
     * @param body payload
     */
    deleteUser<T extends ResponseModel>(id: number): Observable<T> {

        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }
}
