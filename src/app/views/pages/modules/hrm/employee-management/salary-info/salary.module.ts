import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardPlaceholderModule, DeleteConfirmModule, ChangesConfirmModule } from '../../../../../../../../src/app/views/shared';
import { SalaryComponent } from './salary.component';
import { SalaryFormComponent } from './salary-form.component';
import { SalaryService } from './salary.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [SalaryComponent, SalaryFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: SalaryComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
        MatDividerModule, MatCardModule, MatProgressSpinnerModule, MatDatepickerModule, MatCheckboxModule, MatTooltipModule,
        MatCardPlaceholderModule, DeleteConfirmModule, ChangesConfirmModule
    ],
    exports: [],
    providers: [SalaryService],
    entryComponents: [SalaryFormComponent]
})
export class SalaryModule { }
