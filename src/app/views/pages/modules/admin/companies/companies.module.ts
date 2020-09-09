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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from '../../../../../core/core.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, FiltersModule, ToastSnackbarModule } from '../../../../shared';
import { ExpandedComponent } from './child/expanded.component';
import { ImageUiComponent } from './child/image-ui.component';
import { CompaniesComponent } from './companies.component';
import { CompanyFormComponent } from './company-form.component';
import { CompanyService } from './company.service';
import { CompanyState } from './store/companies.store';

@NgModule({
    declarations: [CompaniesComponent, CompanyFormComponent, ImageUiComponent, ExpandedComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PartialsModule,
        CoreModule,
        ToastSnackbarModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        DirectivesModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: CompaniesComponent
            },
        ]),
        NgxsModule.forFeature([
            CompanyState
        ]),
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
        FiltersModule,
        MatProgressBarModule,
    ],
    entryComponents: [CompanyFormComponent],
    providers: [CompanyService],
})
export class CompaniesModule { }
