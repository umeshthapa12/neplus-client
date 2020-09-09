import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
    ChangesConfirmModule, FiltersModule, DeleteConfirmModule, ToastSnackbarModule
} from '../../../../shared';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { OfficeComponent } from './office.component';
import { OfficeFormComponent } from './office-form.component';
import { OfficeService } from './office.service';

@NgModule({
    declarations: [OfficeComponent, OfficeFormComponent],
    imports: [
        CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule,
        MatCheckboxModule, MatDatepickerModule, MatTooltipModule, MatDialogModule, ChangesConfirmModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, DeleteConfirmModule, ChangesConfirmModule,
        MatProgressSpinnerModule, MatMenuModule, PerfectScrollbarModule, FiltersModule, MatChipsModule, MatAutocompleteModule,
        MatIconModule, ToastSnackbarModule, NgbDropdownModule,
        RouterModule.forChild([
            { path: '', component: OfficeComponent }
        ])
    ],
    exports: [],
    providers: [OfficeService],
    entryComponents: [OfficeFormComponent]
})
export class OfficeModule {

}
