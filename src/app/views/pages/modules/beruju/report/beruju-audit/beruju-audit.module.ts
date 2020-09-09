import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ChangesConfirmModule, DeleteConfirmModule, FiltersModule, DirectivesModule, ToastSnackbarModule
} from '../../../../../../../../src/app/views/shared';
import { LetterPreviewComponent } from './letter-preview.component';
import { BerujuAuditService } from './beruju-audit.service';
import { BerujuAuditComponent } from './beruju-audit.component';
import { BerujuAuditFormComponent } from './beruju-audit-form.component';

@NgModule({
    declarations: [BerujuAuditComponent, BerujuAuditFormComponent, LetterPreviewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: BerujuAuditComponent }
        ]), FormsModule, ReactiveFormsModule, MatDialogModule, MatProgressSpinnerModule, ChangesConfirmModule, DeleteConfirmModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, PerfectScrollbarModule, MatTableModule, MatCheckboxModule,
        FiltersModule, DirectivesModule, MatMenuModule, MatSortModule, MatPaginatorModule, MatTooltipModule, ToastSnackbarModule
    ],
    exports: [],
    providers: [BerujuAuditService],
    entryComponents: [BerujuAuditFormComponent, LetterPreviewComponent]
})
export class BerujuAuditModule {

}
