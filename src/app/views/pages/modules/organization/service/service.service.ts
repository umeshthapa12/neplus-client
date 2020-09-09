import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

constructor() { }
getList(): Observable<any> {
    return of (List);
}

getListById(id: number): Observable<any> {
    const data = List.find(x => x.id === id);
    return of (data);
}

addOrUpdate(body: any) {
    if (body.id > 0) {
        const data = List.findIndex(x => x.id === body.id);
        List[data] = body;
        body.id = List[data].id;
        body.sn = List[data].sn;
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
    {id: 1, sn: 1, name: 'Full-Time', nameNepali: 'Full-Time', empCodePrefix: 'e1006', retirementAge: '60', description: ' Full-time service in the org is must appreciatble', status: 'Active'},
    {id: 2, sn: 2, name: 'Sharing-job', nameNepali: 'Sharing-job', empCodePrefix: 'e200h', retirementAge: '50', description: 'Sharing between more than one employee', status: 'Active'},
    {id: 3, sn: 3, name: 'Independent', nameNepali: 'Independent', empCodePrefix: 'e3000', retirementAge: '67', description: 'This is the type of service independent ...', status: 'Active'},
    {id: 4, sn: 4, name: 'xyz', nameNepali: 'xyz', empCodePrefix: 'e222', retirementAge: '45', description: 'This is the ....', status: 'Inactive'},
    {id: 5, sn: 5, name: 'abc', nameNepali: 'abc', empCodePrefix: 'a3424', retirementAge: '45', description: 'This is the .....', status: 'Pending'},
    {id: 6, sn: 6, name: 'Online', nameNepali: 'online', empCodePrefix: '3908', retirementAge: '68', description: 'This is the online Service ....', status: 'Active'},
]
