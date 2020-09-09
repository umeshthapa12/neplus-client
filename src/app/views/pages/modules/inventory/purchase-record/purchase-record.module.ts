import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRecordComponent } from './purchase-record.component';
import { PurchaseRecordFormComponent } from './purchase-record-form.component';
import { PurchaseRecordService } from './purchase-record.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ChangesConfirmModule, DeleteConfirmModule, FiltersModule } from '../../../../../../../src/app/views/shared';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutoChipComponent } from './auto-chicp.component';

@NgModule({
    declarations: [PurchaseRecordComponent, PurchaseRecordFormComponent, AutoChipComponent],
    imports: [CommonModule, RouterModule.forChild([
        { path: '', component: PurchaseRecordComponent }
    ]), FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule,
        MatCheckboxModule, MatSortModule, MatPaginatorModule, MatMenuModule, MatDialogModule, MatDatepickerModule,
        MatChipsModule, MatAutocompleteModule,
        MatTableModule, ChangesConfirmModule, DeleteConfirmModule, FiltersModule, PerfectScrollbarModule, NgbDropdownModule],
    exports: [],
    providers: [PurchaseRecordService],
    entryComponents: [PurchaseRecordFormComponent]
})
export class PurchaseRecordModule { }