import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

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
    {id: 1, sn: 1, name: 'Supply', nameNepali: 'Supply', parentDepartment: 'Manufacturing', status: 'Active'},
    {id: 2, sn: 2, name: 'Store', nameNepali: 'Store', parentDepartment: 'Manufacturing', status: 'Inactive'},
    {id: 3, sn: 3, name: 'Production', nameNepali: 'Production', parentDepartment: 'Manufacturing', status: 'Pending'},
    {id: 4, sn: 4, name: 'Packaging', nameNepali: 'Packaging', parentDepartment: 'Manufacturing', status: 'Approved'},
    {id: 5, sn: 5, name: 'Billing', nameNepali: 'Billing', parentDepartment: 'Shaling', status: 'Active'},
];
