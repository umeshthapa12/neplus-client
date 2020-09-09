import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConfirmModule, ChangesConfirmModule, MatCardPlaceholderModule } from '../../../../../../../../src/app/views/shared';
import { AttendanceComponent } from './attendance.component';
import { AttendanceFormComponent } from './attendance-form.component';
import { AttendanceService } from './attendance.service';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [AttendanceComponent, AttendanceFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: AttendanceComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
        MatProgressSpinnerModule, MatCardPlaceholderModule, MatDividerModule, MatTooltipModule, MatCardModule,
        DeleteConfirmModule, ChangesConfirmModule, MatCardPlaceholderModule
    ],
    exports: [],
    providers: [AttendanceService],
    entryComponents: [AttendanceFormComponent]
})
export class AttendanceModule { }
