// Angular
import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
// Object path
import * as objectPath from 'object-path';
// RxJS
import { BehaviorSubject, Observable } from 'rxjs';
import { AsideNavModel } from '../../../../models';
// Services
import { MenuConfigService } from './menu-config.service';
import { AsideStateSelector } from '../../../../store/selectors';
import { filter } from 'rxjs/operators';
@Injectable()
export class MenuAsideService {
    // Public properties
    menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    @Select(AsideStateSelector.SliceOf('filteredItems'))
    readonly nav$: Observable<AsideNavModel[]>;

    /**
     * Service constructor
     * @param menuConfigService: MenuConfigService
     */
    constructor(private menuConfigService: MenuConfigService) {
        this.loadMenu();
    }

    /**
     * Load menu list
     */
    loadMenu() {
        // get menu list
        const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items');
        this.nav$.pipe(filter(m => m && m.length > 0))
            .subscribe(m => this.menuList$.next([...m]), () => this.menuList$.next([menuItems]));
    }
}
