import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RetirementInformationService {

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
             const data = List.findIndex (x => x.id === body.id);
             const d = List.find(x => x.id === body.id);
             List[data] = body;
             body.id = d.id;
             body.sn = d.sn;
             return of(body);
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
        id: 1, sn: 1, empCode: 'e2300', level: 'Top-Level', designation: 'Manager',
        branch: 'Kathmandu Kathmandu', letterNumber: 207, letterDate: '2020/08/08',
        letterDateNepali: '2077/02/08', retirementDate: '2021/01/05', retirementDateNepali: '2078/10/10',
        retirementType: 'Regular Retirement', pensionAmount: 'Rs.30000', pensionPeriod: 'Life Time', gratuityAmount: '505050',
        ageOnRetirement: '60 yrs old', servicePeriod: '40 yrs', description: 'This is the type information about retirement of the employee in the oraganization',
        status: 'Active'
    },
    {
        id: 2, sn: 2, empCode: 'e2300', level: 'Top-Level', designation: 'Manager',
        branch: 'Kathmandu Kathmandu', letterNumber: 208, letterDate: '2020/08/08',
        letterDateNepali: '2077/02/08', retirementDate: '2021/01/05', retirementDateNepali: '2078/10/10',
        retirementType: 'Reserve Retirement', pensionAmount: 'Rs.30000', pensionPeriod: 'Life Time', gratuityAmount: '505050',
        ageOnRetirement: '60 yrs old', servicePeriod: '40 yrs', description: 'This is the type information about retirement of the employee in the oraganization',
        status: 'Active'
    },
    {
        id: 3, sn: 3, empCode: 'e2300', level: 'Top-Level', designation: 'Manager',
        branch: 'Kathmandu Kathmandu', letterNumber: 567, letterDate: '2020/08/08',
        letterDateNepali: '2077/02/08', retirementDate: '2021/01/05', retirementDateNepali: '2078/10/10',
        retirementType: 'Temporary Disability Retirement', pensionAmount: 'Rs.30000', pensionPeriod: 'Life Time', gratuityAmount: '505050',
        ageOnRetirement: '60 yrs old', servicePeriod: '40 yrs', description: 'This is the type information about retirement of the employee in the oraganization',
        status: 'Active'
    },
];
