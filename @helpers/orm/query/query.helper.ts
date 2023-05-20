import DBhub from "./dbhub.query";
import Query from "./query.abstract";
import SqliteQuery from "./sqlite.query";
import { dbSettings } from "./types/dbSettings.type";
import { rdbms } from "./types/rdbms.type";

export default class QueryHelper {
    private db_settings: dbSettings;
    query: Query;

    constructor() {
        this.db_settings = {
            db_connection: process.env.DB_CONNECTION as rdbms,
            db_host: process.env.DB_HOST as string,
            db_port: process.env.DB_PORT as string,
            db_database: process.env.DB_DATABASE as string,
            db_username: process.env.DB_USERNAME as string,
            db_password: process.env.DB_PASSWORD as string
        }

        this.query = this.getQuery();
    }

    private getQuery(): Query {
        console.log(this.db_settings.db_host);

        if (this.db_settings.db_connection == "sqlite") {
            return new SqliteQuery(this.db_settings);
        } else if (this.db_settings.db_connection == "dbhub") {
            return new DBhub(this.db_settings);
        } else {
            throw "Error. Database connection not found."
        }
    }
}