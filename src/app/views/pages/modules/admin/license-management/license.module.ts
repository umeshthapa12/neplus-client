import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxsModule } from '@ngxs/store';
import { FiltersModule, ChangesConfirmModule } from '../../../../../../../src/app/views/shared';
import { LicenseComponent } from './license.component';
import { LicenseService } from './license.service';
import { LicenseFormComponent } from './license-form.component';

@NgModule({
    declarations: [LicenseComponent, LicenseFormComponent],
    imports: [CommonModule,
        RouterModule.forChild([
            { path: '', component: LicenseComponent }
        ]), MatProgressSpinnerModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatSortModule,
        MatMenuModule, PerfectScrollbarModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule,
        NgxsModule, FiltersModule, ChangesConfirmModule],
    exports: [],
    providers: [LicenseService],
    entryComponents: [LicenseFormComponent]
})
export class LicenseModule { }
