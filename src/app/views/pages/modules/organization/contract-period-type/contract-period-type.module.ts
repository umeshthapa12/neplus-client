import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractPeriodTypeComponent } from './contract-period-type.component';
import { ContractPeriodTypeFormComponent } from './contract-period-type-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        PerfectScrollbarModule,
        MatCardModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        RouterModule.forChild([
            { path: '', component: ContractPeriodTypeComponent }
        ])
    ],
    declarations: [ContractPeriodTypeComponent, ContractPeriodTypeFormComponent]
})
export class ContractPeriodTypeModule { }
