import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LayoutConfigService, ToggleOptions } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';

@Component({
    selector: 'kt-brand',
    templateUrl: './brand.component.html',
})
export class BrandComponent implements OnInit, AfterViewInit {

    headerLogo: string;
    headerStickyLogo: string;

    activateModuleName: string;

    toggleOptions: ToggleOptions = {
        target: 'body',
        targetState: 'kt-aside--minimize',
        togglerState: 'kt-aside__brand-aside-toggler--active'
    };

    constructor(
        private layoutConfigService: LayoutConfigService,
        public htmlClassService: HtmlClassService,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.headerLogo = this.layoutConfigService.getLogo();
        this.headerStickyLogo = this.layoutConfigService.getStickyLogo();
    }


    ngAfterViewInit(): void {
        this.route.data.pipe(
            filter(d => !!d)
        ).subscribe({
            next: d => {
                const m: { moduleDisplayName?: string } = d;
                if (!m?.moduleDisplayName) { return; }

                this.activateModuleName = m.moduleDisplayName;
            }
        });
    }
}
