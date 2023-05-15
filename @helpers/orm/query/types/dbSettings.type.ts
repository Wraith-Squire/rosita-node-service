import { rdbms } from "./rdbms.type";

export type dbSettings = {
    db_connection: rdbms;
    db_host: string;
    db_port?: string;
    db_database?: string;
    db_username?: string;
    db_password?: string;
}