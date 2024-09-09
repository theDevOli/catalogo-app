import dotenv from "dotenv";
import path from "path";
import { ResultSetHeader } from "mysql2";

import { ConnectionDB } from "../db/ConnectionDB";

import { Produto } from "../Model/Produto";
import { IProduto } from "../Model/interfaces.model";

const envPath = path.resolve(__dirname, "../../../env/backend.env");
dotenv.config({ path: envPath });

const host = process.env.MYSQL_HOST;
const port = process.env.MYSQL_PORT;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;

async function getAllProdutos(): Promise<Array<Produto>> {
    const results: Produto[] = [];
    if (!host || !port || !user || !password || !database) return results;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return results;

    try {
        const [rows] = await pool?.query(
            `SELECT Produto.Codigo, Produto.Nome, Produto.Preco, Categoria.Nome as Categoria
                 FROM Produto INNER JOIN Categoria 
                 On Categoria.Codigo = Produto.CategoriaID;`
        );
        (rows as IProduto[]).forEach((produto): void => {
            const produtoInstance = new Produto(
                produto.Codigo,
                produto.Nome,
                produto.Preco,
                produto.Categoria
            );
            results.push(produtoInstance);
        });
        return results;
    } catch (err) {
        console.error(err);
        return results;
    } finally {
        conn.ClosePool();
    }
}

async function getProdutoById(id: number): Promise<Produto | null> {
    if (!host || !port || !user || !password || !database) return null;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return null;
    try {
        const [row] = await pool.query(
            `SELECT * FROM Produto WHERE codigo = ${id} `
        );
        if ((row as IProduto[]).length === 0) return null;
        const data = (row as IProduto[])[0];
        console.log("File: ProdutoAccessor.ts", "Line: 63", data);
        return new Produto(data.Codigo, data.Nome, data.Preco, data.Categoria);
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        conn.ClosePool();
    }
}

async function isProdutoExists(produto: Produto): Promise<boolean> {
    try {
        const produtoDB = await getProdutoById(produto.Codigo);
        console.log("File: ProdutoAccessor.ts", "Line: 76", produtoDB);
        return produtoDB !== null;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function addProduto(produto: Produto): Promise<boolean> {
    const doesExist = await isProdutoExists(produto);
    if (doesExist) return false;
    console.log("File: ProdutoAccessor.ts", "Line: 85", doesExist);
    if (!host || !port || !user || !password || !database) return false;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return false;
    try {
        const [result] = await pool.query(
            `INSERT INTO Produto (Nome, Preco, CategoriaID) VALUES(?, ?, ?)`,
            [produto.Nome, produto.Preco, produto.Categoria, produto.Codigo]
        );
        return (result as ResultSetHeader).insertId !== undefined;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        conn.ClosePool();
    }
}

async function updateProduto(produto: Produto): Promise<boolean> {
    const doesExist = await isProdutoExists(produto);
    if (!doesExist) return false;

    if (!host || !port || !user || !password || !database) return false;
    const conn = new ConnectionDB(host, Number(port), user, password, database);
    conn.CreatePool();
    const pool = conn.Pool;
    if (!pool) return false;
    const codigo = produto.Codigo;
    const nome = produto.Nome;
    const preco = produto.Preco;
    const categoria = produto.Categoria;
    try {
        const [result] = await pool.query(
            `UPDATE Produto SET nome = ?, preco =?, categoriaID=? WHERE codigo = ?`,
            [nome, preco, categoria, codigo]
        );
        return (result as ResultSetHeader).insertId !== undefined;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        conn.ClosePool();
    }
}

export const pa = { getAllProdutos, addProduto, updateProduto };
