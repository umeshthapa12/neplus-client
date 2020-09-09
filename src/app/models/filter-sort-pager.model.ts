/**
 * Filters
 */
export interface Filter {
    /**
     * Name of the field
     */
    column: string;

    /**
     * Condition to compare
     */
    condition: string;

    /**
     * Primary comparar value
     */
    firstValue?: string;

    /**
     * Secondary comparar value
     */
    secondValue?: string;
}

/**
 * Paginator
 */
export interface Paginator {

    /**
     * Current page index
     */
    pageIndex: number;

    /**
     * Item per page
     */
    pageSize: number;
}

/**
 * Sort order
 */
export interface SortOrder {
    /**
     * Name of the field to get sorted
     */
    orderBy?: string;

    /**
     * Ordering direction ASC | DESC
     */
    orderDirection?: string;
}

/**
 * Request query
 */
export interface QueryModel {

    /**
     * Filter collection
     */
    filters?: Filter[];

    /**
     * Paging
     */
    paginator?: Paginator;

    /**
     * Sorting
     */
    sort?: SortOrder;
}

