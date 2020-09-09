import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LetterTypeService {

constructor() {

 }


getList(): Observable<any> {
    return of (Data);
}

getListById(id: number): Observable<any> {
    const data = Data.find(x => x.id === id);
    return of (data);
}

add(body: any): Observable<any> {
    body.id = Data.length + 1;
    body.sn = Data.length + 1;
    Data.push(body);
    return of (body);
}


update(body: any): Observable<any> {
    const i = Data.findIndex(x => x.id === body.id);
    const data = Data.find(x => x.id === body.id);
    body.id = data.id;
    body.sn = data.sn;
    Data[i] = body;
    return of (body);

}

delete(id: number): Observable<any> {
    const data = Data.findIndex(x => x.id === id);
    Data.splice(data, 1);
    return of (Data);
}


}


let Data = [
    { id: 1 , sn: 1 , name: 'Official', status: 'Active'},
    { id: 2 , sn: 2 , name: 'Official', status: 'Active'},
    { id: 3 , sn: 3 , name: 'Official', status: 'Inactive'},
    { id: 4 , sn: 4 , name: 'Official', status: 'Inactive'},
    { id: 5 , sn: 5 , name: 'Official', status: 'Pending'},
    { id: 6 , sn: 6 , name: 'Official', status: 'Pending'},
    { id: 7 , sn: 7 , name: 'Official', status: 'Approve'},
    { id: 8 , sn: 8 , name: 'Official', status: 'Approve'},
    { id: 9 , sn: 9 , name: 'Official', status: 'Reject'},
    { id: 10 , sn: 10 , name: 'Official', status: 'Reject'},
];
