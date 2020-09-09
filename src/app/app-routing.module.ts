import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
import { berujuRoutes } from './views/pages/modules/beruju/pages.routes';
import { adminRoutes } from './views/pages/modules/admin/pages.routes';
import { dartaChalaniRoutes } from './views/pages/modules/dartachalani/pages.routes';
import { inventoryRoutes } from './views/pages/modules/inventory/pages.routes';
import { documentManagementRoutes } from './views/pages/modules/document-management/pages.routes';
import { organizationRoutes } from './views/pages/modules/organization/pages.routes';
import { hrmRoutes } from './views/pages/modules/hrm/pages.routes';
import { attendanceRoutes } from './views/pages/modules/attendance/pages.routes';
import { travelRoutes } from './views/pages/modules/travel/pages.routes';

const defaultRoutes: Routes = [

    { path: '', redirectTo: 'main/welcome', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
    {
        path: '',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.admin',
            moduleDisplayName: 'Apps'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'main/welcome',
                loadChildren: () => import('./views/pages/welcome/welcome.module').then(m => m.WelcomeModule)
            },
            // {
            //     path: 'main/license-management',
            //     loadChildren: () => import('./views/pages/modules/admin/license-management/license.module').then(m => m.LicenseModule)
            // },
            // {
            //     path: 'error/403',
            //     component: ErrorPageComponent,
            //     data: {
            //         type: 'error-v6',
            //         code: 403,
            //         title: '403... Access forbidden',
            //         desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
            //     },
            // },
        ]
    },
    {
        path: 'error/403',
        component: ErrorPageComponent,
        data: {
            type: 'error-v6',
            code: 403,
            title: '403... Access forbidden',
            desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
        },
    },
    { path: 'main', redirectTo: 'main/welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'error/403', pathMatch: 'full' },

];

const allRoutes = [

    // module pages routes
    ...adminRoutes,
    ...berujuRoutes,
    ...dartaChalaniRoutes,
    ...inventoryRoutes,
    ...documentManagementRoutes,
    ...organizationRoutes,
    ...hrmRoutes,
    ...attendanceRoutes,
    ...travelRoutes
];

@NgModule({
    imports: [
        RouterModule.forRoot([...allRoutes, ...defaultRoutes]),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
