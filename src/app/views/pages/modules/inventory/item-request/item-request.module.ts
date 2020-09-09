import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ItemRequestService } from './item-request.service';
import { ItemRequestFormComponent } from './item-request-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemRequestComponent } from './item-request.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { FiltersModule } from '../../../../../../../src/app/views/shared';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    declarations: [ItemRequestComponent, ItemRequestFormComponent],
    imports: [
        CommonModule, RouterModule.forChild([
            { path: '', component: ItemRequestComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
        MatTableModule, MatSortModule, MatPaginatorModule, PerfectScrollbarModule, MatCheckboxModule, MatMenuModule, FiltersModule
        , MatDialogModule, MatIconModule, MatChipsModule, MatAutocompleteModule
    ],
    exports: [],
    providers: [ItemRequestService],
    entryComponents: [ItemRequestFormComponent]
})
export class ItemRequestModule { }
