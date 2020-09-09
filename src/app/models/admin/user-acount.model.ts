
import { PhoneNumberModel } from '../numbers.model';

export interface UserAccount {
    sn?: number;
    id?: number;
    accountId?: number;
    guid?: string;
    fName?: string;
    mName?: string;
    lName?: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    email?: string;
    role?: string;
    roleId?: number;
    username?: string;
    password?: string;
    status?: string;

    phoneNumbers?: PhoneNumberModel[];

}
