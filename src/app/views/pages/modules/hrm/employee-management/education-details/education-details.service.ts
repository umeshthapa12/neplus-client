import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class EducationDetailsService {
    getEdu(): Observable<any> {
        return of(Education);
    }

    getEduById(id: number): Observable<any> {
        const i = Education.find(_ => _.id === id);
        return of(i);
    }

    deleteEdu(id: number): Observable<any> {
        const i = Education.findIndex(_ => _.id === id);
        Education.splice(i, 1);
        return of(Education);
    }

    addOrUpdate(body: any): Observable<any> {
        if (body.id !== null) {
            const d = Education.find(_ => _.id === body.id);
            const i = Education.findIndex(_ => _.id === body.id);
            Education[i] = body;
            body.id = d.id;
            body.sn = d.sn;
            return of(body);
        } else {
            const d = Education.find(_ => _.id === body.id);
            Education.push(body);
            body.id = Education.length + 1;
            body.sn = Education.length + 1;
            return of(body);
        }
    }
}

let Education = [
    {
        id: 1,
        sn: 1,
        empCode: 'DEV-964N',
        degreeName: 'Masters',
        institution: 'Trichandra',
        country: 'Nepal',
        startYear: '2018',
        passedYear: '2020',
        majorSubject: 'Computer Architecture',
        duration: '2 years',
        university: 'Tribhuwan University',
        grade: 'B+',
        highestDegree: true,
        status: 'Active'
    }
];


