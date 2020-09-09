import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { JobAllocationTypeComponent } from './job-allocation-type.component';
import { JobAllocationTypeFormComponent } from './job-allocation-type-form.component';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ChangesConfirmModule,
    DeleteConfirmModule,
    RouterModule.forChild([
        {
            path: '',
            component: JobAllocationTypeComponent
        }
    ])
  ],
  declarations: [JobAllocationTypeComponent, JobAllocationTypeFormComponent],
  entryComponents: [JobAllocationTypeFormComponent]
})
export class JobAllocationTypeModule { }
