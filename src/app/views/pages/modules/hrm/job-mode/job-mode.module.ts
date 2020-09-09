import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { JobModeFormComponent } from './job-mode-form.component';
import { JobModeComponent } from './job-mode.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        MatSelectModule,
        RouterModule.forChild([
            {
                path: '',
                component: JobModeComponent,
            }
        ])
    ],
    declarations: [JobModeComponent, JobModeFormComponent],
    entryComponents: [JobModeFormComponent]
})
export class JobModeModule { }
