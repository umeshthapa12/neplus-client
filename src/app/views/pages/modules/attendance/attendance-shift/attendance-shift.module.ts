import { MatDialogModule } from '@angular/material/dialog';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { AttendanceShiftFormComponent } from './attendance-shift-form.component';
import { AttendanceShiftComponent } from './attendance-shift.component';


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
        MatDialogModule,
        MatSlideToggleModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceShiftComponent
            }
        ])
    ],
    declarations: [AttendanceShiftComponent, AttendanceShiftFormComponent],
    entryComponents: [AttendanceShiftFormComponent]
})
export class AttendanceShiftModule { }
