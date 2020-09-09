import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class OfficeService {
    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getOffices<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getOfficeById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteOffice<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const i = DATA.find(x => x.id === id);
        return of(i);
    }

    deleteListById(id: number): Observable<any> {
        const d = DATA.findIndex(x => x.id === id);
        DATA.splice(d, 1);
        return of(DATA);
    }

    addOrUpdates(body: any): Observable<any> {
        if (body.id > 0) {
            let i = DATA.findIndex(_ => _.id === body.id);
            let d = DATA.find(_ => _.id === body.id);
            DATA[i] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            DATA.push(body);
            body.id = DATA.length + 1;
            body.sn = DATA.length + 1;
            return of(body);
        }
    }
}

let DATA = [
    { id: 12, sn: 1, name: 'बाग्मती सिंचाइ आयोजना, सर्लाही', status: 'Active' },
    { id: 3, sn: 2, name: 'रानी जमरा कुलरिया सिंचाइ आयोजना टिकापुर कैलाली', status: 'Active' },
    { id: 4, sn: 3, name: 'सुनसरी मोरङ सिंचाइ आयोजना बिराटनगर', status: 'Inactive' },
    { id: 5, sn: 4, name: 'नया प्रबिधिमा आधारित सिंचाइ आयोजना ललितपुर', status: 'Active' },
    { id: 6, sn: 5, name: 'नेपाल सिंचाइ सक्टर आ.हालको नाम सिंचाइ तथा जलस्रोत ब्यवस्थापन आयोजना जावलाखेल', status: 'Active' },
    { id: 7, sn: 6, name: 'सिंचाइ सस्थागत विकास आयोजना, ललितपुर', status: 'Active' },
    { id: 8, sn: 7, name: 'बाढी जन्य पुन:निर्माण आयोजना का.ईट् सिंचाइ विभाग', status: 'Active' },
    { id: 9, sn: 8, name: 'सिक्टा सिंचाइ सिंचाइ आयोजना नेपालगुन्ज', status: 'Active' },
    { id: 10, sn: 9, name: 'समुदायम ब्यवस्थित सिचित कृषी छेत्र आयोजना ललितपुर', status: 'Active' },
    { id: 11, sn: 10, name: 'सिंचाइ संभाब्यता अध्ययन तथा अनुगमन मुल्यांकन आयोजना जावलाखेल', status: 'Active' },
    { id: 12, sn: 11, name: 'भेरी बबई डाइभसन् बहुउदेस्यीय  आयोजना सुर्खेत', status: 'Active' },
    { id: 13, sn: 12, name: 'जलसाधन योजना तयारी सुबिधा आयोजना जावलाखेल', status: 'Active' },
    { id: 14, sn: 13, name: 'मझुला सिंचाइ आयोजना सिंचाइ बिभाग', status: 'Active' },
    { id: 15, sn: 14, name: 'सिंचाइ पुन: स्थापना आयोजना सिंचाइ बिभाग जावलाखेल', status: 'Active' },
    { id: 16, sn: 15, name: 'सुनकोशी मरिन डाइभरसन बहुउदेस्यीय आयोजना, जावलाखेल', status: 'Active' },
    { id: 17, sn: 16, name: 'समृद्ध तराई मधेस बिशेस सिंचाइ कार्यक्रम,जावलाखेल', status: 'Active' },
    { id: 18, sn: 17, name: 'जलस्रोत अनुसन्धान तथा विकास केन्द्र पुल्चोक', status: 'Active' },
    { id: 19, sn: 18, name: 'बाग्मती सुधार आयोजना कार्यान्वयन(सिंचाइ युनिट) गुहेस्वरी, काठमाडौँ', status: 'Active' },
    { id: 20, sn: 19, name: 'बबई सिंचाइ आयोजना बैदी, बर्दिया', status: 'Active' },
    { id: 21, sn: 20, name: 'महाकाली  सिंचाइ र तेस्रो चरा समेत प्रदेश नं.७ ', status: 'Active' },
    { id: 22, sn: 21, name: 'भूमिगत जलस्रोत विकास परियोजना, बबरमहल', status: 'Active' },
    { id: 23, sn: 22, name: 'सामुदायिक भूमिगत जल  सिंचाइ सेक्टर आयोजना, धनुषा जनकपुर मिति ०७०।०७१ देखि खारेज', status: 'Active' },
    { id: 24, sn: 23, name: 'भूमिगत जल सिंचाइ आयोजना, चितवन मिति ०७०।०७१  देखि भु.ज.वि.प.फिल्ड का.मोहत्तरी', status: 'Active' },
    { id: 25, sn: 24, name: 'जलस्रोत तथा सिंचाइ बिभाग जावलाखेल', status: 'Active' },
    { id: 26, sn: 25, name: 'सिंचाइ संस्थागत विकास आयोजना, जावलाखेल', status: 'Active' },
    { id: 27, sn: 26, name: 'यान्त्रिक ब्यस्थापन कार्यालय पर्सा', status: 'Active' },
    { id: 28, sn: 27, name: 'कोशी पम्प चन्द्र नहर सिंचाइ ब्यस्थापन कार्यालय, सप्तरी', status: 'Active' },
    { id: 29, sn: 28, name: 'नारायणी सिंचाइ ब्यस्थापन कार्यालय पर्सा', status: 'Active' },
    { id: 30, sn: 29, name: 'बबई सिंचाइ आयोजना, बर्दिया', status: 'Active' },
    { id: 31, sn: 30, name: 'समुदाय ब्यवस्थित सिंचित कृषि क्षेत्र आयोजना', status: 'Active' },
    { id: 32, sn: 31, name: 'सिंचाइ तथा जलस्रोत  ब्यस्थापन आयोजना जावलाखेल', status: 'Active' },
    { id: 33, sn: 32, name: 'प्रगन्ना तथा बड्कापथ सिंचाइ आयोजना दाङ्ग', status: 'Active' },
    { id: 34, sn: 33, name: 'प्रणाली तथा एकिकृत वाली जल ब्यस्थापन कार्यक्रम जावलाखेल', status: 'Active' },
    { id: 35, sn: 34, name: 'महाकाली सिंचाइ आयोजना महेन्द्रनगर, कंचनपुर', status: 'Active' },
    { id: 36, sn: 35, name: 'जलसाधन  योजना तयारी सुबिधा आयोजना,जावलाखेल', status: 'Active' },
];


