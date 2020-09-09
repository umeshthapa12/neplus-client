import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChangesConfirmModule, DeleteConfirmModule, FiltersModule, ToastSnackbarModule } from '../../../../shared';
import { RoleFormComponent } from './role-form.component';
import { RolesComponent } from './roles.component';
import { RoleService } from './roles.service';

@NgModule({
    declarations: [RolesComponent, RoleFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: RolesComponent }
        ]),
        PerfectScrollbarModule,
        ToastSnackbarModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        FiltersModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        // MatMenuModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatSortModule
    ],
    entryComponents: [RoleFormComponent],
    providers: [RoleService],
})
export class RolesModule { }
