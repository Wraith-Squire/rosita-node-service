import sqlite3 from 'sqlite3'
import Query from "./query.abstract";
import { dbSettings } from './types/dbSettings.type';
import { QueryClauses } from "./types/queryClauses.type";
import { error } from 'console';

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
    }

    alterTable(table: string, alters: string | string[]): void {
        this.db.serialize(() => {
            this.db.run(`ALTER TABLE ${table} ${alters.toString()};`)
        });
    }

    dropTable(table: string): void {
        this.db.serialize(() => {
            this.db.run( `DROP TABLE ${table};` )
        });
    }

    raw(query: string): void {
        this.db.serialize(() => {
            this.db.run(query);
        });
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
        var columns = Object.keys(data).map((key) => this.camelToSnake(key));
        var values = Object.values(data).map((value) => typeof value == "string" ? `'${value}'` : value );

        console.log({columns: columns, values: values});

        return new Promise((resolve, reject) => {
            var query = `INSERT INTO ${clauses.table} (${columns.toString()}) VALUES(${values.toString()});`

            this.db.serialize(() => {
                console.log(query);
                this.db.run(query,[], (result: any, error: any) => {
                    if (error) reject(error);
    
                    resolve(result);
                });
            });

            this.db.close();
        });
    }

    update(data: Record<string, any>, clauses: QueryClauses): Promise<any> {
        var dataEntries = Object.entries(data).map((value, index) => {
            var setQuery = '';

            if (index != 0) {
                setQuery = ` ${value[0].toString()} = ${typeof value[1] == "string" ? `"${value[1].toString()}"` : value[1].toString()}`;
            } else {
                setQuery = `${value[0].toString()} =  ${typeof value[1] == "string" ? `"${value[1].toString()}"` : value[1].toString()}`;
            }

            return setQuery;
        });

        return new Promise((resolve, reject) => {
            var query = `UPDATE ${clauses.table} SET ${dataEntries.toString()} WHERE ${clauses.whereClause};`

            this.db.serialize(() => {
                console.log(query);
                this.db.run(query,[], (result: any, error: any) => {
                    if (error) reject(error);
    
                    resolve(result);
                });
            });

            this.db.close();
        });
    }

    private clausesToQuerySelect(clauses: QueryClauses) {
        var query = '';
        if (clauses.selectClause.length > 0) query += `SELECT ${clauses.selectClause.toString()} FROM ${clauses.table} `;
        else query += `SELECT * FROM ${clauses.table} `;

        if (clauses.whereClause.length > 0) {
            query += 'WHERE ';

            clauses.whereClause.forEach((value, index) => {
                if (index != 0) {
                    query += `AND ${value.toString()}`;
                } else {
                    query += `${value.toString()} `;
                }
            });
        };

        if (clauses.orderByClause.length > 0) query += `ORDER BY ${clauses.orderByClause.toString()} `;

        if (clauses.groupByClause.length > 0) query += `GROUP BY ${clauses.groupByClause.toString()} `;

        if (clauses.limit) query += `LIMIT ${clauses.limit} `

        console.log(query);
        return `${query};`;
    }

    private camelToSnake(string = '') {
        return (string || '')
          .replace(/([A-Z])/g, (match, group) => `_${group.toLowerCase()}`)
          .replace(/^_/, '');
    }
}