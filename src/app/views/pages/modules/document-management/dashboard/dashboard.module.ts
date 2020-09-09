// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PartialsModule } from '../../../../../../../src/app/views/partials/partials.module';
import { CoreModule } from '../../../../../../../src/app/core/core.module';

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
        ]),
    ],
    providers: [],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
