import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RetirementTypeService {

constructor() { }

getList(): Observable<any> {
    return of  (List);
}

getListById(id: number): Observable<any> {
    const data = List.find(x => x.id === id);
    return of (data);
}

addOrUpdata(body: any): Observable<any> {
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
    List.splice(index , 1);
    return of  (List);
}

}

let List = [
    {id: 1, sn: 1, name : 'Regular ', nameNepali: 'नियमित', status: 'Active'},
    {id: 2, sn: 2, name : 'Reserve  ', nameNepali: 'रिजर्भ', status: 'Inactive'},
    {id: 3, sn: 3, name : 'Temporary Disability ', nameNepali: 'अस्थायी अशक्तता', status: 'Inactive'},
    {id: 4, sn: 4, name : 'Permanent Disability ', nameNepali: 'स्थायी अक्षमता', status: 'Active'},
    {id: 1, sn: 1, name : 'Temporary Early ', nameNepali: 'अस्थायी रूपमा प्रारम्भिक', status: 'Active'},
];
