// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const organizationRoutes: Routes = [

    {
        path: 'main/organization',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.organization',
            moduleDisplayName: 'Organization'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'branch',
                loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule),
            },
            {
                path: 'company-information',
                loadChildren: () => import('./company-information/company-information.module').then(m => m.CompanyInformationModule),
            },
            {
                path: 'assets',
                loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule),
            },
            {
                path: 'contract-period-type',
                loadChildren: () => import('./contract-period-type/contract-period-type.module').then(m => m.ContractPeriodTypeModule)
            },
            {
                path: 'contract-type',
                loadChildren: () => import('./contract-type/contract-type.module').then(m => m.ContractTypeModule)
            },
            {
                path: 'darbandi',
                loadChildren: () => import('./darbandi/darbandi.module').then(m => m.DarbandiModule)
            },
            {
                path: 'department',
                loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule)
            },
            {
                path: 'deputation',
                loadChildren: () => import('./deputation/deputation.module').then(m => m.DeputationModule)
            },
            {
                path: 'designation',
                loadChildren: () => import('./designation/designation.module').then(m => m.DesignationModule)
            },
            {
                path: 'division',
                loadChildren: () => import('./division/division.module').then(m => m.DivisionModule)
            },
            {
                path: 'grade',
                loadChildren: () => import('./grade/grade.module').then(m => m.GradeModule)
            },
            {
                path: 'job-post',
                loadChildren: () => import('./job-post/job.module').then(m => m.JobModule)
            },
            {
                path: 'joining-as',
                loadChildren: () => import('./joining-as/joining-as.module').then(m => m.JoiningAsModule)
            },
            {
                path: 'location',
                loadChildren: () => import('./location/location.module').then(m => m.LocationModule)
            },
            {
                path: 'position',
                loadChildren: () => import('./position/position.module').then(m => m.PositionModule)
            },

            {
                path: 'remuneration-group',
                loadChildren: () => import('./remuneration-group/remuneration-group.module').then(m => m.RemunerationGroupModule)
            },
            {
                path: 'remuneration-group-type',
                loadChildren: () => import('./remuneration-group-type/remuneration-group-type.module').then(m => m.RemunerationGroupTypeModule)
            },
            {
                path: 'retirement-type',
                loadChildren: () => import('./retirement-type/retirement-type.module').then(m => m.RetirementTypeModule)
            },
            {
                path: 'section',
                loadChildren: () => import('./section/section.module').then(m => m.SectionModule)
            },
            {
                path: 'service',
                loadChildren: () => import('./service/service.module').then(m => m.ServiceModule)
            },
            {
                path: 'service-group',
                loadChildren: () => import('./service-group/service-group.module').then(m => m.ServiceGroupModule)
            },
            {
                path: 'service-sub-group',
                loadChildren: () => import('./service-sub-group/service-sub-group.module').then(m => m.ServiceSubGroupModule)
            },
            {
                path: 'working-status',
                loadChildren: () => import('./working-status/working-status.module').then(m => m.WorkingStatusModule)
            },
            {
                path: 'branch-holiday-group',
                loadChildren: () => import('./branch-holiday-group/branch-holiday-group.module').then(m => m.BranchHolidayGroupModule)
            },
            {
                path: 'emp-level-position',
                loadChildren: () => import('./employee-level-position/employee-level-position.module').then(m => m.EmployeeLevelPositionModule)
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
