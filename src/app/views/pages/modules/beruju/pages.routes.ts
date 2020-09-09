// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const berujuRoutes: Routes = [

    {
        path: 'main/beruju',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.beruju',
            moduleDisplayName: 'Beruju'
        },
        // TODO: we will enable it once the auth with token is done.
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'beruju-list',
                loadChildren: () => import('./beruju/beruju.module').then(m => m.BerujuModule),
            },
            {
                path: 'persuade',
                loadChildren: () => import('./persuade/persuade.module').then(m => m.PersuadeModule),
            },
            {
                path: 'section-beruju',
                loadChildren: () => import('./beruju-section/beruju-section.module').then(m => m.BerujuSectionModule),
            },
            {
                path: 'audit-beruju',
                loadChildren: () => import('./report/beruju-audit/beruju-audit.module').then(m => m.BerujuAuditModule),
            },
            {
                path: 'report-beruju',
                loadChildren: () => import('./report/beruju-report/beruju-report.module').then(m => m.BerujuReportModule),
            },
            {
                path: 'fiscal-year',
                loadChildren: () => import('./fiscal-year/fiscal-year.module').then(m => m.FiscalYearModule),
            },
            {
                path: 'office',
                loadChildren: () => import('./office/office.module').then(m => m.OfficeModule),
            },
            {
                path: 'error/403',
                component: ErrorPageComponent,
                data: {
                    type: 'error-v6',
                    code: 404,
                    title: '403... Access forbidden',
                    desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
                },
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
        ],
    }
];
