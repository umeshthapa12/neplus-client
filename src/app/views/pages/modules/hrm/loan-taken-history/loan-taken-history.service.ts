import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoanTakenHistoryService {

constructor() { }
getList(): Observable<any> {
    return of (List);
}

getListById(id: number): Observable<any> {
    const data = List.find(x => x.id === id);
    return of (data);
}

addOrUpdate(body: any): Observable<any> {
    if (body.id > 0) {
        const data = List.findIndex(x => x.id === body.id);
        const d = List.find(x => x.id === body.id);
        List[data] = body;
        body.id = d.id;
        body.sn = d.sn;
        return of (body);
    } else {
        List.push(body);
        body.sn = List.length + 1;
        body.id = List.length + 1;
        return of (body);
    }
}
delete(id: number): Observable<any> {
    const index = List.findIndex(x => x.id === id);
    List.splice(index, 1);
    return of (List);
}

}

let List = [
    {
        id: 1,
        sn: 1,
        empCode: 'e-399',
        loan: 'Home Loans',
        takenDate: '1998/03/18',
        takenDateNepali: '2054/12/05',
        dueDate: '2021/01/12',
        dueDateNepali: '2078/10/17',
        loanClearStatus: 'Pending',
        clearDate: '2021/01/26',
        clearDateNepali: '2078/01/27',
        loanAmount: '500000',
        description: 'This is the history of the Loan Taken by the employee...',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'e-310',
        loan: 'Car Loans',
        takenDate: '1998/03/18',
        takenDateNepali: '2054/12/05',
        dueDate: '2021/01/12',
        dueDateNepali: '2078/10/17',
        loanClearStatus: 'Active',
        clearDate: '2021/01/26',
        clearDateNepali: '2078/01/27',
        loanAmount: '500000',
        description: 'This is the history of the Loan Taken by the employee...',
        status: 'Active',
    },
];
