import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanTakenHistoryComponent } from './loan-taken-history.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoanTakenHistoryFormComponent } from './loan-taken-history-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
        {path: '', component: LoanTakenHistoryComponent}
    ])
  ],
  declarations: [LoanTakenHistoryComponent, LoanTakenHistoryFormComponent],
  entryComponents: [LoanTakenHistoryFormComponent]
})
export class LoanTakenHistoryModule { }
