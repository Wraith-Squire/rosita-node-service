import QueryHelper from "./query/query.helper";

type SortOrder = `${'asc'|'desc'}`;

export default class Model {
    protected table: string;
    protected primaryKey: string;
    protected fillables: Array<string>;

    private queryHelper: QueryHelper;

    private selectClause: Array<string> = [];
    private whereClause: Array<string> = [];
    private orderByClause: Array<string> = [];
    private groupByClause: Array<string> = [];
    private having: Array<string>;
    private offset: bigint;
    private limit: bigint;

    constructor() {
        this.queryHelper = new QueryHelper;
    }

    select(value: string|Array<string>) {
        this.selectClause.push(value.toString());

        return this;
    }

    where(left: string, operator: string, right: string) {
       this.whereClause.push(`${left} ${operator} ${right}`);

       return this;
    }

    orderBy(value: string, sortOrder: SortOrder) {
        this.orderByClause.push(`${value} ${sortOrder}`);

        return this;
    }

    groupBy(value: string) {
        this.groupByClause.push(`${value}`);

        return this;
    }

    async fetch(): Promise<any[]> {
        var query = `SELECT ${this.selectClause.toString()} FROM ${this.table} `;
        if (this.whereClause.length > 0) query += `WHERE ${this.whereClause.toString()} `;
        if (this.orderByClause.length > 0) query += `ORDER BY ${this.orderByClause.toString()} `;
        if (this.groupByClause.length > 0) query += `GROUP BY ${this.groupByClause.toString()} `

        var result: Array<any> = [];

        await this.queryHelper.query.fetch(query).then((response) => {
            result = response;
        });

        return result;
    }
}