import { UsersModel, ResponseModel } from '../../models';

export class AppStateModel {
    activeUser?: UsersModel;
    isSessionExpired?: boolean;
    logoutSuccess?: ResponseModel;
    loginSuccess?: ResponseModel;
    changePasswordSuccess?: ResponseModel;
}
export const initialAppState: AppStateModel = {
    activeUser: null,
    logoutSuccess: null,
    isSessionExpired: null,
    loginSuccess: null,
    changePasswordSuccess: null
};
