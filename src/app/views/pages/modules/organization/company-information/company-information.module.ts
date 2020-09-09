import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CompanyInformationComponent } from './company-information.component';
import { CompanyInformationService } from './company-information.service';
import { CompanyInformationFormComponent } from './company-information-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        PerfectScrollbarModule,
        MatDialogModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        RouterModule.forChild([
            { path: '', component: CompanyInformationComponent }
        ])
    ],
    declarations: [CompanyInformationComponent, CompanyInformationFormComponent],
    providers: [CompanyInformationService],
    entryComponents: [CompanyInformationFormComponent]

})
export class CompanyInformationModule { }
