import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PurchaseOrderFormComponent } from './purchase-order-form.component';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderService } from './purchase-order.service';
import { DeleteConfirmModule, ChangesConfirmModule, FiltersModule } from '../../../../../../../src/app/views/shared';
import { AutoChipComponent } from './auto-chicps.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PurchaseOrderComponent, PurchaseOrderFormComponent, AutoChipComponent],
    imports: [
        CommonModule, RouterModule.forChild([
            { path: '', component: PurchaseOrderComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule,
        ChangesConfirmModule, MatCheckboxModule, DeleteConfirmModule, MatTooltipModule, MatTableModule, MatPaginatorModule,
        MatSortModule, MatChipsModule, FiltersModule, MatProgressSpinnerModule, PerfectScrollbarModule, MatMenuModule,
        MatAutocompleteModule, MatIconModule, MatDatepickerModule, NgbDropdownModule

    ],
    exports: [],
    providers: [PurchaseOrderService],
    entryComponents: [PurchaseOrderFormComponent]
})
export class PurchaseOrderModule { }
