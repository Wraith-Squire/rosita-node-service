import QueryHelper from "./query/query.helper";
import { QueryClauses } from "./query/types/queryClauses.type";

type SortOrder = `${'asc'|'desc'}`;

export default class Model {
    protected table: string;
    protected primaryKey: string;
    protected fillables: Array<string>;
    protected useTimestamp: boolean = false;

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
        var fillableColumnsData = this.fillableColumnsData(data);
        var clauses = this.getClausesObject();

        if (this.useTimestamp) {
            fillableColumnsData.created_at = new Date();
        }

        await this.queryHelper.query.insert(fillableColumnsData, clauses);
    }

    async update(data: Record<string, any>) {
        var fillableColumnsData = this.fillableColumnsData(data);
        var clauses = this.getClausesObject();

        if (this.useTimestamp) {
            fillableColumnsData.updated_at = new Date();
        }

        await this.queryHelper.query.update(fillableColumnsData, clauses);
    }

    async delete() {
        var clauses = this.getClausesObject();

        await this.queryHelper.query.delete(clauses);
    }

    private keysToSnake(data: Record<string, any>) {
        var returnValue = {};

        Object.entries(data).forEach((value) => {
            returnValue[this.camelToSnake(value[0])] = value[1];
        });

        return returnValue;
    }

    private camelToSnake(string = '') {
        return (string || '')
          .replace(/([A-Z])/g, (match, group) => `_${group.toLowerCase()}`)
          .replace(/^_/, '');
    }

    private fillableColumnsData(data: Record<string, any>) {
        var returnValue: Record<string, any> = {};
        var snakeKeyedData = this.keysToSnake(data);

        this.fillables.forEach((fillable) => {
            if (snakeKeyedData[fillable]) returnValue[fillable] = snakeKeyedData[fillable];
        });

        return returnValue;
    }
}