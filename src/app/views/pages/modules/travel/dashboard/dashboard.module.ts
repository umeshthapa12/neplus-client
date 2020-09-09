import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../inventory/dashboard/dashboard.service';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: DashboardComponent }
        ])
    ],
    exports: [],
    providers: [DashboardService],
})
export class DashboardModule { }
