import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { AttendanceShiftWorkingComponent } from './attendance-shift-working.component';
import { AttendanceShiftWorkingFormComponent } from './attendance-shift-working-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceShiftWorkingComponent,
            }
        ])
    ],
    declarations: [AttendanceShiftWorkingComponent, AttendanceShiftWorkingFormComponent],
    entryComponents: [AttendanceShiftWorkingFormComponent]
})
export class AttendanceShiftWorkingModule { }
