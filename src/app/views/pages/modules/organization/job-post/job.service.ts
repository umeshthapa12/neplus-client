import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {

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
        List[data] =  body;
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
    List.splice(index, 1);
    return of (List);
}

}


let List = [
    {id: 1, sn: 1, name: 'Stockbroker', nameNepali: 'Stockbroker', status: 'Active'},
    {id: 2, sn: 2, name: 'Credit analyst', nameNepali: 'Credit analyst', status: 'Inactive'},
    {id: 3, sn: 3, name: 'Staffing consultant', nameNepali: 'Staffing consultant', status: 'Active'},
    {id: 4, sn: 4, name: 'Financial analyst', nameNepali: 'Financial analyst', status: 'Pending'},
    {id: 5, sn: 5, name: 'Loan officer', nameNepali: 'Loan officer', status: 'Approve'},
    {id: 6, sn: 6, name: 'Tax specialist', nameNepali: 'Tax specialist', status: 'Pending'},
    {id: 7, sn: 7, name: 'HR specialist', nameNepali: 'HR specialist', status: 'Active'},
];
