// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const attendanceRoutes: Routes = [

    {
        path: 'main/attendance',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.attendance',
            moduleDisplayName: 'Attendance'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'attendance-group',
                loadChildren: () => import('./attendance-group/attendance-group.module').then(m => m.AttendanceGroupModule)
            },
            {
                path: 'attendance-devices',
                loadChildren: () => import('./attendance-devices/attendance-devices.module').then(m => m.AttendanceDevicesModule)
            },
            {
                path: 'attendance-manual',
                loadChildren: () => import('./attendance-manual/attendance-manual.module').then(m => m.AttendanceManualModule)
            },
            {
                path: 'attendance-shift-working',
                loadChildren: () => import('./attendance-shift-working/attendance-shift-working.module').then(m => m.AttendanceShiftWorkingModule)
            },
            {
                path: 'attendance-monthly',
                loadChildren: () => import('./attendance-monthly/attendance-monthly.module').then(m => m.AttendanceMonthlyModule)
            },
            {
                path: 'attendance-request',
                loadChildren: () => import('./attendance-request/attendance-request.module').then(m => m.AttendanceRequestModule)
            },
            {
                path: 'attendance-shift',
                loadChildren: () => import('./attendance-shift/attendance-shift.module').then(m => m.AttendanceShiftModule),
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
