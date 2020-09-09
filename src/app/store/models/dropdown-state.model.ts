import { DropdownModel } from '../../services';

export interface DropdownStateModel {
    jobCategories?: DropdownModel[];
    CompanyTypes?: DropdownModel[];
    SystemRoles?: DropdownModel[];
    RowStatus?: DropdownModel[];
    SysModule?: DropdownModel[];
    RouteTypes?: DropdownModel[];
    AppAreas?: DropdownModel[];
}

export const initialDropdownState: DropdownStateModel = {
    AppAreas: null,
    CompanyTypes: null,
    RouteTypes: null,
    RowStatus: null,
    SysModule: null,
    SystemRoles: null,
    jobCategories: null
};

