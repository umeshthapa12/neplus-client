// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const hrmRoutes: Routes = [

    {
        path: 'main/hrm',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.hrm',
            moduleDisplayName: 'hrm'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashbaord.module').then(m => m.DashboardModule),
            },
            {
                path: 'employee/basic-info',
                loadChildren: () => import('./employee-management/basic-info/basic-info.module').then(m => m.BasicInfoModule),
            },
            {
                path: 'employee/travel-details',
                loadChildren: () => import('./employee-management/travel-details/travel-details.module').then(m => m.TravelDetailsModule),
            },
            {
                path: 'employee/education-details',
                loadChildren: () => import('./employee-management/education-details/education-details.module').then(m => m.EducationDetailsModule),
            },
            {
                path: 'employee/traning-details',
                loadChildren: () => import('./employee-management/traning-details/traninig-details.module').then(m => m.TraningDetailsModule),
            },
            {
                path: 'employee/medical-details',
                loadChildren: () => import('./employee-management/medical-details/medical-details.module').then(m => m.MedicalDetailsModule),
            },
            {
                path: 'employee/address-details',
                loadChildren: () => import('./employee-management/address-details/address-details.module').then(m => m.AddressDetailsModule),
            },
            {
                path: 'employee/personal-assets',
                loadChildren: () => import('./employee-management/asset-personal/asset.module').then(m => m.AssetModule),
            },
            {
                path: 'employee/asset-issue',
                loadChildren: () => import('./employee-management/asset-issue/asset-issue.module').then(m => m.AssetIssueModule),
            },
            {
                path: 'employee/salary-info',
                loadChildren: () => import('./employee-management/salary-info/salary.module').then(m => m.SalaryModule),
            },
            {
                path: 'employment-resource',
                loadChildren: () => import('./employment-resource/employment-resource.module').then(m => m.EmploymentResourceModule),
            },
            {
                path: 'employee/job-title',
                loadChildren: () => import('./job-title/job-title.module').then(m => m.JobTitleModule),
            },
            {
                path: 'employee/additional-record',
                loadChildren: () => import('./employee-management/additional-record/additional-record.module').then(m => m.AdditionalRecordModule),
            },

            {
                path: 'publication',
                loadChildren: () => import('./publication/publication.module').then(m => m.PublicationModule)
            },
            {
                path: 'performance',
                loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule)
            },
            {
                path: 'passport-details',
                loadChildren: () => import('./passport-details/passport-details.module').then(m => m.PassportDetailsModule)
            },
            {
                path: 'nominee-information',
                loadChildren: () => import('./nominee-information/nominee-information.module').then(m => m.NomineeInformationModule)
            },
            {
                path: 'loan-taken-history',
                loadChildren: () => import('./loan-taken-history/loan-taken-history.module').then(m => m.LoanTakenHistoryModule)
            },

            {
                path: 'family-details',
                loadChildren: () => import('./family-details/family-details.module').then(m => m.FamilyDetailsModule)
            },
            {
                path: 'award-detail',
                loadChildren: () => import('./award-detail/award-detail.module').then(m => m.AwardDetailModule)
            },
            {
                path: 'bank-account-details',
                loadChildren: () => import('./bank-account-details/bank-account-details.module').then(m => m.BankAccountDetailsModule)
            },
            {
                path: 'previous-employment-details',
                loadChildren: () => import('./previous-employement-detail/previous-employement-detail.module').then(m => m.PreviousEmployementDetailModule)
            },
            {
                path: 'job-allocaton-type',
                loadChildren: () => import('./job-allocation-type/job-allocation-type.module').then(m => m.JobAllocationTypeModule),
            },
            {
                path: 'job-mode',
                loadChildren: () => import('./job-mode/job-mode.module').then(m => m.JobModeModule),
            },
            {
                path: 'service-information',
                loadChildren: () => import('./service-information/service-information.module').then(m => m.ServiceInformationModule),
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
