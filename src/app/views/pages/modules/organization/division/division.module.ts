import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionComponent } from './division.component';
import { DivisionFormComponent } from './division-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterModule.forChild([
            { path: '', component: DivisionComponent }
        ])
    ],
    declarations: [DivisionComponent, DivisionFormComponent]
})
export class DivisionModule { }
