import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobTitleComponent } from './job-title.component';
import { JobTitleFormComponent } from './job-title-form.component';
import { JobTitleService } from './job-title.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatCardPlaceholderModule, DeleteConfirmModule, ChangesConfirmModule } from '../../../../../../../src/app/views/shared';

@NgModule({
    declarations: [JobTitleComponent, JobTitleFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: JobTitleComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatProgressSpinnerModule,
        MatDialogModule, MatDividerModule, MatCardModule,
        MatCardPlaceholderModule, DeleteConfirmModule, ChangesConfirmModule
    ],
    exports: [],
    providers: [JobTitleService],
    entryComponents: [JobTitleService]
})
export class JobTitleModule { }
