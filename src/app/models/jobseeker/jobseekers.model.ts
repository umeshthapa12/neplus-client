import { PhoneNumberModel } from '../numbers.model';

export interface JobSeeker {
    id?: number;
    guid?: string;
    jobseekerId?: number;
    email?: string;
    password?: string;
    fullName?: string;
    presentAddress?: string;
    permanentAddress?: string;
    phoneNumbers?: PhoneNumberModel[];
    gender?: string;
    dateOfBirth?: Date;
    age?: number;
    maritalStatus?: string;
    religion?: string;
    nationalityId?: number;
    nationality?: string;
    aboutMe?: string;
    jobSearchStatus?: string;
    careerSummary?: string;

}

