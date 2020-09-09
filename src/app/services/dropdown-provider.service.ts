import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrlCreator } from '../utils';

@Injectable({ providedIn: 'root' })
export class DropdownProviderService {


    private url = this.helper.createUrl('Dropdowns', 'Shared');

    constructor(
        private http: HttpClient,
        private helper: BaseUrlCreator) { }

    getCountries<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetCountries`);
    }

    getProvinces<T extends DropdownModel[]>(countryId: number): Observable<T> {
        return this.http.get<T>(`${this.url}/GetProvinces/${countryId}`);
    }

    getDistricts<T extends DropdownModel[]>(provinceId: number): Observable<T> {
        return this.http.get<T>(`${this.url}/GetDistricts/${provinceId}`);
    }

    getMunicipalities<T extends DropdownModel[]>(countryId: number, provinceId: number, districtId: number): Observable<T> {
        return this.http.get<T>(`${this.url}/GetMunicipalities/${countryId}/${provinceId}/${districtId}`);
    }

    getDepartments<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetDepartments`);
    }

    GetDesignations<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetDesignations`);
    }

    getJobCategories<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetJobCategory`);
    }

    getJobLocations<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetJobLocations`);
    }

    getGender<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetGender`);
    }

    getSalutation<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetSalutation`);
    }

    getMaritalStatus<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetMaritalStatus`);
    }

    getStages<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetStages`);
    }

    getQualifications<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetQualifications`);
    }

    getStudyModes<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetStudyModes`);
    }

    getCompanyTypes<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetCompanyTypes`);
    }

    getMailTemplateTitles<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetMailTemplateTitles`);
    }

    getMailTemplateBody<T extends DropdownModel[]>(templateId: number): Observable<T> {
        return this.http.get<T>(`${this.url}/GetMailTemplateTitles/${templateId}`);
    }

    getExperienceLevel<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetExperienceLevel`);
    }

    getReligion<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetReligion`);
    }

    getJobTypes<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetJobTypes`);
    }

    getFilterConditions<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetFilterConditions`);
    }

    getRoles<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetRoles`);
    }

    getStatus<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetStatus`);
    }

    getSysModuleNames<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetSysModuleNames`);
    }

    getAppRouteTypes<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetAppRouteTypes`);
    }
    getApiAreaNames<T extends DropdownModel[]>(): Observable<T> {
        return this.http.get<T>(`${this.url}/GetAreaNames`);
    }
}

/**
 *  key/value pair Dropdown model
 */
export interface DropdownModel {

    /**
     * Primary key for internal use
     */
    key?: number | string;

    /**
     * Display text
     */
    value?: string;
}
