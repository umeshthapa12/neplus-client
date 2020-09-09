import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarbandiComponent } from './darbandi.component';
import { DarbandiFormComponent } from './darbandi-form.component';
import { DarbandiService } from './darbandi.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    RouterModule.forChild([
        {path: '', component: DarbandiComponent}
    ])
  ],
  declarations: [DarbandiComponent, DarbandiFormComponent],
  providers: [DarbandiService]
})
export class DarbandiModule { }
