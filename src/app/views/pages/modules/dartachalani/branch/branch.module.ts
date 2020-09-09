import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchComponent } from './branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { BranchFormComponent } from './branch-form.component';
import { BranchService } from './branch.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
    DeleteConfirmModule, ChangesConfirmModule, FiltersModule, ToastSnackbarModule
} from '../../../../../../../src/app/views/shared';

@NgModule({
    declarations: [BranchComponent, BranchFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: BranchComponent }
        ]), FormsModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatTooltipModule,
        MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, DeleteConfirmModule, ChangesConfirmModule, MatMenuModule,
        FiltersModule, MatProgressSpinnerModule, PerfectScrollbarModule, ToastSnackbarModule, MatSelectModule
    ],
    exports: [],
    providers: [BranchService],
    entryComponents: [BranchFormComponent]
})
export class BranchModule { }
