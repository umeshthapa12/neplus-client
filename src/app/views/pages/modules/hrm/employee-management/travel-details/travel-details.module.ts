import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    FiltersModule, ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule
} from '../../../../../../../../src/app/views/shared';
import { TravelDetailsComponent } from './travel-details.component';
import { TravelDetailsFormComponent } from './travel-details-form.component';

import { TravelDetailsService } from './travel-details.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    declarations: [TravelDetailsComponent, TravelDetailsFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: TravelDetailsComponent }
        ]), FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatDialogModule,
        FiltersModule, ChangesConfirmModule, DeleteConfirmModule, MatSelectModule, MatCheckboxModule, MatDividerModule, MatCardModule,
        MatCardPlaceholderModule, MatProgressSpinnerModule, MatTooltipModule, MatDatepickerModule
    ],
    exports: [],
    providers: [TravelDetailsService],
    entryComponents: [TravelDetailsFormComponent]
})
export class TravelDetailsModule { }
