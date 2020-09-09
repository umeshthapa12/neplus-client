import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
// internal
import { ChangesConfirmModule, DeleteConfirmModule, FiltersModule } from '../../../../../../../src/app/views/shared';
import { ItemSetupFormComponent } from './item-setup-form.component';
import { ItemSetupService } from './item-setup.service';
import { ItemSetupComponent } from './item-setup.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ItemSetupComponent, ItemSetupFormComponent],
    imports: [CommonModule, RouterModule.forChild([
        { path: '', component: ItemSetupComponent }
    ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule,
        MatCheckboxModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatProgressSpinnerModule, PerfectScrollbarModule, MatMenuModule, DeleteConfirmModule, ChangesConfirmModule,
        FiltersModule, NgbDropdownModule
    ],
    exports: [],
    providers: [ItemSetupService],
    entryComponents: [ItemSetupFormComponent]
})
export class ItemSetupModule { }
