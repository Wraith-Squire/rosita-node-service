import Query from "./query.abstract";
import { dbSettings } from './types/dbSettings.type';
import { QueryClauses } from "./types/queryClauses.type";
import axios from 'axios';
import querystring from "querystring";
import { btoa } from "buffer";
import postgres, { Sql, PostgresError } from 'postgres';

export default class Postgres implements Query {
    private db_settings: dbSettings;
    private postgres_url: string;
    private postgres_sql: Sql;


    constructor(db_settings: dbSettings) {
        this.db_settings = db_settings;
        this.postgres_url = `postgres://${this.db_settings.db_username}:${this.db_settings.db_password}@${this.db_settings.db_host}/${this.db_settings.db_database}?options=project%3D${this.db_settings.db_port}`;

        console.log(this.postgres_url);

        try {
            this.postgres_sql = postgres(this.postgres_url, {ssl: 'require'});
        } catch (error) {
            console.log({error: error});
        }
    }

    createTable(table: string, columns: string | string[]): void {
        const query =  `CREATE TABLE IF NOT EXISTS ${table} (${columns.toString()});`;
    }

    alterTable(table: string, alters: string | string[]): void {
        const query = `ALTER TABLE ${table} ${alters.toString()};`;
    }

    dropTable(table: string): void {
        const query =  `DROP TABLE ${table};`;
    }

    raw(query: string): void {

    }

    fetch(clauses: QueryClauses): Promise<any> {
        var query = this.clausesToQuerySelect(clauses);

        return this.runQueryPromiseQuery(query);
    }

    async count(clauses: QueryClauses): Promise<number> {
        clauses.selectClause = ["*"];
        clauses.limit = undefined;
        clauses.offset = undefined;

        var query = this.clausesToQuerySelect(clauses);
        console.log(query.toString());
  
        return new Promise(async (resolve, reject) => {
            await this.postgres_sql.unsafe(query).then((response) => {
                const returnValue = response.count;

                resolve(returnValue);
            }).catch((error) => {
                reject(error);
            });
        });;
    }

    async insert(data: Record<string, any>, clauses: QueryClauses): Promise<any> {
        var columns = Object.keys(data);
        var values = Object.values(data).map((value) => this.mapColumnValue(value));

        var query = `INSERT INTO ${clauses.table} (${columns.toString()}) VALUES(${values.toString()});`
        console.log(query);
        var result = await this.postgres_sql.unsafe(query).then((response) => {
            return response;
        }).catch((error) => {
            console.log(error);
        });
        return result;
    }

    async update(data: Record<string, any>, clauses: QueryClauses): Promise<any> {
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

        console.log(query);
        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        var result = await this.postgres_sql.unsafe(query).then((response) => {
            return response;
        }).catch((error) => {
            console.log(error);
        });
        return result;
    }

    async delete(clauses: QueryClauses): Promise<any> {
        var query = `DELETE FROM ${clauses.table} `;

        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        var result = await this.postgres_sql.unsafe(query).then((response) => {
            return response;
        }).catch((error) => {
            console.log(error);
        });
        return result;
    }

    private mapColumnValue(value): string {
        if (value instanceof Date) {
            return `'${value.toISOString()}'`;
        }

        if (typeof value == "string") {
            return `'${value.toString()}'`;
        }

        if (typeof value == "object") {
            return `'${JSON.stringify(value)}'::jsonb`;
        }

        return value.toString();
    }

    private clausesToQuerySelect(clauses: QueryClauses): string {
        var query = '';
        if (clauses.selectClause.length > 0) query += `SELECT DISTINCT ${clauses.selectClause.toString()} FROM ${clauses.table} `;
        else query += `SELECT DISTINCT * FROM ${clauses.table} `;

        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        if (clauses.groupByClause.length > 0) query += `GROUP BY ${clauses.groupByClause.toString()} `;

        if (clauses.orderByClause.length > 0) query += `ORDER BY ${clauses.orderByClause.toString()} `;

        if (clauses.limit) query += `LIMIT ${clauses.limit} `

        if (clauses.offset) query += `OFFSET ${clauses.offset} `

        return `${query.slice(0, -1)};`;
    }

    private combineWhereClauses(whereClause: Array<string>): string {
        var returnValue = 'WHERE ';

        whereClause.forEach((value, index) => {
            if (index != 0) {
                returnValue += `AND ${value.toString()} `;
            } else {
                returnValue += `${value.toString()} `;
            }
        });

        return returnValue;
    }

    async runQueryPromiseQuery(query: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            console.log(query);
            await this.postgres_sql.unsafe(query)
            .then((response) => {
                // console.log(response);

                resolve(response);
            }).catch((error) => {
                // console.log(error);
                reject(error);
            });
        });
    }
}