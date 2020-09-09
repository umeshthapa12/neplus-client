import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttendanceGroupService {

    constructor() { }
    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(_ => _.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.sn = d.sn;
            body.id = d.id;
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
        code: 'AG-456',
        name: 'Packaging-Group',
        nameNepali: ' प्याकेजिंग - समूह',
        email: 'pkg@gmail.com',
        description: 'This is the attendance group of the compoany which are responsible form packaging of the product in the company..',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        code: 'AG-401',
        name: 'Production-Group',
        nameNepali: ' उत्पादन समूह',
        email: 'prd@gmail.com',
        description: 'This is the attendance group of the compoany which are responsible form production of the product in the company..',
        status: 'Inactive',
    },
];
