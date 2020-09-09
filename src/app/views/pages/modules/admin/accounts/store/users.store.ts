import { Action, State, StateContext, Store } from '@ngxs/store';
import { delay, switchMap, tap } from 'rxjs/operators';
import { ResponseModel, UserAccount } from '../../../../../../models';
import { UserService } from '../user-account.service';
import { Injectable } from '@angular/core';

let CACHED: UserAccount[] = [];

/**
 * Start to load lazy user either form local variable or from API if not found.
 */
export class LoadLazyUserAction {
    static readonly type = '[users] loads lazy user data from API';
    constructor(public guid: string) { }
}

/**
 * Once the response is succeeded, Initialize lazy user data.
 */
export class InitLazyUserAction {
    static readonly type = '[users] init lazy user data';
    constructor(public lazy: UserAccount) { }
}

/**
 * Cached user gets updated if chage happens
 */
export class UpdateIfCachedAction {
    static readonly type = '[users] update lazy user data if cached';
    constructor(public updated: UserAccount) { }
}

/**
 * Release memory
 */
export class ClearCachedUsersOnDestroyAction {
    static readonly type = '[users lazy data] clears lazy user cached data from the history';
}

/**
 * user lazy data state
 */
@State({
    name: 'users_lazy_data',
    defaults: {},
})
@Injectable()
export class UserLazyDataState {

    constructor(
        private uService: UserService,
        private store: Store) { }

    @Action(LoadLazyUserAction)
    loadLazyUser(ctx: StateContext<ResponseModel>, action: LoadLazyUserAction) {
        if (CACHED === null) { CACHED = []; }
        const el = CACHED.find(_ => _.guid === action.guid);
        // clear history. we don't need it.
        ctx.setState(null);

        if (el) {
            ctx.setState({ contentBody: el, ...action });
            // if found in cache, return it
            return this.store.dispatch(new InitLazyUserAction(el));
        }

        // not found in cache, load from API
        return this.uService.getUserByGuid(action.guid).pipe(
            delay(800),
            tap(res => {
                ctx.setState({ contentBody: res.contentBody, ...action });
                CACHED.push(res.contentBody);
            }),
            switchMap(res => this.store.dispatch(new InitLazyUserAction(res.contentBody)))
        );

    }

    @Action(InitLazyUserAction)
    initLazyUser(ctx: StateContext<UserAccount>, action: InitLazyUserAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, ...action });
    }

    @Action(ClearCachedUsersOnDestroyAction)
    clearCahced(ctx: StateContext<any>) {
        CACHED = null;
        ctx.setState(null);
    }

    @Action(UpdateIfCachedAction)
    updateCached(ctx: StateContext<ResponseModel>, action: UpdateIfCachedAction) {

        const index = (CACHED || []).findIndex(_ => _.guid === action.updated.guid);
        // clear history. we don't need it.
        ctx.setState(null);

        if (index > -1) {
            CACHED[index] = { ...action.updated };
        }

    }
}

/* ------------------------------------------------------
    user add or update state section
---------------------------------------------------------*/

/**
 * User add or update action
 */
export class UserAddOrUpdateAction {
    static readonly type = '[user add update] creates or updates an user';
    constructor(public payload: UserAccount) { }
}

export class UserAddOrUpdateResponseAction {
    static readonly type = '[user add update] creates or updates an user';
    constructor(public response: ResponseModel) { }
}

/**
 * user add or update state
 */
@State({
    name: 'users_add_update',
    defaults: {},
})
@Injectable()
export class UserAddOrUpdateState {

    constructor(private uService: UserService) { }

    @Action(UserAddOrUpdateAction)
    addOrUpdate(ctx: StateContext<any>, action: UserAddOrUpdateAction) {

        return this.uService.addOrUpdate(action.payload).pipe(
            tap(res => {
                // since we are going to select `payload`property
                ctx.patchState({ payload: res });

                // after the 1st stream has been received,
                // clean the state to prevent collusion when adding or updating another one
                ctx.setState({ payload: null });
            })
        );
    }

}
