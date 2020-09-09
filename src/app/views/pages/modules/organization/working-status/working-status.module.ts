import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkingStatusComponent } from './working-status.component';
import { WorkingStatusFormComponent } from './working-status-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    PerfectScrollbarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    RouterModule.forChild([
        {path: '', component: WorkingStatusComponent}
    ])
  ],
  declarations: [WorkingStatusComponent, WorkingStatusFormComponent]
})
export class WorkingStatusModule { }
