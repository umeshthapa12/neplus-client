import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RemunerationService {

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
            List[data] = body;
            body.id = List[data].id;
            body.sn = List[data].sn;
            return of(body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            body.sn = List.length + 1;
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
        id: 1, sn: 1, name: 'Basic Salary', nameNepali: 'Basic Salary', standardSalaryCalDay: '25 days',
        attandanceCalType: 'Work Time', isApplyOT: true, isCountAsEmp: false, isApplyOffDay: true, isOffDayAsOT: false,
        remunerationType: 'Commission', isCheck24hourDuty: true, isNeedLateApproval: false, monthlyOTLimit: true,
        isCheckHalfAttendance: false, isNoAttendance: true, status: 'Active'
    },
    {
        id: 2, sn: 2, name: 'Minimum Wage', nameNepali: 'Minimum Wage', standardSalaryCalDay: '25 days',
        attandanceCalType: 'Over Time', isApplyOT: true, isCountAsEmp: false, isApplyOffDay: true, isOffDayAsOT: false,
        remunerationType: 'Bonous', isCheck24hourDuty: true, isNeedLateApproval: false, monthlyOTLimit: true,
        isCheckHalfAttendance: false, isNoAttendance: true, status: 'Inactive'
    },
    {
        id: 3, sn: 3, name: 'bonuses ', nameNepali: 'bonuses ', standardSalaryCalDay: '25 days',
        attandanceCalType: 'Travel Time', isApplyOT: true, isCountAsEmp: false, isApplyOffDay: true, isOffDayAsOT: false,
        remunerationType: 'Wage', isCheck24hourDuty: true, isNeedLateApproval: true, monthlyOTLimit: true,
        isCheckHalfAttendance: true, isNoAttendance: true, status: 'Active'
    },
];
