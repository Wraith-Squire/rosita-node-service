import sqlite3 from 'sqlite3'
import Query from "./query.abstract";
import { dbSettings } from './types/dbSettings.type';



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

    fetch(query: string): Array<any> {
        var queryResult: Array<any> = [];

        this.db.all(query, (error, rows: Array<any>) => {
            if (error) {
                throw error;
            }

            queryResult = rows as Array<any>;
        });

        return queryResult;
    }
}