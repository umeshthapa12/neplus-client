import { PhoneNumberModel } from '../numbers.model';

export interface Companies {
    sn?: number;
    id?: number;
    regGuid?: string;
    name?: string;
    category?: string;
    otherCategory?: string;
    categoryId?: number;
    companyType?: string;
    companyTypeId?: number;
    employeeSize?: string;
    address?: string;
    email?: string;
    url?: string;
    about?: string;
    phoneNumbers?: PhoneNumberModel[];
    contactPersonName?: string;
    contactPersonDesignation?: string;
    contactPersonPhone?: string;
    contactPersonAddress?: string;
    contactPersonDescription?: string;
    contactPersonEmail?: string;

    // extra
    status?: any;
}
