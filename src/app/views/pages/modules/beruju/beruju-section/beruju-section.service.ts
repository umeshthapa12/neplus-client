import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class BerujuSectionService {
    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) { }

    getBerujuSection<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getBerujuSectionById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {
        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteBerujuSection<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        return of(DATA);
    }

    getListById(id: number): Observable<any> {
        const d = DATA.find(s => s.id === id);
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
            return of(body);
        }
    }

}

let DATA = [
    {
        id: 1, sn: 1, sectionNo: '५६४६४५६४५', title: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।',
        content: 'सम्बन्धित आर्थिक वर्षमा नै दुवै कार्यहरुको कार्यसम्पन्न भएता पनि लेखा परीक्षणको समयमा पेस हुन नसकेकोमा हाल उपरोक्त धनकुटा,प्युठानबाट कार्यसम्पन्न भएको प्रतिवेदन थान  २ संलग्न गरिएको छ ।',
        status: 'Active'
    }
];


