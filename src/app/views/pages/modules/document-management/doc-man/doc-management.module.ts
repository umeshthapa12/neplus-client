import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangesConfirmModule, DeleteConfirmModule, FiltersModule, ToastSnackbarModule } from '../../../../../../../src/app/views/shared';
import { DocumentManagementComponent } from './doc-management.component';
import { DocumentManagementFormComponent } from './doc-management-form.component';
import { DocumentManagementService } from './doc-management.service';
import { AutoChipComponent } from './auto-chicps.component';

@NgModule({
    declarations: [DocumentManagementComponent, DocumentManagementFormComponent, AutoChipComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: DocumentManagementComponent }
        ]), FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule,
        MatTooltipModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, PerfectScrollbarModule, MatMenuModule, MatProgressSpinnerModule, MatIconModule, ToastSnackbarModule,
        MatAutocompleteModule, MatChipsModule, NgbDropdownModule, FiltersModule, DeleteConfirmModule, ChangesConfirmModule
    ],
    exports: [],
    providers: [DocumentManagementService],
    entryComponents: [DocumentManagementFormComponent]
})
export class DocumentManagementModule { }
