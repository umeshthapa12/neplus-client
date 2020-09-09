import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeputationComponent } from './deputation.component';
import { DeputationFormComponent } from './deputation-form.component';
import { DeputationService } from './deputation.service';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterModule.forChild([
            { path: '', component: DeputationComponent }
        ])
    ],
    declarations: [DeputationComponent, DeputationFormComponent],
    entryComponents: [DeputationFormComponent],
    providers: [DeputationService]
})
export class DeputationModule { }
