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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, FiltersModule, StatusUpdatorModule, ToastSnackbarModule } from '../../../../../../../src/app/views/shared';
import { PersuadeFormComponent } from './persuade-form.component';
import { PersuadeComponent } from './persuade.component';
import { PersuadeService } from './persuade.service';

@NgModule({
    declarations: [PersuadeComponent, PersuadeFormComponent],
    imports: [CommonModule, RouterModule.forChild([
        { path: '', component: PersuadeComponent }
    ]),
        DeleteConfirmModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatTableModule, MatMenuModule, MatDialogModule, MatCheckboxModule, PerfectScrollbarModule,
        MatPaginatorModule, MatProgressSpinnerModule, ChangesConfirmModule, MatIconModule, DragDropModule,
        DirectivesModule, FiltersModule, StatusUpdatorModule, ToastSnackbarModule, MatSortModule,  MatTooltipModule
    ],
    exports: [],
    providers: [PersuadeService],
    entryComponents: [PersuadeFormComponent]
})
export class PersuadeModule { }
