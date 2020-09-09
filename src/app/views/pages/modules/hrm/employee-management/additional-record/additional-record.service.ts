import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdditionalRecordService {

    getList(): Observable<any> {
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const data = List.find(x => x.id === id);
        return of(data);
    }


    addOrUpdate(body: any): Observable<any> {
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            List[data] = body;
            body.sn = List[data].sn;
            body.id = List[data].id;
            return of(body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            body.sn = List.length + 1;
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        return of(List);
    }

}


const List = [
    {
        citNo: 'C-12-353-2823-45',
        drivingLicenseExpiryDate: 'Tue May 19 2020 00: 00: 00 GMT + 0545(Nepal Time)',
        drivingLicenseNo: '128-387-8734-394',
        empCode: 'DEV-189',
        empFileNo: 'EMP-2891',
        empPanNo: '9023-2387-122-31',
        empPersonalCode: 'EMP-2345-223-2256',
        empPfNo: '721-41254-4532-21',
        extensionNo: '2387-45-398',
        hobbies: ['playing'],
        id: 2,
        identityIssuedPlace: 'Kathmandu',
        identityNo: '378-3487-823',
        identityType: 'Driving License',
        insuranceNo: 'I-0923-232-515',
        joinSalary: 'Help inc',
        joinSalaryDescription: 'Done',
        joiningAs: 'Developer',
        joiningAsDescription: 'Done',
        otherInterest: ['management'],
        otherRefNo: '223549-498-223',
        previousExpYear: '2020',
        professionalLicenseExpireDate: 'Tue May 19 2020 00: 00: 00 GMT + 0545(Nepal Time)',
        professionalLicenseNo: '3487-5983-2892-982',
        sn: 1,
        specialTalent: ['management'],
        status: 'Active',
    }
];
