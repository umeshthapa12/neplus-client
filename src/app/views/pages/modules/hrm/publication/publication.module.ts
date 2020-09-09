import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationComponent } from './publication.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { PublicationFormComponent } from './publication-form.component';
import { PublicationService } from './publication.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    DeleteConfirmModule,
    ChangesConfirmModule,
    MatDatepickerModule,
    RouterModule.forChild([
        {path: '', component: PublicationComponent}
    ])
  ],
  declarations: [PublicationComponent, PublicationFormComponent],
  entryComponents: [PublicationFormComponent],
  providers: [PublicationService]
})
export class PublicationModule { }
