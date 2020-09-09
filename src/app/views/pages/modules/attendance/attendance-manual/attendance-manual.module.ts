import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceManualComponent } from './attendance-manual.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DeleteConfirmModule, ChangesConfirmModule } from '../../../../shared';
import { AttendanceManualFormComponent } from './attendance-manual-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceManualComponent
            }
        ])
    ],
    declarations: [AttendanceManualComponent, AttendanceManualFormComponent],
    entryComponents: [AttendanceManualFormComponent]
})
export class AttendanceManualModule { }
