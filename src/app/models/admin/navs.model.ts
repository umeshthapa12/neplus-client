export interface AsideNavModel {
    sn?: number;
    id?: number;
    parentId?: number;
    type?: string;
    module?: string;
    area?: string;
    text?: string;
    icon?: string;
    pathSegment?: string;
    status?: string;
    bullet?: string;
    submenu?: AsideNavModel[];
}
