import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobModeService {

constructor() { }

getList(): Observable<any> {
    return of (List);
}

getListById(id: any): Observable<any> {
    const data = List.find(x => x.id === id);
    return of (data);
}

addOrUpdate(body: any): Observable<any> {
    if (body.id > 0) {
        const data = List.findIndex(x => x.id === body.id);
        const d = List.find(x => x.id === body.id);
        List[data] = body;
        body.sn = d.sn;
        body.id = d.id;
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
        name: 'Manager',
        nameNepali: 'Manager',
        status: 'Active'

    },
    {
        id: 2,
        sn: 2,
        name: 'Director',
        nameNepali: 'Manager',
        status: 'Inactive'

    },
    {
        id: 3,
        sn: 3,
        name: 'Supervisor',
        nameNepali: 'Manager',
        status: 'Active'

    },
    {
        id: 4,
        sn: 4,
        name: 'Bm',
        nameNepali: 'Manager',
        status: 'Active'

    },
    {
        id: 5,
        sn: 5,
        name: 'Md',
        nameNepali: 'Manager',
        status: 'Active'

    },
];
