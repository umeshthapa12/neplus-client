import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MatCardPlaceholderModule, DeleteConfirmModule, ChangesConfirmModule
} from '../../../../../../../../src/app/views/shared';
import { PunishmentComponent } from './punishment-details.component';
import { PunishmentFormComponent } from './punishment-details-form.component';
import { PunishmentService } from './punishment.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [PunishmentComponent, PunishmentFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: PunishmentComponent }
        ]),
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
        MatDialogModule, MatDividerModule, MatCardModule, MatDatepickerModule, MatSlideToggleModule,
        MatCardPlaceholderModule, DeleteConfirmModule, ChangesConfirmModule
    ],
    exports: [],
    providers: [PunishmentService],
    entryComponents: [PunishmentFormComponent]
})
export class PunishmentModule { }
