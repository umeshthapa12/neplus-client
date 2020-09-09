import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { LayoutConfigService, SplashScreenService, TranslationService } from './core/_base/layout';
import { locale as chLang } from './core/_config/i18n/ch';
import { locale as deLang } from './core/_config/i18n/de';
import { locale as enLang } from './core/_config/i18n/en';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as frLang } from './core/_config/i18n/fr';
import { locale as jpLang } from './core/_config/i18n/jp';
import { InitGlobalData } from './store/actions';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'body[kt-root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: []
})
export class AppComponent implements OnInit, OnDestroy {

    loader: boolean;
    private unsubscribe = new Subject<void>();

    /**
     * Component constructor
     *
     * @param translationService: TranslationService
     * @param router: Router
     * @param layoutConfigService: LayoutCongifService
     * @param splashScreenService: SplashScreenService
     */
    constructor(
        private translationService: TranslationService,
        private router: Router,
        private layoutConfigService: LayoutConfigService,
        private splashScreenService: SplashScreenService,
        private store: Store) {

        // register translations
        this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);
        this.init();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // enable/disable loader
        this.loader = this.layoutConfigService.getConfig('loader.enabled');

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            debounceTime(100),
            takeUntil(this.unsubscribe)).subscribe(event => {

                // hide splash screen
                this.splashScreenService.hide();

                // scroll to top on every route change
                window.scrollTo(0, 0);

                // to display back the body content
                setTimeout(() => {
                    document.body.classList.add('kt-page--loaded');
                }, 500);
            });
    }

    /**
     * On Destroy
     */
    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    /**
     * Repeated dataset of multiple sections should load at once
     * so we can access them from entire app using ngxs state management.
     * @link https://github.com/ngxs/store
     */
    init = () => this.store.dispatch(new InitGlobalData());
}
