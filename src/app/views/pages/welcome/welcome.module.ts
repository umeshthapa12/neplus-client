import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';
import { PortletModule } from '../../partials/content/general/portlet/portlet.module';
import { CoreModule } from '../../../../app/core/core.module';
import { ThemeModule } from '../../theme/theme.module';
import { PartialsModule } from '../../partials/partials.module';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [WelcomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: WelcomeComponent }
        ]),
        PartialsModule,
        CoreModule,
        NgbDropdownModule,
        NgbTabsetModule,
        NgbTooltipModule,
    ],
    exports: [],
    providers: [],
})
export class WelcomeModule { }
