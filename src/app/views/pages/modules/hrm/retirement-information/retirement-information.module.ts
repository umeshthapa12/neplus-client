import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetirementInformationComponent } from './retirement-information.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared/';
import { RetirementInformationService } from './retirement-information.service';
import { RetirementInformationFormComponent } from './retirement-information-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        PerfectScrollbarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        DeleteConfirmModule,
        ChangesConfirmModule,
        MatDialogModule,
        RouterModule.forChild([
            { path: '', component: RetirementInformationComponent }
        ])
    ],
    declarations: [RetirementInformationComponent, RetirementInformationFormComponent],
    entryComponents: [RetirementInformationFormComponent],
    providers: [RetirementInformationService]
})
export class RetirementInformationModule { }
