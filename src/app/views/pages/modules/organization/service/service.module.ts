import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { ServiceFormComponent } from './service-form.component';
import { ServiceService } from './service.service';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    PerfectScrollbarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    RouterModule.forChild([
        {path: '', component: ServiceComponent}
    ])
  ],
  declarations: [ServiceComponent, ServiceFormComponent],
  entryComponents: [ServiceFormComponent],
  providers: [ServiceService]
})
export class ServiceModule { }
