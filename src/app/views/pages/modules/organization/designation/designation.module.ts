import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignationComponent } from './designation.component';
import { DesignationFormComponent } from './designation-form.component';
import { DesignationService } from './designation.service';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        RouterModule.forChild([
            { path: '', component: DesignationComponent }
        ])
    ],
    declarations: [DesignationComponent, DesignationFormComponent],
    providers: [DesignationService],
})
export class DesignationModule { }
