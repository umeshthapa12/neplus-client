import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UnitService } from './unit.service';
import { UnitFormComponent } from './unit-form.component';
import { UnitComponent } from './unit.component';
import { FiltersModule, ToastSnackbarModule } from '../../../../shared';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FiltersModule,
    MatMenuModule,
    MatSortModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    ToastSnackbarModule,
    RouterModule.forChild([
      { path: '', component: UnitComponent }
    ])
  ],
  declarations: [UnitComponent, UnitFormComponent],
  entryComponents: [UnitFormComponent],
  providers: [UnitService]
})
export class UnitModule { }
