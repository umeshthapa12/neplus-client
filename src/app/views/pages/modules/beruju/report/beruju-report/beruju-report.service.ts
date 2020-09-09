import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../../src/app/models';

@Injectable()
export class BerujuReportService {
    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getBerujuReports<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getBerujuReportById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteBerujuReport<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const d = DATA.find(x => x.id === id);
        return of(d);
    }

    deleteList(id: number): Observable<any> {
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
            localStorage.setItem('br', JSON.stringify(DATA));
            return of(body);
        }
    }

}

let DATA = [
    {
        id: 1, sn: 1, name: 'सिंचाइ संस्थागत विकास आयोजना, जावलाखेल', sectionNo: '23', totalMoney: '१७३७८२१।१',
        persuadeMoney: '८९४२९८।६७', balance: '८४३५२२।४३'
    },
    {
        id: 11, sn: 2, name: 'यान्त्रिक ब्यस्थापन कार्यालय पर्सा', sectionNo: '23', totalMoney: '१७४१३८५।७६',
        persuadeMoney: '०', balance: ' १७४१३८५।७६'
    },
    {
        id: 111, sn: 3, name: 'कोशी पम्प चन्द्र नहर सिंचाइ ब्यस्थापन कार्यालय, सप्तरी', sectionNo: '23', totalMoney: '३२५०२०६८।४४',
        persuadeMoney: '९३४२२९१।९४', balance: '२३१५९७७।५'
    },
    {
        id: 1111, sn: 4, name: 'नारायणी सिंचाइ ब्यस्थापन कार्यालय पर्सा', sectionNo: '23', totalMoney: '५४८९९९०६।७६',
        persuadeMoney: '२८६४७९०३।०१', balance: '२६२५२००३।७५'
    },
    {
        id: 11111, sn: 5, name: 'रानी जमरा कुलरिया सिंचाइ आयोजना टिकापुर कैलाली', sectionNo: '23', totalMoney: '२७०६४२३२०२',
        persuadeMoney: '१६७७४३९८९७', balance: '१०२८९८३३०५'
    },
    {
        id: 111111, sn: 6, name: 'बबई सिंचाइ आयोजना, बर्दिया', sectionNo: '23', totalMoney: '१२७३५१०३७।३',
        persuadeMoney: '३५९८६८९२।७३', balance: '९१३६४१४४।५५'
    },
    {
        id: 1111111, sn: 7, name: 'समुदाय ब्यवस्थित सिंचित कृषि क्षेत्र आयोजना', sectionNo: '23', totalMoney: '५०४०२८०६४।३',
        persuadeMoney: '३९२७२५७०', balance: '४६४७५५४९४।३'
    },
    {
        id: 11111111, sn: 8, name: 'सिंचाइ तथा जलस्रोत  ब्यस्थापन आयोजना जावलाखेल', sectionNo: '23', totalMoney: '१०८५४७६७५।७',
        persuadeMoney: '७०२८५७३।०६', balance: '१०१५१९१०२।७'
    },
    {
        id: 2, sn: 9, name: 'प्रगन्ना तथा बड्कापथ सिंचाइ आयोजना दाङ्ग', sectionNo: '23', totalMoney: '२१८३८९१८।२९',
        persuadeMoney: '१८०२७७२८', balance: '३८१११९०।२९'
    },
    {
        id: 22, sn: 10, name: 'प्रणाली तथा एकिकृत वाली जल ब्यस्थापन कार्यक्रम जावलाखेल', sectionNo: '23', totalMoney: '६२१८०२६।३८ ',
        persuadeMoney: '०', balance: '६२१८०२६।३८'
    },
    {
        id: 222, sn: 11, name: 'महाकाली सिंचाइ आयोजना महेन्द्रनगर, कंचनपुर', sectionNo: '23', totalMoney: '८६१६०७७१।९२',
        persuadeMoney: '१४३५६४००', balance: '७१८०४३७१।९२'
    },
    {
        id: 2222, sn: 12, name: 'बाग्मती सिंचाइ आयोजना, कर्मैया  सर्लाही', sectionNo: '23', totalMoney: '९१९७०९१७।१५',
        persuadeMoney: '२९६९५४१', balance: '८९००१३७६।१५'
    },
    {
        id: 22222, sn: 13, name: 'जलसाधन  योजना तयारी सुबिधा आयोजना,जावलाखेल', sectionNo: '23', totalMoney: '६६५५६८६०।७६',
        persuadeMoney: '५४५५०९५५।०८', balance: '१२००५९०५।६८'
    },
]



