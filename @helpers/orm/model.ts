import QueryHelper from "./query/query.helper";
import { QueryClauses } from "./query/types/queryClauses.type";

type SortOrder = `${'asc'|'desc'}`;

export default class Model {
    protected table: string;
    protected primaryKey: string;
    protected fillables: Array<string> = [];

    private queryHelper: QueryHelper;

    private selectClause: Array<string> = [];
    private whereClause: Array<string> = [];
    private orderByClause: Array<string> = [];
    private groupByClause: Array<string> = [];
    private having: Array<string>;
    private offset: number;
    private limit: number;

    private getClausesObject(): QueryClauses {
        var clauses = {
            table: this.table,
            limit: this.limit,
            offset: this.offset,
            selectClause: this.selectClause,
            whereClause: this.whereClause,
            orderByClause: this.orderByClause,
            groupByClause: this.groupByClause,
        }

        return clauses;
    }

    constructor() {
        this.queryHelper = new QueryHelper;
    }

    select(value: string|Array<string>) {
        this.selectClause.push(value.toString());

        return this;
    }

    where(left: string, operator: string, right: string|number|null) {
       this.whereClause.push(`${left} ${operator} ${right}`);

       return this;
    }

    find(id: number) {
        return this.where(this.primaryKey, '=', id);
    }

    orderBy(value: string, sortOrder: SortOrder) {
        this.orderByClause.push(`${value} ${sortOrder}`);

        return this;
    }

    groupBy(value: string) {
        this.groupByClause.push(`${value}`);

        return this;
    }

    async get(): Promise<any[]> {
        var clauses = this.getClausesObject();

        var result: Array<any> = [];

        await this.queryHelper.query.fetch(clauses).then((response) => {
            result = response;
        });

        return result;
    }

    async one(): Promise<any> {
        var clauses = this.getClausesObject();

        var result: Array<any> = [];

        await this.queryHelper.query.fetch(clauses).then((response) => {
            result = response;
        });

        return result[0];
    }
    
    async insert(data: Record<string, any>) {
        var clauses = this.getClausesObject();

        await this.queryHelper.query.insert(data, clauses);
    }

    async update(data: Record<string, any>) {
        var clauses = this.getClausesObject();

        await this.queryHelper.query.update(data, clauses);
    }
}