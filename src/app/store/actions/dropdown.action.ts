import { DropdownModel } from '../../services';

/*----------------------------------------
    dropdown data load state section
-----------------------------------------*/
/**
 * initialize dropdown collections at app startups
 */
export class InitDropdownAction {
    static readonly type = '[dropdown] init on app start';
}

/**
 * Gets job categories
 */
export class JobCategoryAction {
    static readonly type = '[dropdown] loads job category';
    constructor(public jobCategories: DropdownModel[]) { }
}

/**
 * Gets company types / ownership
 */
export class CompanyTypesAction {
    static readonly type = '[dropdown] loads company types/ownerships';
    constructor(public companyTypes: DropdownModel[]) { }
}

/**
 * Gets system roles
 */
export class SystemRolesAction {
    static readonly type = '[dropdown] loads roles';
    constructor(public roles: DropdownModel[]) { }
}

/**
 * Gets  status list
 */
export class RowStatusAction {
    static readonly type = '[dropdown] status';
    constructor(public status: DropdownModel[]) { }
}


/**
 * Gets  module name lists
 */
export class SysModuleAction {
    static readonly type = '[dropdown] system module names';
    constructor(public moduleNames: DropdownModel[]) { }
}

/**
 * Gets routing types for SPA app
 */
export class RouteTypesAction {
    static readonly type = '[dropdown] routing types';
    constructor(public routeTypes: DropdownModel[]) { }
}

/**
 * Gets routing value of area names
 */
export class AppAreasAction {
    static readonly type = '[dropdown] route value of areas';
    constructor(public routeAreas: DropdownModel[]) { }
}
