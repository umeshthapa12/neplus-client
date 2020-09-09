import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmModule, ChangesConfirmModule } from './../../../../shared';
import { AttendanceGroupComponent } from './attendance-group.component';
import { AttendanceGroupFormComponent } from './attendance-group-form.component';
import { AttendanceGroupService } from './attendance-group.service';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttendanceGroupComponent
            }
        ])
    ],
    declarations: [AttendanceGroupComponent, AttendanceGroupFormComponent],
    entryComponents: [AttendanceGroupFormComponent],
    providers: [AttendanceGroupService]
})
export class AttendanceGroupModule { }
