import { Action, State, StateContext, Store } from '@ngxs/store';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Companies, ResponseModel } from '../../../../../../models';
import { CompanyService } from '../company.service';
import { Injectable } from '@angular/core';

/*----------------------------------------
    Company data state section
-----------------------------------------*/
let CACHED: Companies[] = [];

/**
 * Start to load lazy company either form local variable or from API if not found.
 */
export class LoadLazyCompany {
    static readonly type = '[companies] loads lazy company data from API';
    constructor(public guid: string) { }
}

/**
 * Once the response is succeed, Initialize lazy company data.
 */
export class InitLazyCompany {
    static readonly type = '[companies] init lazy company data';
    constructor(public lazy: Companies) { }
}

/**
 * Release from memory.
 */
export class ClearCachedCompaniesOnDestroyAction {
    static readonly type = '[companies] clears lazy companies cached data from the history';
}

/**
 * Company state
 */
@State({
    name: 'companies',
    defaults: {},
})
@Injectable()
export class CompanyState {

    constructor(
        private cService: CompanyService,
        private store: Store) { }

    @Action(LoadLazyCompany)
    loadLazyCompany(ctx: StateContext<ResponseModel>, action: LoadLazyCompany) {

        if (!CACHED) { CACHED = []; }

        const el = CACHED.find(_ => _.regGuid === action.guid);
        // clear state history. we don't need it.
        ctx.setState(null);

        if (el) {
            ctx.setState({ contentBody: el, ...action });
            // if found in cache, return it
            return this.store.dispatch(new InitLazyCompany({...el}));
        }

        // not found in cache, load from API
        return this.cService.getCompanyByGuid(action.guid).pipe(
            delay(800),
            tap(res => {
                ctx.setState({ contentBody: res.contentBody, ...action });
                CACHED.push(res.contentBody);
            }),
            switchMap(res => this.store.dispatch(new InitLazyCompany(res.contentBody)))
        );

    }

    @Action(InitLazyCompany)
    initLazyCompany(ctx: StateContext<Companies>, action: InitLazyCompany) {
        const state = ctx.getState();
        ctx.setState({ ...state, ...action });
    }

    @Action(ClearCachedCompaniesOnDestroyAction)
    clearCahced(ctx: StateContext<any>) {
        CACHED = null;
        ctx.setState(null);
    }

}


