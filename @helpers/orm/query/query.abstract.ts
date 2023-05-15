import { QueryClauses } from "./types/queryClauses.type";

export default abstract class Query {
    abstract createTable(table: string, columns: Array<string>|string): void;
    abstract alterTable(table: string, alters: Array<string>|string): void;
    abstract dropTable(table: string): void;
    abstract raw(query: string): void;
    abstract fetch(clauses: QueryClauses): Promise<any>;
    abstract insert(data: Record<string, any>, clauses: QueryClauses): Promise<any>;
}