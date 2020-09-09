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
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemGroupFormComponent } from './item-group-form.component';
import { ItemGroupComponent } from './item-group.component';
import { FiltersModule } from '../../../../../../../src/app/views/shared';
import {
    ChangesConfirmModule, DeleteConfirmModule, ToastSnackbarModule
} from '../../../../shared';
import { ItemGroupService } from './item-group.service';

@NgModule({
    declarations: [ItemGroupComponent, ItemGroupFormComponent],
    imports: [
        CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule,
        MatCheckboxModule, MatDatepickerModule, MatTooltipModule, MatDialogModule, ChangesConfirmModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, DeleteConfirmModule, ChangesConfirmModule,
        MatProgressSpinnerModule, MatMenuModule, PerfectScrollbarModule, FiltersModule, MatChipsModule, MatAutocompleteModule,
        MatIconModule, ToastSnackbarModule, NgbDropdownModule,
        RouterModule.forChild([
            { path: '', component: ItemGroupComponent }
        ])
    ],
    exports: [],
    providers: [ItemGroupService],
    entryComponents: [ItemGroupFormComponent]
})
export class ItemGroupModule {

}
