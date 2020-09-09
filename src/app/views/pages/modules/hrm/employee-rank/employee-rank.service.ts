import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRankService {

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
        List[data] = body;
        body.sn = List[data].sn;
        body.id = List[data].id;
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


const List = [
    {id: 1, sn: 1, name: 'Chairman', nameNepali: 'अध्यक्ष', status: 'Active'},
    {id: 2, sn: 2, name: 'Top Level', nameNepali: 'शीर्ष स्तर', status: 'Active'},
    {id: 3, sn: 3, name: 'Assistant Director', nameNepali: 'सहायक निर्देशक', status: 'Active'},
    {id: 4, sn: 4, name: 'Senior Director', nameNepali: 'वरिष्ठ निर्देशक', status: 'Active'},
    {id: 5, sn: 5, name: 'Helper', nameNepali: 'Helper', status: 'Inactive'},
    {id: 6, sn: 6, name: 'Senior Helper', nameNepali: 'अध्यक्ष', status: 'Active'},
    {id: 7, sn: 7, name: 'Chairman', nameNepali: 'अध्यक्ष', status: 'InActive'},
];
