import dotenv from "dotenv";
import path from "path";

import { ConnectionDB } from "../db/ConnectionDB";
import Categoria from "../Model/Categoria";
import { ICategoria } from "../Model/interfaces.model";
import { ResultSetHeader } from "mysql2";

const envPath = path.resolve(__dirname, "../../backend.env");
dotenv.config({ path: envPath });

const host = process.env.MYSQL_HOST;
const port = process.env.MYSQL_PORT;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;

async function getAllCategoria(): Promise<Array<Categoria>> {
    const results: Categoria[] = [];
    if (!host || !port || !user || !password || !database) return results;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return results;

    try {
        const [rows] = await pool?.query(`SELECT * FROM Categoria`);
        (rows as ICategoria[]).forEach((categoria): void => {
            const categoriaInstance = new Categoria(
                categoria.Codigo,
                categoria.Nome
            );
            results.push(categoriaInstance);
        });
        return results;
    } catch (err) {
        console.error(err);
        return results;
    } finally {
        conn.ClosePool();
    }
}

async function getCategoriaById(id: number): Promise<Categoria | null> {
    if (!host || !port || !user || !password || !database) return null;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return null;
    try {
        const [row] = await pool.query(
            `SELECT * FROM Categoria WHERE codigo = ${id}`
        );
        if ((row as ICategoria[]).length === 0) return null;
        const data = (row as ICategoria[])[0];
        return new Categoria(data.Codigo, data.Nome);
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        conn.ClosePool();
    }
}

async function isCategoriaExists(categoria: Categoria): Promise<boolean> {
    try {
        const categoariaDB = await getCategoriaById(categoria.Codigo);
        return categoariaDB !== null;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function addCategoria(categoria: Categoria): Promise<boolean> {
    const doesExist = await isCategoriaExists(categoria);
    if (doesExist) return false;

    if (!host || !port || !user || !password || !database) return false;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return false;

    try {
        const [result] = await pool.query(
            `INSERT INTO Categoria (Nome) VALUES (?)`,
            categoria.Nome
        );
        return (result as ResultSetHeader).insertId !== undefined;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        conn.ClosePool();
    }
}

async function updateCategoria(categoria: Categoria): Promise<boolean> {
    const doesExist = await isCategoriaExists(categoria);
    if (!doesExist) return false;

    if (!host || !port || !user || !password || !database) return false;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return false;
    const codigo = categoria.Codigo;
    const nome = categoria.Nome;
    try {
        const [result] = await pool.query(
            `UPDATE Categoria SET nome = ? WHERE codigo = ?`,
            [nome, codigo]
        );
        return (result as ResultSetHeader).insertId !== undefined;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        conn.ClosePool();
    }
}

export const ca = { getAllCategoria, addCategoria, updateCategoria };
