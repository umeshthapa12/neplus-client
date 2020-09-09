import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DeleteConfirmModule , ChangesConfirmModule} from './../../../../shared';
import { PassportDetailsFormComponent } from './passport-details-form.component';
import { PassportDetailsComponent } from './passport-details.component';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    ChangesConfirmModule,
    DeleteConfirmModule,
    MatDatepickerModule,
    RouterModule.forChild([
        {path: '', component: PassportDetailsComponent}
    ])
  ],
  declarations: [PassportDetailsComponent, PassportDetailsFormComponent],
  entryComponents: [PassportDetailsFormComponent]
})
export class PassportDetailsModule { }
