import { getActionTypeFromInstance } from '@ngxs/store';
import { LogoutAction } from '../actions';
import { initialAppState, initialDropdownState, initialFilterConditionState, InitialAsideState } from '../models';

/**
 * Logout cleanup
 *
 * @export
 * @param {*} state
 * @param {*} action
 * @param {*} next
 * @returns an empty state object.
 */
export function logoutPlugin(state: any, action: any, next: any) {
    // Use the get action type helper to determine the type
    if (getActionTypeFromInstance(action) === LogoutAction.type) {
        // if we are a logout type, lets erase all the state
        state = {
            ...InitialAsideState,
            ...initialAppState,
            ...initialDropdownState,
            ...initialFilterConditionState
        };
    }

    // return the next function with the empty state
    return next(state, action);
}
