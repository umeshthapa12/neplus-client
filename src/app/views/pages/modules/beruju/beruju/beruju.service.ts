import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlCreator, ParamGenService } from '../../../../../../../src/app/utils';
import { ResponseModel, QueryModel } from '../../../../../../../src/app/models';

@Injectable()
export class BerujuService {

    private readonly api = this.url.createUrl('', '');

    constructor(
        private http: HttpClient,
        private url: BaseUrlCreator,
        private paramGen: ParamGenService
    ) {
        const data = JSON.parse(localStorage.getItem('beruju'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('beruju', JSON.stringify([
                {
                    sn: 1,
                    id: 32,
                    name: 'बाग्मती सिंचाइ आयोजना, सर्लाही',
                    uncleanMoney: '४४६३७६८।३',
                    regular: '७८३६५८६९।६९',
                    tax: '६६६६५२।३',
                    mobilization: '८०५७३४८।०७',
                    privilegeMoney: '४१७२७८।८२',
                    persuadeMoney: '२९६९५४१',
                    fiscalYear: 'आर्थिक वर्ष ०७०/७१',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 2,
                    id: 124,
                    name: 'रानी जमरा कुलरिया सिंचाइ आयोजना प्रदेश नं.७',
                    uncleanMoney: '८२३६५५१९३',
                    regular: '४३६७५५८२७।३',
                    tax: '५६५४१३७८२।४',
                    mobilization: '१२३०२१४४३०',
                    privilegeMoney: '१७७५०००',
                    persuadeMoney: '७४९२५९४२१',
                    fiscalYear: 'आर्थिक वर्ष ०७१/७२',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 3,
                    id: 21,
                    name: 'सुनसरी मोरङ सिंचाइ आयोजना बिराटनगर',
                    uncleanMoney: '६१९९६५६।३',
                    regular: '२०६११७३०।५४',
                    tax: '१५७४१०८९।४',
                    mobilization: '५१६५५६७९।१४',
                    privilegeMoney: '०',
                    persuadeMoney: '७१३७१६२८',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 4,
                    id: 672,
                    name: 'नया प्रबिधिमा आधारित सिंचाइ आयोजना ललितपुर',
                    uncleanMoney: '६६४७७।४६',
                    regular: '५३४४०३२३।०८',
                    tax: '४१६४४३',
                    mobilization: '८५८९०',
                    privilegeMoney: '०',
                    persuadeMoney: '५२७६५९४९।१',
                    fiscalYear: 'आर्थिक वर्ष ०७३/७४',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 5,
                    id: 724,
                    name: 'नेपाल सिंचाइ सक्टर आ.हालको नाम सिंचाइ तथा जलस्रोत ब्यवस्थापन आयोजना जावलाखेल',
                    uncleanMoney: '१२१०९३३',
                    regular: '९३३५६२०६।५',
                    tax: '१०४७०७५६।३',
                    mobilization: '२९९१७२५।८८',
                    privilegeMoney: '१४६५०३',
                    persuadeMoney: '२१९६४३३',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 6,
                    id: 525,
                    name: 'सिंचाइ सस्थागत विकास आयोजना, ललितपुर',
                    uncleanMoney: '१७२६४५।५४',
                    regular: '१३६७७६३०।८९',
                    tax: '१९७५४४।६७',
                    mobilization: '०',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७०/७१',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 7,
                    id: 325,
                    name: 'बाढी जन्य पुन:निर्माण आयोजना का.ईट् सिंचाइ विभाग',
                    uncleanMoney: '१२३६७००',
                    regular: '३६५५२०',
                    tax: '०',
                    mobilization: '०',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७१/७२',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 8,
                    id: 802,
                    name: 'सिक्टा सिंचाइ सिंचाइ आयोजना नेपालगुन्ज',
                    uncleanMoney: '१०८६०२५५',
                    regular: '५९३९५२२४।६९',
                    tax: '८६६५९०६।१९',
                    mobilization: '२६३६४४४४५।९',
                    privilegeMoney: '३८४२३९२।५',
                    persuadeMoney: '५२०९३११',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 9,
                    id: 987,
                    name: 'समुदायम ब्यवस्थित सिचित कृषी छेत्र आयोजना ललितपुर',
                    uncleanMoney: '१३८४०१६।२',
                    regular: '४६८१९४१०४।६',
                    tax: '४४५४६५।५',
                    mobilization: '३४००४४७८',
                    privilegeMoney: '०',
                    persuadeMoney: '३९२५८४७०',
                    fiscalYear: 'आर्थिक वर्ष ०७३/७४',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 10,
                    id: 617,
                    name: 'सिंचाइ संभाब्यता अध्ययन तथा अनुगमन मुल्यांकन आयोजना जावलाखेल',
                    uncleanMoney: '१४३१०६।९७',
                    regular: '८३५३३२४।८८',
                    tax: '१३३४७९',
                    mobilization: '८१५१७।५',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 11,
                    id: 513,
                    name: 'भेरी बबई डाइभसन् बहुउदेस्यीय  आयोजना सुर्खेत',
                    uncleanMoney: '८७०५५९।५',
                    regular: '१२१९६०३६',
                    tax: '५६०१९७।६४',
                    mobilization: '९६४१८४७७८।४',
                    privilegeMoney: '०',
                    persuadeMoney: '३३९२६४५९',
                    fiscalYear: 'आर्थिक वर्ष ०७०/७१',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 12,
                    id: 789,
                    name: 'जलसाधन योजना तयारी सुबिधा आयोजना जावलाखेल',
                    uncleanMoney: '१७४८०५',
                    regular: '२३९१८४०९।६८',
                    tax: '२२४२१६८९',
                    mobilization: '२००४१९५७।०८',
                    privilegeMoney: '०',
                    persuadeMoney: '१४३८०७८३',
                    fiscalYear: 'आर्थिक वर्ष ०७१/७२',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 13,
                    id: 994,
                    name: 'मझुला सिंचाइ आयोजना सिंचाइ बिभाग',
                    uncleanMoney: '६४८३७।५',
                    regular: '५८४१४४२',
                    tax: '२८०३५३',
                    mobilization: '०',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 14,
                    id: 51,
                    name: 'सिंचाइ पुन: स्थापना आयोजना सिंचाइ बिभाग जावलाखेल',
                    uncleanMoney: '०',
                    regular: '१९६०८५०',
                    tax: '०',
                    mobilization: '२०००००',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७३/७४',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 15,
                    id: 621,
                    name: 'सुनकोशी मरिन डाइभरसन बहुउदेस्यीय आयोजना, जावलाखेल',
                    uncleanMoney: '०',
                    regular: '०',
                    tax: '०',
                    mobilization: '०',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 16,
                    id: 512,
                    name: 'समृद्ध तराई मधेस बिशेस सिंचाइ कार्यक्रम,जावलाखेल',
                    uncleanMoney: '०',
                    regular: '८४४८३५५',
                    tax: '०',
                    mobilization: '०',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 17,
                    id: 215,
                    name: 'जलस्रोत अनुसन्धान तथा विकास केन्द्र पुल्चोक',
                    uncleanMoney: '१६४१५५',
                    regular: '०',
                    tax: '०',
                    mobilization: '४५४९३।०२',
                    privilegeMoney: '०',
                    persuadeMoney: '७०३५३',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 18,
                    id: 212,
                    name: 'बाग्मती सुधार आयोजना कार्यान्वयन(सिंचाइ युनिट) गुहेस्वरी, काठमाडौँ',
                    uncleanMoney: '०',
                    regular: '२५८४१९५',
                    tax: '०',
                    mobilization: '०',
                    privilegeMoney: '०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 19,
                    id: 4155,
                    name: 'बबई सिंचाइ आयोजना बैदी, बर्दिया',
                    uncleanMoney: '२०४९३१७।४',
                    regular: '२१७९८०२६।३६',
                    tax: '७३९०३६।४८',
                    mobilization: '१०२७२१५१८।८',
                    privilegeMoney: '४३१३८',
                    persuadeMoney: '३५७३१०९३',
                    fiscalYear: 'आर्थिक वर्ष ०७४/७५',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 20,
                    id: 142,
                    name: 'महाकाली  सिंचाइ र तेस्रो चरा समेत प्रदेश नं.७ ',
                    uncleanMoney: '३०७८०७७।६',
                    regular: '८२५२०५',
                    tax: '१०६४८।५',
                    mobilization: '२४२२२०००',
                    privilegeMoney: '६७५६०',
                    persuadeMoney: '४५५००००',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 21,
                    id: 221,
                    name: 'भूमिगत जलस्रोत विकास परियोजना, बबरमहल',
                    uncleanMoney: '२३३३४६।५१',
                    regular: '१२८२३८७।२',
                    tax: '०',
                    mobilization: '०',
                    privilegeMoney: '६२४७७९।२७',
                    persuadeMoney: '३४३५२०',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 22,
                    id: 1241,
                    name: 'सामुदायिक भूमिगत जल  सिंचाइ सेक्टर आयोजना, धनुषा जनकपुर मिति ०७०।०७१ देखि खारेज ',
                    uncleanMoney: '१३३३६८।५',
                    regular: '१४१७८६७',
                    tax: '६५४७८३।९३',
                    mobilization: '७३५०९७',
                    privilegeMoney: '३३३३८०',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 23,
                    id: 41,
                    name: 'भूमिगत जल सिंचाइ आयोजना, चितवन मिति ०७०।०७१  देखि भु.ज.वि.प.फिल्ड का.मोहत्तरी',
                    uncleanMoney: '१८००',
                    regular: '५८६८२४८५।८६',
                    tax: '८१३२३।९',
                    mobilization: '०',
                    privilegeMoney: '१४५५२९।६१',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
                {
                    sn: 24,
                    id: 122,
                    name: 'जलस्रोत तथा सिंचाइ बिभाग जावलाखेल',
                    uncleanMoney: '३६९७३५।९१',
                    regular: '१२४७५६९।१३',
                    tax: '८८५५',
                    mobilization: '४०००',
                    privilegeMoney: '२२५२६।३',
                    persuadeMoney: '०',
                    fiscalYear: 'आर्थिक वर्ष ०७२/७३',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
            ]));
        } else if (data === null) {
            localStorage.setItem('beruju', JSON.stringify([
                {
                    sn: 1,
                    id: 32,
                    name: 'बाग्मती सिंचाइ आयोजना, सर्लाही',
                    uncleanMoney: '४४६३७६८।३',
                    regular: '७८३६५८६९।६९',
                    tax: '६६६६५२।३',
                    mobilization: '८०५७३४८।०७',
                    privilegeMoney: '४१७२७८।८२',
                    persuadeMoney: '२९६९५४१',
                    fiscalYear: 'आर्थिक वर्ष ०७०/७१',
                    berujuSection: 'कार्यसम्पन्न प्रतिबेदन पेस नभएकोले पेस गर्नु पर्ने।'
                },
            ]));
        }
    }

    getBeruju<T extends ResponseModel>(params?: QueryModel): Observable<T> {

        const p = this.paramGen.createParams(params);
        return this.http.get<T>(`${this.api}/Get`, { params: p });
    }

    getBerujuById<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.get<T>(`${this.api}/Get/${id}`);
    }
    getBerujuByGuid<T extends ResponseModel>(guid: string): Observable<T> {
        return this.http.get<T>(`${this.api}/GetLazy/${guid}`);
    }

    addOrUpdate<T extends ResponseModel>(body: any): Observable<T> {

        return body.id > 0
            ? this.http.put<T>(`${this.api}/Update`, body)
            : this.http.post<T>(`${this.api}/Create`, body);
    }

    deleteBeruju<T extends ResponseModel>(id: number): Observable<T> {
        return this.http.delete<T>(`${this.api}/Delete/${id}`);
    }

    getList(): Observable<any> {
        let data = JSON.parse(localStorage.getItem('beruju'));
        return of(data);
    }

    getListById(id: number): Observable<any> {
        let data = JSON.parse(localStorage.getItem('beruju'));
        const l = data.find(x => x.id === id);
        return of(l);
    }

    delete(id: number): Observable<any> {
        let data = JSON.parse(localStorage.getItem('beruju'));
        let i = data.findIndex(_ => _.id === id);
        data.splice(i, 1);
        localStorage.setItem('beruju', JSON.stringify(data));
        return of(i);
    }

    addOrUpdates(body: any): Observable<any> {
        let data = JSON.parse(localStorage.getItem('beruju'));
        if (body.id > 0) {
            let i = data.findIndex(_ => _.id === body.id);
            let d = data.find(_ => _.id === body.id);
            data[i] = body;
            body.id = d.id;
            body.sn = d.sn;
            localStorage.setItem('beruju', JSON.stringify(data));
            return of(body);
        } else {
            data.push(body);
            body.id = data.length + 1;
            body.sn = data.length + 1;
            localStorage.setItem('beruju', JSON.stringify(data));
            return of(body);
        }
    }

}
