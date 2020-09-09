import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import {
    ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule
} from '../../../../../../../../src/app/views/shared';
import { MedicalDetailsComponent } from './medical-details.component';
import { MedicalDetailsFormComponent } from './medical-details-form.component';
import { MedicalDetailsService } from './medical-details.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [MedicalDetailsComponent, MedicalDetailsFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: MedicalDetailsComponent }
        ]),
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
        MatDialogModule, MatDividerModule, MatCardModule, MatProgressSpinnerModule,
        ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule,
    ],
    exports: [],
    providers: [MedicalDetailsService],
    entryComponents: [MedicalDetailsFormComponent]
})
export class MedicalDetailsModule { }
