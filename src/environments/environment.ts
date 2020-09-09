// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { UsersModel } from "../app/models";
export const environment = {
    production: false,
    isMockEnabled: true, // You have to switch this, when your real back-end is done
    authTokenKey: "",
    baseUrl: "http://192.168.1.68:4000",
    /**
     * Predefined user cred for development propose only.
     */
    user: { username: "admin", password: "Adm!n4321" } as UsersModel,
};