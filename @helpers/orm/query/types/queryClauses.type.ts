export type QueryClauses = {
    table: string,
    limit: number,
    offset: number,
    selectClause: Array<string>,
    whereClause: Array<string>,
    orderByClause: Array<string>,
    groupByClause: Array<string>,
}