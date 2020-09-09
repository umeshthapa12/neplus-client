import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxsModule } from '@ngxs/store';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { BasicInfoComponent } from './basic-info.component';
import { BasicInfoFormComponent } from './basic-info-form.component';
import { ExpandedComponent } from './child/expanded.component';
import { ChangesConfirmModule, DeleteConfirmModule, FiltersModule } from '../../../../../../../../src/app/views/shared';
import { EmployeeLazyDataState } from './store/employee.store';
import { BasicInfoService } from './basic-info-service';

@NgModule({
    declarations: [
        BasicInfoComponent, BasicInfoFormComponent, ExpandedComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: BasicInfoComponent }
        ]),
        NgxsModule.forFeature([
            EmployeeLazyDataState
        ]),
        FormsModule, ReactiveFormsModule, MatDialogModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule,
        MatDatepickerModule, MatTableModule, MatSortModule, MatPaginatorModule, PerfectScrollbarModule, MatCheckboxModule,
        MatMenuModule, MatProgressBarModule, NgxsModule,
        MatSelectModule, ChangesConfirmModule, DeleteConfirmModule, FiltersModule,

    ],
    exports: [],
    providers: [BasicInfoService],
    entryComponents: [BasicInfoFormComponent]
})
export class BasicInfoModule { }
