import { Action, State, StateContext, Store } from '@ngxs/store';
import { merge } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { DropdownModel, DropdownProviderService } from '../../services';
import { FilterConditionsAction, InitFilterActions } from '../actions';
import { FilterConditionStateModel, initialFilterConditionState } from '../models';
import { Injectable } from '@angular/core';

/*----------------------------------------
    filter data load state section
-----------------------------------------*/


@State<FilterConditionStateModel>({
    name: 'filter',
    defaults: initialFilterConditionState
})
@Injectable()
export class FilterConditionState {

    constructor(
        private dropdown: DropdownProviderService,
        private store: Store) { }

    @Action(InitFilterActions)
    initFilters() {
        const obs = [
            // filter conditions
            this.dropdown.getFilterConditions().pipe(delay(1000),
                switchMap(c => this.store.dispatch(new FilterConditionsAction(c)))
            ),
            // more..
        ];

        return merge(...obs);

    }

    @Action(FilterConditionsAction)
    loadConditions(ctx: StateContext<DropdownModel[]>, action: FilterConditionsAction) {
        const state = ctx.getState();
        ctx.setState({ ...state, ...action });
    }

}


