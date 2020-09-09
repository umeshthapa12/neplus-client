import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeleteConfirmModule, ChangesConfirmModule } from './../../../../shared';
import { AwardDetailService } from './award-detail.service';
import { AwardDetailComponent } from './award-detail.component';
import { AwardDetailFormComponent } from './award-detail-form.component';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        DeleteConfirmModule,
        ChangesConfirmModule,
        RouterModule.forChild([
            { path: '', component: AwardDetailComponent }
        ])
    ],
    declarations: [AwardDetailComponent, AwardDetailFormComponent],
    entryComponents: [AwardDetailFormComponent],
    providers: [AwardDetailService]
})
export class AwardDetailModule { }
