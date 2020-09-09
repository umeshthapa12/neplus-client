import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, FiltersModule, ToastSnackbarModule } from '../../../../../../../src/app/views/shared';
import { BerujuSectionFormComponent } from './beruju-section-form.component';
import { BerujuSectionComponent } from './beruju-section.component';
import { BerujuSectionService } from './beruju-section.service';


@NgModule({
    declarations: [BerujuSectionComponent, BerujuSectionFormComponent],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: BerujuSectionComponent }
        ]), MatFormFieldModule, MatInputModule, MatDialogModule, MatSortModule, MatPaginatorModule, MatMenuModule,
        PerfectScrollbarModule, ChangesConfirmModule, DeleteConfirmModule, MatSelectModule, MatProgressSpinnerModule,
         MatTableModule, MatCheckboxModule, MatTooltipModule, ToastSnackbarModule, DirectivesModule,
        FiltersModule
    ],
    exports: [],
    providers: [BerujuSectionService],
    entryComponents: [BerujuSectionFormComponent]
})
export class BerujuSectionModule { }
