import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from '@angular/material/menu';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { LetterTypeComponent } from './letter-type.component';
import { LetterTypeService } from './letter-type.service';
import { LetterTypeFormComponent } from './letter-type-form.component';
import {ChangesConfirmModule, FiltersModule, DeleteConfirmModule, ToastSnackbarModule,
} from '../../../../shared';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    PerfectScrollbarModule,
    FiltersModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DeleteConfirmModule,
    ChangesConfirmModule,
    MatTooltipModule,
    ToastSnackbarModule,
    NgbDropdownModule,
    RouterModule.forChild([
        {path: '' , component: LetterTypeComponent}
    ])
  ],
  declarations: [LetterTypeComponent, LetterTypeFormComponent],
  entryComponents: [LetterTypeFormComponent],
  providers: [LetterTypeService]
})
export class LetterTypeModule { }
