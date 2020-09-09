import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChangesConfirmModule, DeleteConfirmModule, FiltersModule, ToastSnackbarModule } from '../../../../../../../src/app/views/shared';
import { BranchService } from '../branch/branch.service';
import { ChalaniFormComponent } from './chalani-form.component';
import { ChalaniComponent } from './chalani.component';
import { ChalaniService } from './chalani.service';
import { AutoChipComponent } from './auto-chips/auto-chip';

@NgModule({
    declarations: [
        ChalaniComponent, ChalaniFormComponent, AutoChipComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: ChalaniComponent }
        ]),
        FormsModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatDatepickerModule,
        MatSelectModule, MatTooltipModule, MatTableModule, MatSortModule, MatPaginatorModule,
        PerfectScrollbarModule, MatProgressSpinnerModule, MatMenuModule, MatChipsModule, MatAutocompleteModule,
        MatIconModule, FiltersModule, DeleteConfirmModule, ChangesConfirmModule, ToastSnackbarModule, NgbDropdownModule
    ],
    exports: [],
    providers: [ChalaniService, BranchService],
    entryComponents: [ChalaniFormComponent]
})
export class ChalaniModule { }
