import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { FamilyDetailsComponent } from './family-details.component';
import { FamilyDetailsFormComponent } from './family-details-form.component';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        DeleteConfirmModule,
        ChangesConfirmModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        RouterModule.forChild([
            { path: '', component: FamilyDetailsComponent }
        ])
    ],
    declarations: [FamilyDetailsComponent, FamilyDetailsFormComponent],
    entryComponents: [FamilyDetailsFormComponent]
})
export class FamilyDetailsModule { }
