import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import {
    ToastSnackbarModule, ChangesConfirmModule, DeleteConfirmModule, DirectivesModule
} from '../../../../../../../src/app/views/shared';
import { OfficeComponent } from './office.component';
import { OfficeFormComponent } from './office-form.component';
import { OfficeService } from './office.service';

@NgModule({
    declarations: [OfficeComponent, OfficeFormComponent],
    imports: [CommonModule,
        RouterModule.forChild([
            { path: '', component: OfficeComponent }
        ]),
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
        MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, PerfectScrollbarModule, MatTableModule, ToastSnackbarModule,
        MatSortModule, MatPaginatorModule, MatCheckboxModule, MatMenuModule, ChangesConfirmModule, DeleteConfirmModule, NgxsModule,
        DirectivesModule
    ],
    exports: [],
    providers: [OfficeService],
    entryComponents: [OfficeFormComponent]
})
export class OfficeModule { }
