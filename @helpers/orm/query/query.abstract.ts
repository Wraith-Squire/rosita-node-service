export default abstract class Query {
    abstract createTable(table: string, columns: Array<string>|string): void;
    abstract alterTable(table: string, alters: Array<string>|string): void;
    abstract dropTable(table: string): void;
    abstract raw(query: string): void;
    abstract fetch(query: string): Promise<any>;
}