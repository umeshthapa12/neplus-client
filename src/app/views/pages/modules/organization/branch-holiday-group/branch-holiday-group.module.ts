import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchHolidayGroupComponent } from './branch-holiday-group.component';
import { BranchHolidayGroupFormComponent } from './branch-holiday-group-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        PerfectScrollbarModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        RouterModule.forChild([
            { path: '', component: BranchHolidayGroupComponent }
        ])
    ],
    declarations: [BranchHolidayGroupComponent, BranchHolidayGroupFormComponent]
})
export class BranchHolidayGroupModule { }
