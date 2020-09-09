import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryModel } from '../../models';

/**
 * Query parameter generator
 */
@Injectable({ providedIn: 'root' })
export class ParamGenService {

    /**
     * whether the url tree has query params to filter
     */
    hasFilter: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {

        this.route.queryParams.subscribe(_ => {
            const q = this.route.snapshot.queryParams;
            const contains = Object.keys(q).some(key => key === 'orderBy' || key === 'orderDirection' || key === `fi[0].col`);
            this.hasFilter = contains;
        });

    }


    /**
     * Creates query parameters and adds to the url tree.
     * User might reload their page so we parse params to filter data
     * @param params An object of type ```QueryModel```
     */
    createParams(params: QueryModel): HttpParams {
        // this.router.events.subscribe(_=> console.log(_, 'inner'));
        let obj: any = { ...params.sort, ...params.paginator };

        // we might have to use param history to filter if user reloads the page
        const queryFromUrl = this.route.snapshot.queryParams;

        // we might have list of filter data.
        // transform list to query params
        if (params && params.filters) {
            params.filters.forEach((f, i) => {
                Object.keys(f).forEach((key) => {

                    if (!(f[key])) { return; }
                    // make query key shorter
                    const q = key === 'column' ? 'col'
                        : key === 'condition' ? 'exp'
                            : key === 'keyword' ? 'kw'
                                : key === 'firstValue' ? 'val1'
                                    : key === 'secondValue' ? 'val2'
                                        : key;

                    // add transformed property
                    obj[`fi[${i}].${q}`] = f[key];
                });
            });
        }

        // we do not serve sort order on initial load or there is no sort direction applied by user. url tree is ignored
        if (!(params.sort && params.sort.orderDirection)) {
            obj = { ...queryFromUrl, ...obj, orderBy: null, orderDirection: null };
            delete obj.orderBy;
            delete obj.orderDirection;
        }

        // create query params
        const p = new HttpParams({ fromObject: obj });

        // also set to url. User might have refreshed their page so the filters must remain same
        this.router.navigate([], { queryParams: obj, relativeTo: this.route });

        return p;
    }

    // clear query params from url
    clearParams() {
        if (this.hasFilter) {
            this.hasFilter = false;
            this.router.navigate([], { queryParams: null, relativeTo: this.route });
        }
    }
}
