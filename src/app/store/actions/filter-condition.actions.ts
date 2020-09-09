import { DropdownModel } from '../../services';

export class InitFilterActions {
    static readonly type = '[filter] init on app start';
}

export class FilterConditionsAction {
    static readonly type = '[filter] loads filter conditions';
    constructor(public filterConditions: DropdownModel[]) { }
}
