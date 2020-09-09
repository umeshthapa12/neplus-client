import { ResponseModel, UsersModel } from '../../models';

/**
 * Repeated dataset of multiple sections should load at once
 * so we can access them from entire app using ngxs state management.
 * @link https://github.com/ngxs/store
 */
export class InitGlobalData {
    static readonly type = '[APP] initialize reusable startup dataset';
}

export class UserLoginAction {
    static readonly type = '[USER] user authenticate using credentials';
    constructor(public payload: UsersModel) { }
}

export class InitUserLoginAction {
    static readonly type = '[USER] user logged in';
    constructor(public response: ResponseModel) { }
}

export class LogoutAction {
    static readonly type = '[USER] is logout';
}

export class SessionExpiredAction {
    static readonly type = '[USER] session expired';
    constructor(public isExpired: boolean) { }
}

export class ChangePasswordAction {
    static readonly type = '[USER] change new password';
    constructor(public payload: { currentPassword: string, newPassword: string }) { }
}


/**
 * Refresh the authorization token using refresh token.
 * values are pulled from local storage for the http request header.
 */
export class RefreshTokenAction {
    static readonly type = '[USER] refresh authentication token for expired token';
}
