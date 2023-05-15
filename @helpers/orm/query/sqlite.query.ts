import sqlite3 from 'sqlite3'
import Query from "./query.abstract";
import { dbSettings } from './types/dbSettings.type';
import { QueryClauses } from "./types/queryClauses.type";

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
        var db = this.db;
        var query = this.clausesToQuery(clauses);

        return new Promise(function(resolve, reject) {
            db.all(query, (error, rows) => {
                if (error) reject(error);

                resolve(rows);                
            });

            db.close();
        })
    }

    private clausesToQuery(clauses: QueryClauses) {
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
}