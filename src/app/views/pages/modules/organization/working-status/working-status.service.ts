import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkingStatusService {

constructor() { }

getList(): Observable<any> {
    return of (List);
}

getListById(id: number): Observable<any> {
    const data =  List.find(x => x.id === id);
    return of (data);
}

addOrUpdate(body: any): Observable<any> {
    if (body.id > 0) {
        const data = List.findIndex(x => x.id === body.id);
        List[data] = body;
        body.sn = List[data].sn;
        body.id = List[data].id;
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

const List = [
    {id: 1, sn: 1, name: 'worker', nameNepali: 'कामदार', status: 'Active'},
    {id: 2, sn: 2, name: 'employee', nameNepali: 'कर्मचारी', status: 'Active'},
    {id: 3, sn: 3, name: 'self-employed', nameNepali: 'स्वरोजगार', status: 'Inactive'},
    {id: 4, sn: 4, name: 'entrepreneurs ', nameNepali: 'उद्यमीहरू', status: 'Inactive'},
    {id: 5, sn: 5, name: 'wage-labour', nameNepali: 'मजदूरी', status: 'Pending'},
    {id: 6, sn: 6, name: 'self-employed', nameNepali: 'स्वरोजगार', status: 'Active'},
    {id: 7, sn: 7, name: 'self-employed', nameNepali: 'स्वरोजगार', status: 'Active'},
    {id: 8, sn: 8, name: 'self-employed', nameNepali: 'स्वरोजगार', status: 'Active'},
    {id: 9, sn: 9, name: 'self-employed', nameNepali: 'स्वरोजगार', status: 'Active'},
];
