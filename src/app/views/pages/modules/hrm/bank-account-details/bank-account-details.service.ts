import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankAccountDetailsService {

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
        body.sn = List.length + 1;
        body.id = List.length + 1;
        return of (body);
    }
}

delete(id: number): Observable<any> {
    const index = List.findIndex(x => x.id === id);
    List.splice(index , 1);
    return of (List);
}

}


let List =  [
    {
        id: 1,
        sn: 1,
        empCode: 'E-4546',
        bankName: 'NIC-Asia',
        bankBranchName: 'Sahayoginagar',
        bankAccountNumber: '06101606451987000001',
        status: 'Active',
    },
    {
        id: 2,
        sn: 2,
        empCode: 'E-094',
        bankName: 'Nepal Bank LTD',
        bankBranchName: 'Koteshwor',
        bankAccountNumber: '06101606451987000001',
        status: 'Inactive',
    },
];
