import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRankComponent } from './employee-rank.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeRankFormComponent } from './employee-rank-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule.forChild([
        {path: '', component: EmployeeRankComponent}
    ])
  ],
  declarations: [EmployeeRankComponent, EmployeeRankFormComponent]
})
export class EmployeeRankModule { }
