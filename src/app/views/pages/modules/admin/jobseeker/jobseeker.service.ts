import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Companies, QueryModel, ResponseModel } from '../../../../../models';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class JobSeekerService {

    private readonly api = this.url.createUrl('JobSeekers', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Gets jobseekers
     */
    getJobSeekers<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
     * Gets job seeker by Id
     */
    getJobSeekerById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

     /**
     * Gets job seeker by Guid
     */
    getJobSeekerByGuid<T extends ResponseModel>(guid: string): Observable<T> {
        return this.http.get<T>(`${this.api}/GetLazy/${guid}`);
    }


    /**
     * Updates job seeker.
     * @param body payload
     */
    addOrUpdateJobSeeker<T extends ResponseModel>(body: Companies): Observable<T> {
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
     * Removes job seeker.
     * @param body payload
     */
    deleteJobSeeker<T extends ResponseModel>(id: number): Observable<T> {

        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }
}
