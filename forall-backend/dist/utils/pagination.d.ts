export interface PaginationParams {
    page?: number;
    limit?: number;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare function getPagination(params: PaginationParams): {
    page: number;
    limit: number;
    skip: number;
};
export declare function buildPaginatedResult<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T>;
//# sourceMappingURL=pagination.d.ts.map