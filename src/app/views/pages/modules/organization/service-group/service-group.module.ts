import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceGroupComponent } from './service-group.component';
import { ServiceGroupFormComponent } from './service-group-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    PerfectScrollbarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule.forChild([
        {path: '', component: ServiceGroupComponent}
    ])
  ],
  declarations: [ServiceGroupComponent, ServiceGroupFormComponent]
})
export class ServiceGroupModule { }
