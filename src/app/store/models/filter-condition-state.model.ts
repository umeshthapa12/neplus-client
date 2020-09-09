import { DropdownModel } from '../../services';

export interface FilterConditionStateModel {
    filterConditions?: DropdownModel[];
}

export const initialFilterConditionState: FilterConditionStateModel = {
    filterConditions: null
};

