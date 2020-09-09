import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../../src/app/models';

@Injectable()
export class BerujuAuditService {

    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getBerujuAudits<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getBerujuAuditById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteBerujuAudit<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList() {
        return of(DATA);
    }

    getListById(id: number) {
        const x = DATA.find(_ => _.id === id);
        return of(x);
    }

    getListByTitle(data: any): Observable<any> {
        const d = DATA.find(_ => _.title === data);
        return of(d);
    }

    deleteList(id: number): Observable<any> {
        let i = DATA.findIndex(_ => _.id === id);
        DATA.splice(i, 1);
        return of(DATA);
    }

    addOrUpdates(body: any): Observable<any> {
        if (body.id > 0) {
            let i = DATA.findIndex(_ => _.id === body.id);
            let d = DATA.find(_ => _.id === body.id);
            DATA[i] = body;
            body.sn = d.sn;
            body.id = d.id;
            localStorage.setItem('ba', JSON.stringify(DATA));
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
    {
        id: 1, sn: 1, title: 'निबेदन पत्र', letterNo: 'प.सं.:- {{२०७५/७६}}', address: '{{श्री महालेखा परिक्षकको कार्यालय, उर्जा / सिंचाइ निर्देशनालय, पुल्चोक ।}}',
        subject: 'बिषय: {{बेरुजु संपरीक्षण गरिदिने बारे।}}', date: 'मिति: {{2019/12/09}}', heading: 'नेपाल सरकार सिंचाइ मन्त्रयालय सिंचाइ बिभाग जावलाखेल',
        companyAddress: 'बोधार्थ तथा कार्याथ:- श्री उर्जा, जलश्रोत तथा सिंचाइ मन्त्रालय, सिहदरबार, काठमाडौँ ।',
        address1: 'श्री सिंचाइ संस्थागत विकास आयोजना, जावलाखेल',
        sender: 'महा-निर्देशक सिंचाइ बिभाग',
        body:
            'महालेखा परिक्षकको बार्षिक प्रतिवेदन ०७२ मा समाबेस भएको सिंचाइ संस्थागत विकास आयोजना जावलाखेल संग सम्बन्धित आ.व. २०७१/७२ विनियोजन तर्फको बजेट उ.शी.नं. ३५७१०२४ पुंजीगत तर्फको निम्न बेरुजु आर्थिक  कार्यविधि ऐन, २०५५ को दफा १८ बमोजिम फछ्यौट गरिएकाले फछ्यौटका प्रमाण सहित दफा १९ बमोजिम संपरीक्षणको लागि अनुरोध छ ।',
        status: 'Active'
    }
]
