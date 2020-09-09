import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { AttendanceDevicesComponent } from './attendance-devices.component';
import { AttendanceDevicesFormComponent } from './attendance-devices-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatTooltipModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceDevicesComponent,
            }
        ])
    ],
    declarations: [AttendanceDevicesComponent, AttendanceDevicesFormComponent],
    entryComponents: [AttendanceDevicesFormComponent]
})
export class AttendanceDevicesModule { }
