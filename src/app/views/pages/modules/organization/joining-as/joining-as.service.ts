import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JoiningAsService {

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
    {id: 1, sn: 1, name: 'Full Timer', nameNepali: 'Full Timer', status: 'Active'},
    {id: 2, sn: 2, name: 'Contract', nameNepali: 'Contract', status: 'Inactive'},
    {id: 3, sn: 3, name: 'Internship', nameNepali: 'Internship', status: 'Approve'},
    {id: 4, sn: 4, name: 'Wall-in', nameNepali: 'Walk-in', status: 'Pending'},
    {id: 5, sn: 5, name: 'Commission', nameNepali: 'Commission', status: 'Reject'},
    {id: 6, sn: 6, name: 'As-Helper', nameNepali: 'As-Helper', status: 'Approve'}
];
