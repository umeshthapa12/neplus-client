import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PerformanceService {

    constructor() { }
    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            List.push(body);
            body.sn = List.length + 1;
            body.id = List.length + 1;
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);
    }

}


let List = [
    {
        id: 1,
        sn: 1,
        empCode: 'e200',
        supervisorMarks: '78',
        dateFrom: '2067/02/03',
        dateFromNepali: '2067/02/08',
        dateTo: '2087/02/03',
        dateToNepali: '2087/02/03',
        reviewerMarks: '90',
        reviewCommitteeMarks: '89',
        performanceRemarks: 'The performance is Good of the Employede In Organization...',
        appraisalRating: 'Top',
        fiscalYear: '2077/78',
        appraisal: 'Very Good',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'e260',
        supervisorMarks: '76',
        dateFrom: '2067/02/03',
        dateFromNepali: '2067/02/08',
        dateTo: '2087/02/03',
        dateToNepali: '2087/02/03',
        reviewerMarks: '90',
        reviewCommitteeMarks: '89',
        performanceRemarks: 'The performance is Good of the Employede In Organization...',
        appraisalRating: 'Top',
        fiscalYear: '2078/79',
        appraisal: 'Very Good',
        status: 'Active',
    }
];
