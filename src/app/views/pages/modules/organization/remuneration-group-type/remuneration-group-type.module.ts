import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemunerationGroupTypeComponent } from './remuneration-group-type.component';
import { RemunerationGroupTypeFormComponent } from './remuneration-group-type-form.component';


@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    RouterModule.forChild([
        {path: '', component: RemunerationGroupTypeComponent}
    ])
  ],
  declarations: [RemunerationGroupTypeComponent, RemunerationGroupTypeFormComponent]
})
export class RemunerationGroupTypeModule { }
