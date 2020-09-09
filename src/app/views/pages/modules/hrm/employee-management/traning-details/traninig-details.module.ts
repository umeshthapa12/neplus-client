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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TraningDetailsComponent } from './traning-details.component';
import { TraningDetailsFormComponent } from './traning-details-form.component';
import {
    FiltersModule, ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule
} from '../../../../../../../../src/app/views/shared';
import { TraningDetailsService } from './traning-details.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [TraningDetailsComponent, TraningDetailsFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: TraningDetailsComponent }
        ]), FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatDialogModule,
        FiltersModule, ChangesConfirmModule, DeleteConfirmModule, MatSelectModule, MatCheckboxModule, MatDividerModule, MatCardModule,
        MatCardPlaceholderModule, MatProgressSpinnerModule, MatTooltipModule, MatDatepickerModule, MatSlideToggleModule
    ],
    exports: [],
    providers: [TraningDetailsService],
    entryComponents: [TraningDetailsFormComponent]
})
export class TraningDetailsModule { }
