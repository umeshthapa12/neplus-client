import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Companies, MailTemplate, QueryModel, ResponseModel } from '../../../../../models';
import { DropdownModel } from '../../../../../services';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class MailTemplateService {

    private readonly api = this.url.createUrl('MailTemplate', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Async validator to validate template title exist
     */
    titleValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

            const changed = !control.pristine && control.dirty;
            if (!changed && (control.value || '').trim().length <= 0) { return of(null); }

            return timer(800).pipe(
                switchMap(_ => this.http.get(`${this.api}/Lookup?q=${control.value}&id=${control.parent.get('id').value}`)),
                catchError(_ => of({ conflict: true })),
                map((error: any) => error && error.conflict ? error : null)
            );
        };
    }

    /**
     * Gets templates
     */
    getTemplates<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
     * Gets template by Id
     */
    getTemplate = <T extends ResponseModel>(id: number, guid: string) => this.http.get<T>(`${this.api}/Get/${id}/${guid}`);

    /**
    * Gets employers
    */
    getEmployers = () => this.http.get<DropdownModel>(`${this.api}/GetEmployers`);


    /**
    * Gets default mail titles to map auto response mail body
    */
    getDefaultMailTitles = () => this.http.get<ResponseModel>(`${this.api}/GetTitles`)
        .pipe(map(_ => {
            const d: any[] = _.contentBody;
            return d.map(t => ({ key: t.title, value: t.title, taken: t.taken }));
        }))

    /**
     * Updates template.
     * @param body payload
     */
    addOrUpdateTemplate<T extends ResponseModel>(body: Companies): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    /**
    * Updates template's status
    * @param body payload
    */
    updateStatus = <T extends ResponseModel>(body: MailTemplate) => this.http.put<T>(`${this.api}/UpdateStatus`, body);

    /**
     * Removes mail template
     * @param id element Id
     * @param guid user unique Id (Guid)
     */
    deleteTemplate = <T extends ResponseModel>(id: number, guid: string) => this.http.delete<T>(`${this.api}/Delete/${id}/${guid}`);

}
