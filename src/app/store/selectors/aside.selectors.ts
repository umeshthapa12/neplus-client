import { Selector, createSelector } from '@ngxs/store';
import _ from 'lodash';
import { AsideNavState } from '../effects';
import { SiteNavStateModel } from '../models';

/**
 * App state selector
 */
export class AsideStateSelector {

    /**
     * Gets a slice of left aside.
     * @param state state model
     */
    static SliceOf<K extends keyof SiteNavStateModel>(stateKay: K) {
        return createSelector([AsideNavState], (state: SiteNavStateModel) => {
            // since the state props are readonly, we need to copy for our mutation.
            switch (stateKay) {
                case 'filteredItems':
                    return _.cloneDeep(state.filteredItems);
                case 'moduleNames':
                    return _.cloneDeep(state.masterAside).map(m => m.module);
                // more
            }
        });
    }
}
