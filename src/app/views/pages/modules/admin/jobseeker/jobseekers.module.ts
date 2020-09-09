import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from '../../../../../core/core.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { ExpandedComponent } from './child/expanded.component';
import { JobSeekerService } from './jobseeker.service';
import { JobseekersComponent } from './jobseekers.component';
import { JobseekerState } from './store/jobseeker.store';
import { ToastSnackbarModule, ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, FiltersModule } from '../../../../shared';

@NgModule({
    declarations: [JobseekersComponent, ExpandedComponent],
    imports: [
        CommonModule,
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
                component: JobseekersComponent
            },
        ]),
        NgxsModule.forFeature([
            JobseekerState
        ]),
        FiltersModule,
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDividerModule,
    ],
    providers: [JobSeekerService],
})
export class JobSeekersModule { }
