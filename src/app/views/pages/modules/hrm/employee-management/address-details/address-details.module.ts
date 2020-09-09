import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AddressDetailsComponent } from './address-details.component';
import { AddressDetailsFormComponent } from './address-details-form.component';
import { AddressDetailsService } from './address-details.service';
import { ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule } from '../../../../../../../../src/app/views/shared';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    declarations: [AddressDetailsComponent, AddressDetailsFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: AddressDetailsComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
        MatDividerModule, MatProgressSpinnerModule, MatCardModule, MatDatepickerModule,
        ChangesConfirmModule, DeleteConfirmModule, MatCardPlaceholderModule
    ],
    exports: [],
    providers: [AddressDetailsService],
    entryComponents: [AddressDetailsFormComponent]
})
export class AddressDetailsModule { }

