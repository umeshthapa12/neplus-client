import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CdkTableModule } from '@angular/cdk/table';
import { PartialsModule } from '../../../../../../../src/app/views/partials/partials.module';
import { CoreModule } from '../../../../../../../src/app/core/core.module';
import { FiltersModule } from '../../../../../../../src/app/views/shared';
import { DashboardComponent } from './dashboard.component';
import { DartaService } from '../darta/darta.service';
import { ChalaniService } from '../chalani/chalani.service';

@NgModule({
    imports: [
        CommonModule,
        PartialsModule,
        CoreModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent
            },
        ]), MatTableModule, MatSortModule, MatPaginatorModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
        PerfectScrollbarModule,
        MatCheckboxModule, FiltersModule, MatMenuModule, MatSelectModule, NgbDropdownModule, CdkTableModule

    ],
    providers: [DartaService, ChalaniService],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
