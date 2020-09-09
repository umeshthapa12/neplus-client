import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractTypeComponent } from './contract-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContractTypeFormComponent } from './contract-type-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        PerfectScrollbarModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTooltipModule,
        MatPaginatorModule,
        RouterModule.forChild([
            { path: '', component: ContractTypeComponent }
        ])
    ],
    declarations: [ContractTypeComponent, ContractTypeFormComponent],
    entryComponents: [ContractTypeFormComponent]
})
export class ContractTypeModule { }
