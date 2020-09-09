// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// Core Module
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
// internal
import { PartialsModule } from '../../../../../../../src/app/views/partials/partials.module';
import { CoreModule } from '../../../../../../../src/app/core/core.module';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        PartialsModule,
        CoreModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent
            },
        ]), MatTableModule, MatSortModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatSelectModule
    ],
    providers: [DashboardService],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
