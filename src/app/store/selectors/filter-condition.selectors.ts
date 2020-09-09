import { createSelector } from '@ngxs/store';
import _ from 'lodash';
import { FilterConditionState } from '../effects';
import { FilterConditionStateModel } from '../models';

/**
 * filter condition state selector
 */
export class FilterConditionStateSelector {

    /**
     * Gets a slice of filter condition
     * @param state state model
     */
    static SliceOf<K extends keyof FilterConditionStateModel>(stateKey: K) {
        return createSelector([FilterConditionState], state => {
            switch (stateKey) {
                // since the state props are readonly, we need to copy for our mutation.
                case 'filterConditions':
                    return _.cloneDeep(state.filterConditions);
            }
        });
    }
}
