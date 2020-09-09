import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
import { AutoChipComponent } from './auto-chicp.component';
import { DartaFormComponent } from './darta-form.component';
import { DartaComponent } from './darta.component';
import { DartaService } from './darta.service';

@NgModule({
    declarations: [DartaComponent, DartaFormComponent, AutoChipComponent],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule,
        MatCheckboxModule, MatDatepickerModule, MatTooltipModule, MatDialogModule, ChangesConfirmModule,
        MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, DeleteConfirmModule, ChangesConfirmModule,
        MatProgressSpinnerModule, MatMenuModule, PerfectScrollbarModule, FiltersModule, MatChipsModule, MatAutocompleteModule,
        MatIconModule, ToastSnackbarModule, NgbDropdownModule,
        RouterModule.forChild([
            { path: '', component: DartaComponent }
        ])
    ],
    exports: [],
    providers: [DartaService, BranchService],
    entryComponents: [DartaFormComponent]
})
export class DartaModule {

}
