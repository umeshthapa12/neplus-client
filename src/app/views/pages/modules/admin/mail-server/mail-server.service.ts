import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailServer, QueryModel, ResponseModel } from '../../../../../models';
import { DropdownModel } from '../../../../../services';
import { BaseUrlCreator, ParamGenService } from '../../../../../utils';

@Injectable()
export class MailServerService {

    private readonly api = this.url.createUrl('MailServer', 'Admin');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    /**
     * Gets mail servers
     */
    getMailServers<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    /**
     * Gets mail server by Id
     */
    getMailServerById = <T extends ResponseModel>(id: number, userGuid: string) => this.http.get<T>(`${this.api}/Get/${id}/${userGuid}`);

    /**
     * Gets employers
     */
    getEmployers = (): Observable<DropdownModel> => this.http.get<DropdownModel>(`${this.api}/GetEmployers`);

    /**
     * Updates mail server.
     * @param body payload
     */
    addOrUpdateMailServer<T extends ResponseModel>(body: MailServer): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    /**
    * Updates row order
    * @param body payload
    */
    updateOrder = <T extends ResponseModel>(body: { prevId: number, prevOrder: number, currentId: number, currentOrder: number }) => {

        if (!(body.prevId > 0 && body.currentId)) { throw new Error('Previous ID and Current ID has not supplied'); }

        return this.http.put<T>(`${this.api}/UpdateOrder`, body);
    }

    /**
    * Updates mail server's status
    * @param body payload
    */
    updateStatus = <T extends ResponseModel>(body: MailServer) => this.http.put<T>(`${this.api}/UpdateSingle`, body);

    /**
    * Updates mail server's status
    * @param body payload
    */
    testConnection = <T extends ResponseModel>(body: MailServer) => this.http.post<T>(`${this.api}/TestConnection`, body);

    /**
     * Removes mail server.
     * @param body payload
     */
    deleteMailServer = <T extends ResponseModel>(id: number, userGuid: string) => this.http.delete<T>(`${this.api}/Delete/${id}/${userGuid}`);

}
