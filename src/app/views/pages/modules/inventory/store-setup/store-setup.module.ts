import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreSetupComponent } from './store-setup.component';
import { FiltersModule } from '../../../../../../../src/app/views/shared';
import { StoreSetupFormComponent } from './store-setup-form.component';
import { StoreSetupService } from './store-setup.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatPaginatorModule,
    PerfectScrollbarModule,
    MatSortModule,
    FiltersModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTooltipModule,
    MatSelectModule,
    NgbDropdownModule,
    RouterModule.forChild([
        { path: '' , component: StoreSetupComponent}
    ])
  ],
  declarations: [StoreSetupComponent, StoreSetupFormComponent],
  providers: [StoreSetupService],
  entryComponents: [StoreSetupFormComponent],
})
export class StoreSetupModule { }
