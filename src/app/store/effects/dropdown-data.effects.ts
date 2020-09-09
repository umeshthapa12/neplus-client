import { Action, State, StateContext, Store } from '@ngxs/store';
import { merge } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { DropdownProviderService } from '../../services';
import { AppAreasAction, CompanyTypesAction, InitDropdownAction, JobCategoryAction, RouteTypesAction, RowStatusAction, SysModuleAction, SystemRolesAction } from '../actions';
import { DropdownStateModel, initialDropdownState } from '../models';
import { Injectable } from '@angular/core';

@State<DropdownStateModel>({
    name: 'dropdown',
    defaults: initialDropdownState
})
@Injectable()
export class DropdownDataState {

    constructor(
        private dropdown: DropdownProviderService,
        private store: Store) { }

    @Action(InitDropdownAction)
    initDropdown() {

        const obs = [
            // job categories
            this.dropdown.getJobCategories().pipe(delay(1000),
                switchMap(x => this.store.dispatch(new JobCategoryAction(x)))
            ),
            // company types
            this.dropdown.getCompanyTypes().pipe(delay(1000),
                switchMap(y => this.store.dispatch(new CompanyTypesAction(y)))
            ),
            // roles
            this.dropdown.getRoles().pipe(delay(1000),
                switchMap(y => this.store.dispatch(new SystemRolesAction(y)))
            ),
            // status
            this.dropdown.getStatus().pipe(delay(1000),
                switchMap(y => this.store.dispatch(new RowStatusAction(y)))
            ),
            // routing types
            this.dropdown.getAppRouteTypes().pipe(delay(1000),
                switchMap(y => this.store.dispatch(new RouteTypesAction(y)))
            ),
            // system module names
            this.dropdown.getSysModuleNames().pipe(delay(1000),
                switchMap(y => this.store.dispatch(new SysModuleAction(y)))
            ),
            // API route area names
            this.dropdown.getApiAreaNames().pipe(delay(1000),
                switchMap(y => this.store.dispatch(new AppAreasAction(y)))
            ),
        ];

        return merge(...obs);
    }

    /*-- job categories --*/
    @Action(JobCategoryAction)
    loadCategories(ctx: StateContext<DropdownStateModel>, action: JobCategoryAction) {
        ctx.patchState({ jobCategories: action.jobCategories });
    }

    /*-- company types / ownerships --*/
    @Action(CompanyTypesAction)
    loadCompanyType(ctx: StateContext<DropdownStateModel>, action: CompanyTypesAction) {

        ctx.patchState({ CompanyTypes: action.companyTypes });
    }

    /*-- roles --*/
    @Action(SystemRolesAction)
    roles(ctx: StateContext<DropdownStateModel>, action: SystemRolesAction) {
        ctx.patchState({ SystemRoles: action.roles });
    }

    /*-- row status --*/
    @Action(RowStatusAction)
    status(ctx: StateContext<DropdownStateModel>, action: RowStatusAction) {
        ctx.patchState({ RowStatus: action.status });
    }

    /*-- route types --*/
    @Action(RouteTypesAction)
    routeTypes(ctx: StateContext<DropdownStateModel>, action: RouteTypesAction) {
        ctx.patchState({ RouteTypes: action.routeTypes });
    }

    /*-- system module names --*/
    @Action(SysModuleAction)
    moduleNames(ctx: StateContext<DropdownStateModel>, action: SysModuleAction) {
        ctx.patchState({ SysModule: action.moduleNames });
    }

    /*-- area names --*/
    @Action(AppAreasAction)
    areaNames(ctx: StateContext<DropdownStateModel>, action: AppAreasAction) {
        ctx.patchState({ AppAreas: action.routeAreas });
    }

}


