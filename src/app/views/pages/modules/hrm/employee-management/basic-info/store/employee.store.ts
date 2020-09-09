import { Action, State, StateContext, Store } from '@ngxs/store';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BasicInfoService } from '../basic-info-service';

let CACHED: any[] = [];

/**
 * Start to load lazy employee either form local variable or from API if not found.
 */
export class LoadLazyEmployeeAction {
    static readonly type = '[employees] loads lazy employee data from API';
    constructor(public id: any) { }
}

/**
 * Once the response is succeeded, Initialize lazy employee data.
 */
export class InitLazyEmployeeAction {
    static readonly type = '[employees] init lazy employee data';
    constructor(public lazy: any) { }
}

/**
 * Release memory
 */
export class ClearCachedEmployeesOnDestroyAction {
    static readonly type = '[employees lazy data] clears lazy employee cached data from the history';
}

/**
 * Cached employee gets updated if chage happens
 */
export class UpdateIfCachedAction {
    static readonly type = '[employees] update lazy employee data if cached';
    constructor(public updated: any) { }
}


@State({
    name: 'employees_lazy_data',
    defaults: {},
})
@Injectable()
export class EmployeeLazyDataState {

    constructor(
        private eService: BasicInfoService,
        private store: Store) { }

    @Action(LoadLazyEmployeeAction)
    loadLazyUser(ctx: StateContext<any>, action: LoadLazyEmployeeAction) {
        if (CACHED === null) { CACHED = []; }
        const el = CACHED.find(_ => _.guid === action.id);
        // clear history. we don't need it.
        ctx.setState(null);

        if (el) {
            ctx.setState({ contentBody: el, ...action });
            // if found in cache, return it
            return this.store.dispatch(new InitLazyEmployeeAction(el));
        }

        // not found in cache, load from API
        return this.eService.getListById(action.id).pipe(
            delay(800),
            tap(res => {
                ctx.setState({ contentBody: res, ...action });
                CACHED.push(res);
            }),
            switchMap(res => this.store.dispatch(new InitLazyEmployeeAction(res)))
        );


    }

    @Action(InitLazyEmployeeAction)
    initLazyUser(ctx: StateContext<any>, action: InitLazyEmployeeAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, ...action });
    }

    @Action(ClearCachedEmployeesOnDestroyAction)
    clearCahced(ctx: StateContext<any>) {
        CACHED = null;
        ctx.setState(null);
    }

    @Action(UpdateIfCachedAction)
    updateCached(ctx: StateContext<any>, action: UpdateIfCachedAction) {

        const index = (CACHED || []).findIndex(_ => _.guid === action.updated.guid);
        // clear history. we don't need it.
        ctx.setState(null);

        if (index > -1) {
            CACHED[index] = { ...action.updated };
        }

    }
}
