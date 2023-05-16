import sqlite3 from 'sqlite3'
import Query from "./query.abstract";
import { dbSettings } from './types/dbSettings.type';
import { QueryClauses } from "./types/queryClauses.type";
import { error } from 'console';
import { isDate } from 'util/types';

export default class SqliteQuery implements Query {
    private db_settings: dbSettings;
    db: sqlite3.Database;

    constructor(db_settings: dbSettings) {
        this.db_settings = db_settings;
        this.db = this.connect();
    }

    private connect() {
        return new sqlite3.Database(this.db_settings.db_host);
    }

    createTable(table: string, columns: string | string[]): void {
        this.db.serialize(() => {
            this.db.run( `CREATE TABLE IF NOT EXISTS ${table} (${columns.toString()});` )
        });

        this.db.close();
    }

    alterTable(table: string, alters: string | string[]): void {
        this.db.serialize(() => {
            this.db.run(`ALTER TABLE ${table} ${alters.toString()};`)
        });

        this.db.close();
    }

    dropTable(table: string): void {
        this.db.serialize(() => {
            this.db.run( `DROP TABLE ${table};` )
        });

        this.db.close();
    }

    raw(query: string): void {
        this.db.serialize(() => {
            this.db.run(query);
        });

        this.db.close();
    }

    fetch(clauses: QueryClauses): Promise<any> {
        var query = this.clausesToQuerySelect(clauses);

        return new Promise((resolve, reject) => {
            this.db.all(query, (error, rows) => {
                if (error) reject(error);

                resolve(rows);                
            });

            this.db.close();
        })
    }

    insert(data: Record<string, any>, clauses: QueryClauses): Promise<any> {
        var columns = Object.keys(data);
        var values = Object.values(data).map((value) => this.mapColumnValue(value));

        var query = `INSERT INTO ${clauses.table} (${columns.toString()}) VALUES(${values.toString()});`

        return this.runQueryPromise(query);
    }

    update(data: Record<string, any>, clauses: QueryClauses): Promise<any> {
        var dataEntries = Object.entries(data).map((value, index) => {
            var setQuery = '';
            var column = value[0];
            var columnValue = value[1];

            if (index != 0) {
                setQuery = ` ${column} = ${this.mapColumnValue(columnValue)}`;
            } else {
                setQuery = `${column} =  ${this.mapColumnValue(columnValue)}`;
            }

            return setQuery;
        });

        var query = `UPDATE ${clauses.table} SET ${dataEntries.toString()} `;

        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        return this.runQueryPromise(query);
    }

    delete(clauses: QueryClauses): Promise<any> {
        var query = `DELETE FROM ${clauses.table} `;

        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        return this.runQueryPromise(query);
    }

    private mapColumnValue(value): string {
        if (value instanceof Date) {
            return `"${value.toISOString()}"`;
        }

        if (typeof value == "string") {
            return `"${value.toString()}"`;
        }

        if (typeof value == "object") {
            return `JSON_SET('${JSON.stringify(value)}')`;
        }

        return value.toString();
    }

    private clausesToQuerySelect(clauses: QueryClauses): string {
        var query = '';
        if (clauses.selectClause.length > 0) query += `SELECT ${clauses.selectClause.toString()} FROM ${clauses.table} `;
        else query += `SELECT * FROM ${clauses.table} `;

        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        if (clauses.orderByClause.length > 0) query += `ORDER BY ${clauses.orderByClause.toString()} `;

        if (clauses.groupByClause.length > 0) query += `GROUP BY ${clauses.groupByClause.toString()} `;

        if (clauses.limit) query += `LIMIT ${clauses.limit} `

        return `${query};`;
    }

    private combineWhereClauses(whereClause: Array<string>): string {
        var returnValue = 'WHERE ';

        whereClause.forEach((value, index) => {
            if (index != 0) {
                returnValue += `AND ${value.toString()}`;
            } else {
                returnValue += `${value.toString()} `;
            }
        });

        return returnValue;
    }

    private runQueryPromise(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(query,[], (result: any, error: any) => {
                    if (error) reject(error);
    
                    resolve(result);
                });
            });

            this.db.close();
        });
    }
}