// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const dartaChalaniRoutes: Routes = [

    {
        path: 'main/dartachalani',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.dartachalani',
            moduleDisplayName: 'Darta Chalani'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'darta',
                loadChildren: () => import('./darta/darta.module').then(m => m.DartaModule),
            },
            {
                path: 'chalani',
                loadChildren: () => import('./chalani/chalani.module').then(m => m.ChalaniModule),
            },
            {
                path: 'branch',
                loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule),
            },
            {
                path: 'office',
                loadChildren: () => import('./office/office.module').then(m => m.OfficeModule),
            },
            {
                path: 'letter-type',
                loadChildren: () => import('./letter-type/letter-type.module').then(m => m.LetterTypeModule),
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
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
        ],
    },
];
