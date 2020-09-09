import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, FiltersModule, ToastSnackbarModule } from '../../../../../../../src/app/views/shared';
import { FiscalYearFormComponent } from './fiscal-year-form.component';
import { FiscalYearComponent } from './fiscal-year.component';
import { FiscalYearService } from './fiscal-year.service';

@NgModule({
    declarations: [FiscalYearComponent, FiscalYearFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: FiscalYearComponent }
        ]),
        FormsModule, ReactiveFormsModule, MatDialogModule, MatMenuModule, MatInputModule, MatFormFieldModule,
        MatSelectModule, MatProgressSpinnerModule, MatTableModule, PerfectScrollbarModule, MatCheckboxModule, MatSortModule,
        MatPaginatorModule,  MatTooltipModule, ToastSnackbarModule, ChangesConfirmModule, DeleteConfirmModule,
        DirectivesModule, FiltersModule, MatCardModule
    ],
    exports: [],
    providers: [FiscalYearService],
    entryComponents: [FiscalYearFormComponent]
})
export class FiscalYearModule { }
