import { Action, State, StateContext, Store } from '@ngxs/store';
import { delay, switchMap, tap } from 'rxjs/operators';
import { MailTemplate, ResponseModel } from '../../../../../../models';
import { MailTemplateService } from '../mail-template.service';
import { Injectable } from '@angular/core';

/*----------------------------------------
    cached data state section
-----------------------------------------*/
let CACHED: MailTemplate[] = [];

/**
 * Start to load lazy mail template either form local variable or from API if not found.
 */
export class LoadLazyMailTemplate {
    static readonly type = '[mail-templates] loads lazy mail template\'s data from API';
    constructor(public id: number, public guid: string) { }
}

/**
 * Once the response is succeed, Initialize lazy mail template data.
 */
export class InitLazyMailTemplate {
    static readonly type = '[mail-templates] init lazy mail template\'s  data';
    constructor(public lazy: MailTemplate) { }
}
/**
 * Cached user gets updated if chage happens
 */
export class UpdateIfCachedAction {
    static readonly type = '[usmail-templatesers] update lazy template data if cached';
    constructor(public updated: MailTemplate) { }
}

/**
 * Release from memory.
 */
export class ClearCachedMailTemplateOnDestroyAction {
    static readonly type = '[mail-templates] clears lazy mail template cached data from the history';
}

/**
 * mail template state
 */
@State({
    name: 'mail_templates',
    defaults: {},
})
@Injectable()
export class MailTemplateState {

    constructor(
        private cService: MailTemplateService,
        private store: Store) { }

    @Action(LoadLazyMailTemplate)
    loadLazyMailTemplate(ctx: StateContext<ResponseModel>, action: LoadLazyMailTemplate) {

        if (!CACHED) { CACHED = []; }

        const el = CACHED.find(_ => _.userGuid === action.guid && _.id === action.id);
        // clear history. we don't need it.
        ctx.setState(null);

        if (el) {
            ctx.setState({ contentBody: el, ...action });
            // if found in cache, return it
            return this.store.dispatch(new InitLazyMailTemplate(el));
        }

        // not found in cache, load from API
        return this.cService.getTemplate(action.id, action.guid).pipe(
            delay(800),
            tap(res => {
                ctx.setState({ contentBody: res.contentBody, ...action });
                CACHED.push(res.contentBody);
            }),
            switchMap(res => this.store.dispatch(new InitLazyMailTemplate(res.contentBody)))
        );

    }

    @Action(InitLazyMailTemplate)
    initLazyMailTemplate(ctx: StateContext<MailTemplate>, action: InitLazyMailTemplate) {
        const state = ctx.getState();
        ctx.setState({ ...state, ...action });
    }

    @Action(UpdateIfCachedAction)
    updateCached(ctx: StateContext<ResponseModel>, action: UpdateIfCachedAction) {

        const index = (CACHED || []).findIndex(_ =>
            _.id === action.updated.id &&
            _.userGuid === action.updated.userGuid
        );
        // clear history. we don't need it.
        ctx.setState(null);

        if (index > -1) {
            CACHED[index] = { ...action.updated };
        }

    }

    @Action(ClearCachedMailTemplateOnDestroyAction)
    clearCahced(ctx: StateContext<any>) {
        CACHED = null;
        ctx.setState(null);
    }

}
