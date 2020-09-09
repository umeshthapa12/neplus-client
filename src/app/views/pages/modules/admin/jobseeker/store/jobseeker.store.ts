import { Action, State, StateContext, Store } from '@ngxs/store';
import { delay, switchMap, tap } from 'rxjs/operators';
import { JobSeeker, ResponseModel } from '../../../../../../models';
import { JobSeekerService } from '../jobseeker.service';
import { Injectable } from '@angular/core';

/*----------------------------------------
    cached data state section
-----------------------------------------*/
let CACHED: JobSeeker[] = [];

/**
 * Start to load lazy job seeker either form local variable or from API if not found.
 */
export class LoadLazyJobseeker {
    static readonly type = '[jobseekers] loads lazy job seeker\'s data from API';
    constructor(public guid: string) { }
}

/**
 * Once the response is succeed, Initialize lazy job seeker data.
 */
export class InitLazyJobseeker {
    static readonly type = '[jobseekers] init lazy job seeker\'s  data';
    constructor(public lazy: JobSeeker) { }
}

/**
 * Release from memory.
 */
export class ClearCachedJobSeekersOnDestroyAction {
    static readonly type = '[jobseekers] clears lazy jobseeker cached data from the history';
}

/**
 * Jobseeker state
 */
@State({
    name: 'jobseekers',
    defaults: {},
})
@Injectable()
export class JobseekerState {

    constructor(
        private cService: JobSeekerService,
        private store: Store) { }

    @Action(LoadLazyJobseeker)
    loadLazyJobseeker(ctx: StateContext<ResponseModel>, action: LoadLazyJobseeker) {

        if (!CACHED) { CACHED = []; }

        const el = CACHED.find(_ => _.guid === action.guid);
        // clear history. we don't need it.
        ctx.setState(null);

        if (el) {
            ctx.setState({ contentBody: el, ...action });
            // if found in cache, return it
            return this.store.dispatch(new InitLazyJobseeker(el));
        }

        // not found in cache, load from API
        return this.cService.getJobSeekerByGuid(action.guid).pipe(
            delay(800),
            tap(res => {
                ctx.setState({ contentBody: res.contentBody, ...action });
                CACHED.push(res.contentBody);
            }),
            switchMap(res => this.store.dispatch(new InitLazyJobseeker(res.contentBody)))
        );

    }

    @Action(InitLazyJobseeker)
    initLazyJobseeker(ctx: StateContext<JobSeeker>, action: InitLazyJobseeker) {
        const state = ctx.getState();
        ctx.setState({ ...state, ...action });
    }

    @Action(ClearCachedJobSeekersOnDestroyAction)
    clearCahced(ctx: StateContext<any>) {
        CACHED = null;
        ctx.setState(null);
    }

}


