import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from '../../../../../core/core.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { ExpandedComponent } from './child/expanded.component';
import { UserAddOrUpdateState, UserLazyDataState } from './store/users.store';
import { UserAccountComponent } from './user-account.component';
import { UserService } from './user-account.service';
import { UserFormComponent } from './user-form.component';
import { UserMainComponent } from './user-main.component';
import { UserPermissionComponent } from './user-permission.component';
import { DirectivesModule, StatusUpdatorModule, ToastSnackbarModule, ChangesConfirmModule, DeleteConfirmModule, FiltersModule } from '../../../../shared';
@NgModule({

    declarations: [UserAccountComponent, UserFormComponent, UserMainComponent, UserPermissionComponent, ExpandedComponent],
    entryComponents: [UserMainComponent],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        PartialsModule,
        CoreModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: UserAccountComponent
            },
        ]),
        NgxsModule.forFeature([
            UserLazyDataState,
            UserAddOrUpdateState
        ]),
        StatusUpdatorModule,
        ToastSnackbarModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        FiltersModule,
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatTabsModule,
        MatTreeModule,
        CdkTreeModule,
        MatButtonModule,
        DragDropModule
    ],
    providers: [UserService],
})
export class UserAccountModule { }
