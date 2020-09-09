import { AsideNavModel } from '../../models';

/**
 * Gets menu lists based on permission given by admin.
 */
export class FetchSiteNavAction {
    static readonly type = '[LEFT ASIDE] gets left aside from API';
}

/**
 * store to a state prop so we can access on demand.
 */
export class StoreLeftAsideAction {
    static readonly type = '[LEFT ASIDE] store to the state property when success';
    constructor(public leftAside: AsideNavModel[]) { }
}

/**
 * Filter and populate left aside by provided module name.
 */
export class FilterLeftAsideAction {
    static readonly type = '[LEFT ASIDE] filter and populate left aside by module name for UI';
    constructor(public moduleName: string) { }
}
