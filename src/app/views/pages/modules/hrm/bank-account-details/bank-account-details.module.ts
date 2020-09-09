import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountDetailsComponent } from './bank-account-details.component';
import { BankAccountDetailsFormComponent } from './bank-account-details-form.component';
import { BankAccountDetailsService } from './bank-account-details.service';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule.forChild([
        {path: '', component: BankAccountDetailsComponent}
    ])
  ],
  declarations: [BankAccountDetailsComponent, BankAccountDetailsFormComponent],
  entryComponents: [BankAccountDetailsFormComponent],
  providers: [BankAccountDetailsService]
})
export class BankAccountDetailsModule { }
