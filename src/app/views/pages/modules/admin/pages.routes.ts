// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const adminRoutes: Routes = [

    {
        path: 'main/admin',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.admin',
            moduleDisplayName: 'Apps'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'companies',
                loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule)
            },
            {
                path: 'job-seeker',
                loadChildren: () => import('./jobseeker/jobseekers.module').then(m => m.JobSeekersModule)
            },
            {
                path: 'setting/roles',
                loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
            },
            {
                path: 'setting/users',
                loadChildren: () => import('./accounts/user-account.module').then(m => m.UserAccountModule)
            },
            {
                path: 'setting/navs',
                loadChildren: () => import('./dynamic-navs/site-navs.module').then(m => m.SiteNavsModule)
            },
            {
                path: 'setting/mail-server',
                loadChildren: () => import('./mail-server/mail-server.module').then(m => m.MailServerModule)
            },
            {
                path: 'setting/mail-templates',
                loadChildren: () => import('./mail-template/mail-template.module').then(m => m.MailTemplateModule)
            },
            {
                path: 'setting/sms-server',
                loadChildren: () => import('./sms-server/sms-server.module').then(m => m.SmsServerModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'license-management',
                loadChildren: () => import('./license-management/license.module').then(m => m.LicenseModule)
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
            { path: '', redirectTo: 'main/welcome', pathMatch: 'full' },
            { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
        ],
    },
];
