import { Selector, createSelector } from '@ngxs/store';
import _ from 'lodash';
import { DropdownDataState } from '../effects';
import { DropdownStateModel } from '../models';

/**
 * dropdown state selector
 */
export class DropdownStateSelector {

    /**
     * Gets a slice of job categories.
     * @param state state model
     */
    static SliceOf<K extends keyof DropdownStateModel>(stateKey: K) {
        return createSelector([DropdownDataState], state => {
            switch (stateKey) {
                // since the state props are readonly, we need to copy for our mutation.
                case 'jobCategories':
                    return _.cloneDeep(state.jobCategories);

                case 'AppAreas':
                    return _.cloneDeep(state.AppAreas);

                case 'CompanyTypes':
                    return _.cloneDeep(state.CompanyTypes);

                case 'RouteTypes':
                    return _.cloneDeep(state.RouteTypes);

                case 'SystemRoles':
                    return _.cloneDeep(state.SystemRoles);

                case 'SysModule':
                    return _.cloneDeep(state.SysModule);

                case 'RowStatus':
                    return _.cloneDeep(state.RowStatus);

            }
        });
    }
}
