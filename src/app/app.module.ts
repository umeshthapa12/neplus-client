// Angular
import { OverlayModule } from "@angular/cdk/overlay";
import {
    HttpClientModule,
    HttpClientXsrfModule,
    HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { APP_INITIALIZER, NgModule, ErrorHandler } from "@angular/core";
import { GestureConfig } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
    BrowserModule,
    HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsModule, NGXS_PLUGINS } from "@ngxs/store";
// Hammer JS
import "hammerjs";
import * as json from "highlight.js/lib/languages/json";
import * as scss from "highlight.js/lib/languages/scss";
import * as typescript from "highlight.js/lib/languages/typescript";
import * as xml from "highlight.js/lib/languages/xml";
// SVG inline
import { InlineSVGModule } from "ng-inline-svg";
// Highlight JS
import { HighlightLanguage, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
// Perfect Scroll bar
import {
    PerfectScrollbarConfigInterface,
    PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { SortablejsModule } from "ngx-sortablejs";
// Env
import { environment } from "../environments/environment";
// Modules
import { AppRoutingModule } from "./app-routing.module";
// Copmponents
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
// Layout Services
import {
    DataTableService,
    KtDialogService,
    LayoutConfigService,
    LayoutRefService,
    MenuAsideService,
    MenuConfigService,
    MenuHorizontalService,
    PageConfigService,
    SplashScreenService,
    SubheaderService,
} from "./core/_base/layout";
// Config
import { LayoutConfig } from "./core/_config/layout.config";

// Partials
import { PartialsModule } from "./views/partials/partials.module";
import { ThemeModule } from "./views/theme/theme.module";
import { GlobalErrorHandler } from "./core/errors";
import {
    AppState,
    FilterConditionState,
    DropdownDataState,
    AsideNavState,
} from "./store/effects";
import { RefreshTokenInterceptor } from "./utils";
import { logoutPlugin } from "./store/meta-reducers/logout.plugin";

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelSpeed: 0.5,
    swipeEasing: true,
    minScrollbarLength: 40,
    maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
    // initialize app by loading default demo layout config
    return () => {
        if (appConfig.getConfig() === null) {
            appConfig.loadConfigs(new LayoutConfig().configs);
        }
    };
}

export function hljsLanguages(): HighlightLanguage[] {
    return [
        { name: "typescript", func: typescript },
        { name: "scss", func: scss },
        { name: "xml", func: xml },
        { name: "json", func: json },
    ];
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientXsrfModule,
        HttpClientModule,
        HttpClientXsrfModule,
        PartialsModule,
        CoreModule,
        OverlayModule,
        // AuthModule.forRoot(),
        TranslateModule.forRoot(),
        MatProgressSpinnerModule,
        InlineSVGModule.forRoot(),
        ThemeModule,
        NgxsModule.forRoot(
            [AppState, FilterConditionState, DropdownDataState, AsideNavState],
            {
                developmentMode: !environment.production,
            }
        ),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: "admin-main",
            disabled: environment.production,
        }),
        SortablejsModule.forRoot({ animation: 150 }),
        // NgxsRouterPluginModule.forRoot()
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },

        LayoutConfigService,
        LayoutRefService,
        MenuConfigService,
        PageConfigService,
        KtDialogService,
        DataTableService,
        SplashScreenService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: GestureConfig,
        },
        {
            // layout config initializer
            provide: APP_INITIALIZER,
            useFactory: initializeLayoutConfig,
            deps: [LayoutConfigService],
            multi: true,
        },
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: { languages: hljsLanguages },
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RefreshTokenInterceptor,
            multi: true,
        },
        {
            provide: NGXS_PLUGINS,
            useValue: logoutPlugin,
            multi: true,
        },
        // template services
        SubheaderService,
        MenuHorizontalService,
        MenuAsideService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
