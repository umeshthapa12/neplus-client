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
import { ServiceSubGroupComponent } from './service-sub-group.component';
import { ServiceSubGroupFormComponent } from './service-sub-group-form.component';

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
        {path: '', component: ServiceSubGroupComponent}
    ])
  ],
  declarations: [ServiceSubGroupComponent, ServiceSubGroupFormComponent]
})
export class ServiceSubGroupModule { }
