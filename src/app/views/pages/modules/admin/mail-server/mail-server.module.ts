import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from '../../../../../core/core.module';
import { PartialsModule } from '../../../../partials/partials.module';
import { MailServerFormComponent } from './mail-server-form.component';
import { MailServerComponent } from './mail-server.component';
import { MailServerService } from './mail-server.service';
import { ToastSnackbarModule, ChangesConfirmModule, DeleteConfirmModule, DirectivesModule, StatusUpdatorModule, FiltersModule } from '../../../../shared';

@NgModule({
    declarations: [MailServerComponent, MailServerFormComponent],
    entryComponents: [MailServerFormComponent],
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
        StatusUpdatorModule,
        PerfectScrollbarModule,
        RouterModule.forChild([
            {
                path: '',
                component: MailServerComponent
            },
        ]),
        FiltersModule,
        MatMenuModule,
        MatSortModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSlideToggleModule,
        DragDropModule,
        MatSelectModule,
    ],
    providers: [MailServerService],
})
export class MailServerModule { }
