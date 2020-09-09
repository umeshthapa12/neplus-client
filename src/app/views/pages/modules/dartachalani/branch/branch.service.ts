import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class BranchService {

    constructor() {

        const data = JSON.parse(localStorage.getItem('branch'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('branch', JSON.stringify([
                { id: 31, sn: 1, name: 'काठमाडौँ' },
                { id: 311, sn: 2, name: 'कास्की' },
                { id: 422, sn: 3, name: 'मोरंग' },
                { id: 532, sn: 4, name: 'कन्द्रिय समन्वय इकाई' },
                { id: 234, sn: 5, name: 'स्थानीय तह समन्वय शाखा' },
                { id: 1242, sn: 6, name: 'प्रसासन योजना महाशाखा' },
                { id: 4312, sn: 7, name: 'आर्थिक प्रसासन महाशाखा' },
            ]));
        } else if (data === null) {
            localStorage.setItem('branch', JSON.stringify([
                { id: 31, sn: 1, name: 'काठमाडौँ' },
                { id: 311, sn: 2, name: 'कास्की' },
                { id: 422, sn: 3, name: 'मोरंग' },
                { id: 532, sn: 4, name: 'कन्द्रिय समन्वय इकाई' },
                { id: 234, sn: 5, name: 'स्थानीय तह समन्वय शाखा' },
                { id: 1242, sn: 6, name: 'प्रसासन योजना महाशाखा' },
                { id: 4312, sn: 7, name: 'आर्थिक प्रसासन महाशाखा' },
            ]));
        }
    }

    getList(): Observable<any> {
        let data = JSON.parse(localStorage.getItem('branch'));
        return of(data);
    }

    delete(id: number): Observable<any> {
        let data = JSON.parse(localStorage.getItem('branch'));
        let v = data.findIndex(_ => _.id === id);
        data.splice(v, 1);
        localStorage.setItem('branch', JSON.stringify(data));
        return of(data);
    }

    getListById(id: number): Observable<any> {
        let data = JSON.parse(localStorage.getItem('branch'));
        let v = data.find(_ => _.id === id);
        return of(v);
    }

    add(data: any): Observable<any> {
        let d = JSON.parse(localStorage.getItem('branch'));
        d.push(data);
        data.id = d.length + 1;
        localStorage.setItem('branch', JSON.stringify('d'));
        return of(d);
    }
}


