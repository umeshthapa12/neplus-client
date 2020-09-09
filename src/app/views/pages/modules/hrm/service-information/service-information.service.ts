import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ServiceInformationService {

    constructor() {
        const data = JSON.parse(localStorage.getItem('service'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('service', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    empCode: 'E-243',
                    empGroup: 'Development',
                    location: 'Kathmandu-Nepal',
                    branch: 'Kathmandu',
                    department: 'Building',
                    designation: 'Manager',
                    unit: 'Second',
                    serviceGroup: 'Delivery',
                    service: 'Load/Unload',
                    serviceSubGroup: 'Local',
                    darbandi: 'Permanant',
                    deputation: 'Temporary',
                    contractType: 'Full-Timer',
                    employeeLevel: 'Top-Level',
                    empJobPost: 'Vacant',
                    remunerationGroup: 'Monthly-Payment',
                    appointmentType: 'Diract',
                    dateOfJoin: '2019/12/12',
                    dateOfJoinNepali: '2076/10/23',
                    contractStartDate: '2019/10/12',
                    contractStartDateNepali: '2076/8/12',
                    dateOfPermanent: '2020/02/20',
                    dateOfPermanentNepali: '2076/12/12',
                    dateOfTransfer: '2020/03/05',
                    dateOfTransferNepali: '2077/01/23',
                    dateOfPromotion: '2020/04/23',
                    dateOfPromotionNepali: '2077/02/12/12',
                    probationDate: '2020/03/08',
                    probationDateNepali: '2077/03/32',
                    dateOfLastServiceRenew: '2020/04/12',
                    dateOfLastServiceRenewNepali: '2077/03/03',
                    serviceDurationEndDate: '2021/11/14',
                    serviceDurationEndDateNepali: '2077/10/15',
                    dueDateOfRetirement: '2022/03/23',
                    dueDateOfRetirementNepali: '2077/12/12',
                    compulsoryRetirementDate: '2023/01/23',
                    compulsoryRetiremenetDateNepali: '2080/10/13',
                    dateOfStopPayment: '2025/12/12',
                    dateOfStopPaymentNepali: '2083/12/12',
                    contractPeriod: '23 yers',
                    workingStatus: 'Active',
                    supervisorCode: 'AAAAABBB',
                },
            ]));
        } else if (data === null) {
            localStorage.setItem('service', JSON.stringify([
                {
                    id: 1,
                    sn: 1,
                    empCode: 'E-243',
                    empGroup: 'Development',
                    location: 'Kathmandu-Nepal',
                    branch: 'Kathmandu',
                    department: 'Building',
                    designation: 'Manager',
                    unit: 'Second',
                    serviceGroup: 'Delivery',
                    service: 'Load/Unload',
                    serviceSubGroup: 'Local',
                    darbandi: 'Permanant',
                    deputation: 'Temporary',
                    contractType: 'Full-Timer',
                    employeeLevel: 'Top-Level',
                    employeeJobPost: 'Vacant',
                    remunerationGroup: 'Monthly-Payment',
                    appointmentType: 'Diract',
                    dateOfJoin: '2019/12/12',
                    dateOfJoinNepali: '2076/10/23',
                    contractStartDate: '2019/10/12',
                    contractStartDateNepali: '2076/8/12',
                    dateOfPermanent: '2020/02/20',
                    dateOfPermanentNepali: '2076/12/12',
                    dateOfTransfer: '2020/03/05',
                    dateOfTransferNepali: '2077/01/23',
                    dateOfPromotion: '2020/04/23',
                    dateOfPromotionNepali: '2077/02/12/12',
                    probationDate: '2020/03/08',
                    probationDateNepali: '2077/03/32',
                    dateOfLastServiceRenew: '2020/04/12',
                    dateOfLastServiceRenewNepali: '2077/03/03',
                    serviceDurationEndDate: '2021/11/14',
                    serviceDurationEndDateNepali: '2077/10/15',
                    dueDateOfRetirement: '2022/03/23',
                    dueDateOfRetirementNepali: '2077/12/12',
                    compulsoryRetiremenetDate: '2023/01/23',
                    compulsoryRetiremenetDateNepali: '2080/10/13',
                    dateOfStopPayment: '2025/12/12',
                    dateOfStopPaymentNepali: '2083/12/12',
                    contractPeriod: '23 yers',
                    workingStatus: 'Active',
                    supervisorCode: 'AAAAABBB',
                }
            ]));
        }
    }

    getList(): Observable<any> {
        const List = JSON.parse(localStorage.getItem('service'));
        return of(List);
    }

    getListById(id: number): Observable<any> {
        const List = JSON.parse(localStorage.getItem('service'));
        const data = List.find(x => x.id === id);
        return of(data);
    }

    addOrUpdate(body: any): Observable<any> {
        const List = JSON.parse(localStorage.getItem('service'));
        if (body.id > 0) {
            const data = List.findIndex(x => x.id === body.id);
            const d = List.find(x => x.id === body.id);
            List[data] = body;
            body.id = d.id;
            body.sn = d.sn;
            localStorage.setItem('service', JSON.stringify(List));
            return of(body);
        } else {
            List.push(body);
            body.id = List.length + 1;
            body.sn = List.length + 1;
            localStorage.setItem('service', JSON.stringify(List));
            return of(body);
        }
    }

    delete(id: number): Observable<any> {
        const List = JSON.parse(localStorage.getItem('service'));
        const index = List.findIndex(x => x.id === id);
        List.splice(index, 1);
        localStorage.setItem('service', JSON.stringify(List));
        return of(List);
    }


}
