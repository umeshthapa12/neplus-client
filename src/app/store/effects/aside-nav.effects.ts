import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import _ from 'lodash';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { AsideNavModel } from '../../models';
import { AuthService } from '../../services';
import { FetchSiteNavAction, FilterLeftAsideAction, StoreLeftAsideAction } from '../actions';
import { InitialAsideState, SiteNavStateModel } from '../models';
import { Injectable } from '@angular/core';

// export const ASIDE_NAV_STATE_TOKEN = new StateToken<StoreLeftAsideAction>('navigation');

@State<SiteNavStateModel>({
    name: 'navigation',
    defaults: InitialAsideState
})
@Injectable()
export class AsideNavState {

    /**
     * Current module name which is route data.
     */
    private currentModuleName: string;

    constructor(
        private auth: AuthService,
        private snack: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store
    ) {
        this.router.events.pipe(
            map(() => this.route.firstChild?.snapshot?.data?.moduleName),
            distinctUntilChanged(),
            debounceTime(200)
        ).subscribe({ next: name => this.store.dispatch(new FilterLeftAsideAction(name)) });
    }

    @Action(FetchSiteNavAction)
    loadSiteNav(ctx: StateContext<SiteNavStateModel>) {

        // source to retrieve left aside nav data
        return this.auth.getSiteNav().pipe(
            tap(res => ctx.dispatch(new StoreLeftAsideAction(res?.contentBody || []))),
            tap(res => {
                const d: AsideNavModel[] = res.contentBody;

                if (!d || d.length <= 0) {
                    this.snack.open('You have no menu. Login as admin and add it from user permission section.', 'close', {
                        verticalPosition: 'top',
                        horizontalPosition: 'center'
                    });
                }
            })
        );
    }

    @Action(StoreLeftAsideAction)
    initAside(ctx: StateContext<SiteNavStateModel>, action: StoreLeftAsideAction) {

        action.leftAside.forEach(el => el.submenu ? el.bullet = 'dot' : null);

        // since we don't know when the API response is completed, we need to dispatch filter left aside.
        ctx.dispatch(new FilterLeftAsideAction(this.currentModuleName));

        return ctx.patchState({ masterAside: action.leftAside, });
    }

    @Action(FilterLeftAsideAction)
    filterAside(ctx: StateContext<SiteNavStateModel>, action: FilterLeftAsideAction) {

        const state = ctx.getState();

        return ctx.patchState({ filteredItems: this.filterNav(_.cloneDeep(state?.masterAside), action.moduleName)});
    }

    /**
     * When we retrieve left aside nav from API, we filter out by current route and push to the UI.
     * @param items collection of left aside
     * @param moduleName active module name
     */
    private filterNav(items: AsideNavModel[] = [], moduleName: string) {
        const n2 = (moduleName || '').toLowerCase();
        this.currentModuleName = n2;
        return items.filter(function f(o) {
            const n1 = (o.module || '').toLowerCase();
            if (n1 === n2) { return true; }

            if (o.submenu) {
                return (o.submenu = o.submenu.filter(f)).length;
            }
        });
    }
}
