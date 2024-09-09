import mysql from "mysql2/promise";

export class ConnectionDB {
    private _host: string;
    private _port: number;
    private _user: string;
    private _password: string;
    private _database: string;
    private _pool: mysql.Pool | null = null;

    constructor(
        host: string,
        port: number,
        user: string,
        password: string,
        database: string
    ) {
        this._host = host;
        this._port = port;
        this._user = user;
        this._password = password;
        this._database = database;
    }

    public get Pool(): mysql.Pool | null {
        return this._pool;
    }

    public CreatePool(): void {
        try {
            this._pool = mysql.createPool({
                host: this._host,
                port: this._port,
                user: this._user,
                password: this._password,
                database: this._database,
            });
        } catch (err) {
            console.error(err);
        }
    }

    public ClosePool(): void {
        try {
            if (!this._pool) return;
            this._pool.end();
        } catch (err) {
            console.error(err);
        }
    }
}
