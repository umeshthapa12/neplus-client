import { CommonModule } from '@angular/common';
// Angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
// NgBootstrap
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Loading bar
import { LoadingBarModule } from '@ngx-loading-bar/core';
// Translation
import { TranslateModule } from '@ngx-translate/core';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Ngx DatePicker
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SortablejsModule } from 'ngx-sortablejs';
// Core Module
import { CoreModule } from '../../core/core.module';
import { PagesModule } from '../pages/pages.module';
import { PartialsModule } from '../partials/partials.module';
import { AsideLeftComponent } from './aside/aside-left.component';
import { BaseComponent } from './base/base.component';
import { BrandComponent } from './brand/brand.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { HeaderComponent } from './header/header.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { TopbarComponent } from './header/topbar/topbar.component';
import { HtmlClassService } from './html-class.service';
import { SubheaderComponent } from './subheader/subheader.component';

@NgModule({
    declarations: [
        BaseComponent,
        FooterComponent,

        // headers
        HeaderComponent,
        BrandComponent,
        HeaderMobileComponent,

        // subheader
        SubheaderComponent,

        // topbar components
        TopbarComponent,

        // aside left menu components
        AsideLeftComponent,

        // horizontal menu components
        MenuHorizontalComponent,

        ErrorPageComponent,
    ],
    exports: [
        BaseComponent,
        FooterComponent,

        // headers
        HeaderComponent,
        BrandComponent,
        HeaderMobileComponent,

        // subheader
        SubheaderComponent,

        // topbar components
        TopbarComponent,

        // aside left menu components
        AsideLeftComponent,

        // horizontal menu components
        MenuHorizontalComponent,

        ErrorPageComponent,
    ],
    providers: [
        HtmlClassService,
    ],
    imports: [
        CommonModule,
        RouterModule,
        PagesModule,
        PartialsModule,
        CoreModule,
        PerfectScrollbarModule,
        FormsModule,
        MatProgressBarModule,
        MatTabsModule,
        MatButtonModule,
        MatTooltipModule,
        TranslateModule.forChild(),
        LoadingBarModule,
        NgxDaterangepickerMd,
        InlineSVGModule,

        // ng-bootstrap modules
        NgbProgressbarModule,
        NgbTooltipModule,
        SortablejsModule
    ]
})
export class ThemeModule {
}
