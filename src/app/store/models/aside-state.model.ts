import { AsideNavModel } from '../../models';

/**
 * Site nav state model
 */
export interface SiteNavStateModel {
    leftAside?: AsideNavModel[];
    masterAside?: AsideNavModel[];
    filteredItems?: AsideNavModel[];
    moduleNames?: string[];
}

/**
 * Initial values for the state
 */
export const InitialAsideState: SiteNavStateModel = {
    leftAside: [],
    masterAside: [],
    filteredItems: [],
    moduleNames: []
};
