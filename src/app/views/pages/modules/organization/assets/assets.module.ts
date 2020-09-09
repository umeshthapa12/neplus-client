import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets.component';
import { AssetsFormComponent } from './assets-form.component';
import { AssetsService } from './assets.service';


@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        PerfectScrollbarModule,
        MatCardModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        MatPaginatorModule,
        RouterModule.forChild([
            { path: '', component: AssetsComponent }
        ])
    ],
    declarations: [AssetsComponent, AssetsFormComponent],
    entryComponents: [AssetsFormComponent],
    providers: [AssetsService],
})
export class AssetsModule { }
