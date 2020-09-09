import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
    DeleteConfirmModule, DirectivesModule, FiltersModule, ChangesConfirmModule, ToastSnackbarModule
} from '../../../../../../../../src/app/views/shared';
import { BerujuReportService } from './beruju-report.service';
import { BerujuReportComponent } from './beruju-report.component';
import { BerujuReportFormComponent } from './beruju-report-form.component';
import { OfficeService } from '../../office/office.service';

@NgModule({
    declarations: [BerujuReportComponent, BerujuReportFormComponent],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: BerujuReportComponent }
        ]), MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatDialogModule, MatTableModule,
        PerfectScrollbarModule, DirectivesModule, MatProgressSpinnerModule, FiltersModule, MatMenuModule, MatPaginatorModule,
        MatSortModule, DeleteConfirmModule, ChangesConfirmModule, MatTableModule, ToastSnackbarModule
    ],
    exports: [],
    providers: [BerujuReportService, OfficeService],
    entryComponents: [BerujuReportFormComponent]
})
export class BerujuReportModule { }
