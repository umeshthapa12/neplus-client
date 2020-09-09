// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from '../../../../views/theme/base/base.component';
import { ErrorPageComponent } from '../../../../views/theme/content/error-page/error-page.component';

export const inventoryRoutes: Routes = [

    {
        path: 'main/inventory',
        component: BaseComponent,
        data: {
            moduleName: 'neplus.module.inventory',
            moduleDisplayName: 'Inventory'
        },
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'item-setup',
                loadChildren: () => import('./item-setup/item-setup.module').then(m => m.ItemSetupModule),
            },
            {
                path: 'item-request',
                loadChildren: () => import('./item-request/item-request.module').then(m => m.ItemRequestModule),
            },
            {
                path: 'purchase-order',
                loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule),
            },
            {
                path: 'purchase-record',
                loadChildren: () => import('./purchase-record/purchase-record.module').then(m => m.PurchaseRecordModule),
            },
            {
                path: 'setting/item-group',
                loadChildren: () => import('./item-group/item-group.module').then(m => m.ItemGroupModule),
            },
            {
                path: 'item-return/item-return',
                loadChildren: () => import('./item-return/item-return.module').then(m => m.ItemReturnModule),
            },

            {
                path: 'setting/store-setup',
                loadChildren: () => import('./store-setup/store-setup.module').then(m => m.StoreSetupModule),
            },
            {
                path: 'setting/unit',
                loadChildren: () => import('./unit/unit.module').then(m => m.UnitModule),
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
