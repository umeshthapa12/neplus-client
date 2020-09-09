import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CanActivateUser implements CanActivate {

    constructor(private store: Store) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return of(false);
        // return this.store.dispatch(new IsUserLoggedInAction()).pipe(
        //     // object returns all state props so we select `userLogin` to check valid object
        //     map(_ => _ && _.userLogin && _.userLogin.contentBody ? true : false),
        //     catchError(_ => {
        //         const base = location.protocol + '//' + location.host;
        //         window.location.href = base + '/admin/login';
        //         return of(false);
        //     })
        // );
    }
}
