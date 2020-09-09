import { createSelector } from '@ngxs/store';
import _ from 'lodash';
import { AppState } from '../effects/app.effects';
import { AppStateModel } from '../models';

/**
 * App state selector
 */
export class AppStateSelector {

    /**
     * Gets a slice of app state data.
     * @param state state model
     */
    static SliceOf<K extends keyof AppStateModel>(stateKay: K) {
        return createSelector([AppState], (state: AppStateModel) => {
            // since the state props are readonly, we need to copy for our mutation.
            switch (stateKay) {
                case 'activeUser':
                    return _.cloneDeep(state.activeUser);
                case 'logoutSuccess':
                    return _.cloneDeep(state.logoutSuccess);
                case 'isSessionExpired':
                    return _.cloneDeep(state.isSessionExpired);
                case 'loginSuccess':
                    return _.cloneDeep(state.loginSuccess);
                case 'changePasswordSuccess':
                    return _.cloneDeep(state.changePasswordSuccess);
                // more
            }
        });
    }
}
