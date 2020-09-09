import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PreviousEmployementDetailComponent } from './previous-employement-detail.component';
import { PreviousEmploymentDetailFormComponent } from './previous-employment-detail-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        RouterModule.forChild([
            { path: '', component: PreviousEmployementDetailComponent }
        ])
    ],
    declarations: [PreviousEmployementDetailComponent, PreviousEmploymentDetailFormComponent],
    entryComponents: [PreviousEmploymentDetailFormComponent]
})
export class PreviousEmployementDetailModule { }
