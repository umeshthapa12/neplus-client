import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLevelPositionService {

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
        body.sn = List.length + 1;
        body.id = List.length + 1;
        return of (body);
    }
}

delete(id: number): Observable<any> {
    const data = List.findIndex(x => x.id === id);
    List.splice(data, 1);
    return of (List);
}

}


const List = [
    {id: 1, sn: 1, name: 'Management', nameNepali: 'व्यवस्थापन', serviceGroup: 'Management', description: 'This is the Role For the company...', status: 'Active'},
    {id: 2, sn: 2, name: 'Advisor', nameNepali: 'सल्लाहकार', serviceGroup: 'Management', description: 'This type of the Role is plus point fro the management', status: 'Inactive'},
    {id: 3, sn: 3, name: 'Staff', nameNepali: 'स्टाफ', serviceGroup: 'Production', description: 'All the role play by staff is key to the organization.', status: 'Active'},
    {id: 4, sn: 4, name: ' Executive Management', nameNepali: ' कार्यकारी व्यवस्थापन', serviceGroup: 'Management', description: 'The Role essential for the company', status: 'Pending'},
    {id: 5, sn: 5, name: 'Director', nameNepali: 'निर्देशक', serviceGroup: 'Management', description: 'Role which play Vital Role..', status: 'Approve'},
    {id: 6, sn: 6, name: 'Associate', nameNepali: 'साभ्केदार', serviceGroup: 'Manufacturing', description: 'This is also esential to conduct the business..', status: 'Active'},
    {id: 7, sn: 7, name: 'Intermediate', nameNepali: 'मध्यवर्ती', serviceGroup: 'Delevery', description: 'This is the role in the Company For the ddevelopment of the product in the manufacturing', status: 'Inactive'},
];
