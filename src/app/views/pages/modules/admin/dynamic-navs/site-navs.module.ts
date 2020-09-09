import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from '../../../../../core/core.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { SiteNavFormComponent } from './site-navs-form.component';
import { SiteNavsComponent } from './site-navs.component';
import { SiteNavService } from './site-navs.service';
import { ToastSnackbarModule, ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, StatusUpdatorModule, FiltersModule } from '../../../../shared';
import { ThemeModule } from '../../../../theme/theme.module';

@NgModule({
    declarations: [SiteNavsComponent, SiteNavFormComponent],
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
                component: SiteNavsComponent
            },
        ]),
        StatusUpdatorModule,
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
        MatRadioModule,
        MatAutocompleteModule,
        ThemeModule,
    ],
    entryComponents: [SiteNavFormComponent],
    providers: [SiteNavService],
})
export class SiteNavsModule { }
