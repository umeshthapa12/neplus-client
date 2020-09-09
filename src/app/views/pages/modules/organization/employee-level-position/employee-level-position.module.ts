import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLevelPositionComponent } from './employee-level-position.component';
import { EmployeeLevelPositionFormComponent } from './employee-level-position-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
        {path: '', component: EmployeeLevelPositionComponent}
    ])
  ],
  declarations: [EmployeeLevelPositionComponent, EmployeeLevelPositionFormComponent]
})
export class EmployeeLevelPositionModule { }
