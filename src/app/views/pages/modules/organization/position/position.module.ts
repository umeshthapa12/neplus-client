import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionComponent } from './position.component';
import { PositionFormComponent } from './position-form.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
   MatProgressSpinnerModule,
    PerfectScrollbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule.forChild([
        {path: '', component: PositionComponent
    }
    ])
  ],
  declarations: [PositionComponent, PositionFormComponent]
})
export class PositionModule { }
