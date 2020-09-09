import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, FiltersModule, StatusUpdatorModule, ToastSnackbarModule } from '../../../../../../../src/app/views/shared';
import { BerujuSectionService } from '../beruju-section/beruju-section.service';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { OfficeService } from '../office/office.service';
import { BerujuFormComponent } from './beruju-form.component';
import { BerujuComponent } from './beruju.component';
import { BerujuService } from './beruju.service';
import { ExpandedComponent } from './child/expanded.component';

@NgModule({
    declarations: [BerujuComponent, BerujuFormComponent, ExpandedComponent],
    imports: [CommonModule,
        RouterModule.forChild([{ path: '', component: BerujuComponent }]),
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatTableModule, MatSortModule,
        MatMenuModule, MatSelectModule, MatCheckboxModule, MatProgressSpinnerModule, PerfectScrollbarModule,
        DeleteConfirmModule, MatPaginatorModule, MatTooltipModule, DragDropModule, ChangesConfirmModule,
        DirectivesModule, FiltersModule, StatusUpdatorModule, ToastSnackbarModule, MatTabsModule, MatIconModule
    ],
    exports: [],
    providers: [BerujuService, OfficeService, FiscalYearService, BerujuSectionService],
    entryComponents: [BerujuFormComponent]
})
export class BerujuModule { }
