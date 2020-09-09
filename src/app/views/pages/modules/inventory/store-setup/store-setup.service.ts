import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreSetupService {

    constructor(private http: HttpClient) {
        const data = JSON.parse(localStorage.getItem('store'));
        if (data !== null && data.length === 0) {
            localStorage.setItem('store', JSON.stringify([
                { id: 1, sn: 1, storeCode: 2424, storeName: 'Electronic', underStore: 'Electronic', branchName: 'Baglung', status: 'Active' },
                { id: 2, sn: 2, storeCode: 2824, storeName: 'Electronic', underStore: 'Vehicle', branchName: 'Bardeya', status: 'Inactive' },
                { id: 3, sn: 3, storeCode: 2324, storeName: 'Stationary', underStore: 'Kitchen', branchName: 'Butwal', status: 'Active' },
                { id: 4, sn: 4, storeCode: 2124, storeName: 'It Related', underStore: 'IT', branchName: 'Baglung', status: 'Inactive' },
                { id: 5, sn: 5, storeCode: 2426, storeName: 'Non Electronic', underStore: 'Vehicle', branchName: 'Balawaa', status: 'Active' },
                { id: 6, sn: 6, storeCode: 9424, storeName: 'Kitchen', underStore: 'Electronic', branchName: 'Kathmandu', status: 'Inactive' },
            ]));
        } else if (data === null) {
            localStorage.setItem('store', JSON.stringify([
                { id: 1, sn: 1, storeCode: 2424, storeName: 'Electronic', underStore: 'Electronic', branchName: 'Baglung', status: 'Active' },
                { id: 2, sn: 2, storeCode: 2824, storeName: 'Electronic', underStore: 'Vehicle', branchName: 'Bardeya', status: 'Inactive' },
                { id: 3, sn: 3, storeCode: 2324, storeName: 'Stationary', underStore: 'Kitchen', branchName: 'Butwal', status: 'Active' },
                { id: 4, sn: 4, storeCode: 2124, storeName: 'It Related', underStore: 'IT', branchName: 'Baglung', status: 'Inactive' },
                { id: 5, sn: 5, storeCode: 2426, storeName: 'Non Electronic', underStore: 'Vehicle', branchName: 'Balawaa', status: 'Active' },
                { id: 6, sn: 6, storeCode: 9424, storeName: 'Kitchen', underStore: 'Electronic', branchName: 'Kathmandu', status: 'Inactive' },
            ]));
        }
    }

    getList(): Observable<any> {
        const data = JSON.parse(localStorage.getItem('store'));
        if (data !== null) {
            return of(data);
        } else {
            return of([]);
        }
    }
    getListById(id: number): Observable<any> {
        const s = JSON.parse(localStorage.getItem('store'));
        if (s !== null) {
            const e = s.find(x => x.id === id);
            return of(e);
        } else {
            localStorage.setItem('store', JSON.stringify([]));
            const s = JSON.parse(localStorage.getItem('store'));
            const e = s.find(x => x.id === id);
            return of(e);
        }
    }

    add(list: any): Observable<any> {
        const data = JSON.parse(localStorage.getItem('store'));
        if (data !== null) {
            data.push(list);
            list.id = data.length + 1;
            list.sn = data.length + 1;
            localStorage.setItem('store', JSON.stringify(data));
            return of(list);
        } else {
            localStorage.setItem('store', JSON.stringify([]));
            const s = JSON.parse(localStorage.getItem('store'));
            if (s !== null) {
                s.push(list);
                list.id = s.length + 1;
                list.sn = s.length + 1;
                localStorage.setItem('store', JSON.stringify(s));
                return of(list);

            }
        }

    }

    update(list: any): Observable<any> {
        const s = JSON.parse(localStorage.getItem('store'));
        if (s !== null) {
            const eValue = s.findIndex(x => x.id === list.id);
            list.sn = s[eValue].sn;
            s[eValue] = list;
            localStorage.setItem('store', JSON.stringify(s));
            return of(list);
        } else {
            localStorage.setItem('store', JSON.stringify([]));
            const d = JSON.parse(localStorage.getItem('store'));
            const eValue = d.findIndex(x => x.id === list.id);
            d[eValue] = list;
            localStorage.setItem('store', JSON.stringify(d));
            return of(list);
        }

    }

    delete(id: number): Observable<any> {
        const d = JSON.parse(localStorage.getItem('store'));
        if (d !== null) {
            const s = d.findIndex(x => x.id === id);
            d.splice(s, 1);
            localStorage.setItem('store', JSON.stringify(d));
            return of(d);
        } else {
            localStorage.setItem('item', JSON.stringify([]));
            const data = JSON.parse(localStorage.getItem('store'));
            const i = data.findIndex(x => x.id === id);
            data.splice(i, 1);
            localStorage.setItem('store', JSON.stringify(data));
            return of(data);
        }
    }

}
