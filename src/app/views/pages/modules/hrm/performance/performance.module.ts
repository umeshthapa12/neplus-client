import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeleteConfirmModule, ChangesConfirmModule } from './../../../../shared';
import { PerformanceFormComponent } from './performance-form.component';
import { PerformanceService } from './performance.service';
import { PerformanceComponent } from './performance.component';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        FormsModule,
        DeleteConfirmModule,
        ChangesConfirmModule,
        MatDatepickerModule,
        RouterModule.forChild([
            { path: '', component: PerformanceComponent }
        ])
    ],
    declarations: [PerformanceComponent, PerformanceFormComponent],
    entryComponents: [PerformanceFormComponent],
    providers: [PerformanceService]
})
export class PerformanceModule { }
