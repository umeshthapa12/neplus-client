import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemReturnComponent } from './item-return.component';
import { FiltersModule } from '../../../../../../../src/app/views/shared';
import { ItemReturnService } from './item-return.service';
import { ItemReturnFormComponent } from './item-return-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    MatTableModule,
    FiltersModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    RouterModule.forChild([
        { path: '' , component: ItemReturnComponent}
    ])
  ],
  declarations: [ItemReturnComponent, ItemReturnFormComponent],
  providers: [ItemReturnService],
  entryComponents: [ItemReturnFormComponent]
})
export class ItemReturnModule { }
