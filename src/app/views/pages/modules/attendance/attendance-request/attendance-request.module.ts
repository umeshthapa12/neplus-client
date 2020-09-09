import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { AttendanceRequestComponent } from './attendance-request.component';
import { AttendanceRequestFormComponent } from './attendance-request-form.component';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatSelectModule,
        DeleteConfirmModule,
        ChangesConfirmModule,
        MatDialogModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceRequestComponent
            }
        ])
    ],
    declarations: [AttendanceRequestComponent, AttendanceRequestFormComponent],
    entryComponents: [AttendanceRequestFormComponent]
})
export class AttendanceRequestModule { }
