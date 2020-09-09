import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceMonthlyService {

constructor() { }

getList(): Observable<any> {
    return of (List);
}

getListById(id: number): Observable<any> {
    const data  = List.find(x => x.id === id);
    return of (data);
}

addOrUpdate(body: any): Observable<any> {
    if (body.id > 0) {
        const data = List.findIndex(x => x.id ===  body.id);
        const d = List.find(x => x.id === body.id);
        List[data] = body;
        body.id = d.id;
        body.sn = d.sn;
        return of (body);
    } else {
        List.push(body);
        body.id = List.length + 1;
        body.sn = List.length + 1;
        return of (body);
    }
}

delete(id: number): Observable<any> {
    const index = List.findIndex(x => x.id === id);
    List.splice(index , 1);
    return of (List);
}

}


let List = [
    {
        id: 1,
        sn: 1,
        empCode: 'E-454',
        attendanceSheet: 'Manual',
        fiscalYear: '2077/2078',
        salaryMonthNo: '10 month',
        salaryYear: '2077',
        monthOrder: 'Starting',
        totalDaysInMonth: '30 days',
        totalWorkingDays: '25 days',
        leaveDays: '5 days',
        absentDays: '3 days',
        totalHolidays: '5 days',
        totalWorkedDays: '20',
        totalSalaryDays: '25 days',
        allowanceDays: '5 days',
        leaveWOPDays: '4 days',
        adjDays: '3 days',
        dateFrom: '2020/12/12',
        dateFromNepali: '2077/12/12',
        dateTo: '2022/12/12',
        dateToNepali: '2079/12/12',
        leaveDifferentFromSalaryPeriod: '4 days',
        leaveDateFrom: '2020/12/12',
        leaveDateFromNepali: '2077/12/13',
        leaveDateTo: '2021/01/12',
        leaveDateToNepali: '2079/01/09',
        overTime: '6 days',
        leaveDetails: 'This is the leave Details..',
        fieldWorkDays: '28 days',
        offDayPresent: '2 day',
        attendance: 'Finger Print',
        offDayOT: '4 days',
        dailyHour: '12 hours',
        monthlyAttendanceMaster: 'MN-675',
    },
]
