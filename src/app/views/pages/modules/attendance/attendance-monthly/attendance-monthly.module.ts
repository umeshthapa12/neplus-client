import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmModule, ChangesConfirmModule } from './../../../../shared';
import { AttendanceMonthlyComponent } from './attendance-monthly.component';
import { AttendanceMonthlyFormComponent } from './attendance-monthly-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ChangesConfirmModule,
    DeleteConfirmModule,
    MatDatepickerModule,
    MatDialogModule,
    RouterModule.forChild([
        {
            path: '',
            component: AttendanceMonthlyComponent
        }
    ])
  ],
  declarations: [AttendanceMonthlyComponent, AttendanceMonthlyFormComponent],
  entryComponents: [AttendanceMonthlyFormComponent]
})
export class AttendanceMonthlyModule { }
