import Query from "./query.abstract";
import { dbSettings } from './types/dbSettings.type';
import { QueryClauses } from "./types/queryClauses.type";
import axios from 'axios';
import querystring from "querystring";
import { btoa } from "buffer";

export default class DBhub implements Query {
    private db_settings: dbSettings;


    constructor(db_settings: dbSettings) {
        this.db_settings = db_settings;
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

    count(clauses: QueryClauses): Promise<number> {
        clauses.selectClause = ["COUNT(1) as count"];
        clauses.limit = undefined;
        clauses.offset = undefined;

        var query = this.clausesToQuerySelect(clauses);
  
        return new Promise(async (resolve, reject) => {
            await axios.post(this.db_settings.db_host + '/v1/query', 
                this.getApiParameters(query), 
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            ).then((response) => {
                const returnValue = response.data[0][0]['Value'];

                resolve(returnValue);
            }).catch((error) => {
                reject(error);
            });
        });;
    }

    insert(data: Record<string, any>, clauses: QueryClauses): Promise<any> {
        var columns = Object.keys(data);
        var values = Object.values(data).map((value) => this.mapColumnValue(value));

        var query = `INSERT INTO ${clauses.table} (${columns.toString()}) VALUES(${values.toString()});`

        return this.runQueryPromiseExecute(query);
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

        return this.runQueryPromiseExecute(query);
    }

    delete(clauses: QueryClauses): Promise<any> {
        var query = `DELETE FROM ${clauses.table} `;

        if (clauses.whereClause.length > 0) {
            query += this.combineWhereClauses(clauses.whereClause);
        };

        return this.runQueryPromiseExecute(query);
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

        if (clauses.offset) query += `OFFSET ${clauses.offset} `

        return `${query};`;
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

    private runQueryPromiseQuery(query: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await axios.post(this.db_settings.db_host + '/v1/query', 
                this.getApiParameters(query), 
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            ).then((response) => {
                var returnValue = response.data?.map((row: Array<Record<string, any>>) => {
                    var objectResult = {} as Record<string, any>;
                    row.forEach((column) => {
                        objectResult[column['Name']] = column['Value']; 
                    });

                    return objectResult;
                });

                resolve(returnValue);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    private runQueryPromiseExecute(query: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await axios.post(this.db_settings.db_host + '/v1/execute', 
                this.getApiParameters(query), 
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            ).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    private getApiParameters(query: string) {
        return querystring.stringify({
            apikey: `${this.db_settings.db_password}`,
            dbowner: `${this.db_settings.db_username}`,
            dbname: `${this.db_settings.db_database}`,
            sql: btoa(query)
        });
    }
}