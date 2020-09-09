import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule
} from '../../../../../../../src/app/views/shared';
import { EmploymentResourceComponent } from './employment-resource.component';
import { EmploymentResourceFormComponent } from './employment-resource-form.component';
import { EmploymentResourceService } from './employment-resource.service';

@NgModule({
    declarations: [EmploymentResourceComponent, EmploymentResourceFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: EmploymentResourceComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatProgressSpinnerModule,
        MatCardModule, MatDividerModule,MatDatepickerModule,
        ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule
    ],
    exports: [],
    providers: [EmploymentResourceService],
    entryComponents: [EmploymentResourceFormComponent]
})
export class EmploymentResourceModule { }
