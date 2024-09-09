import { IProduto } from "./interfaces.model";

export class Produto implements IProduto {
    private codigo: number;
    private nome: string;
    private preco: number;
    private categoria: string;
    constructor(
        codigo: number,
        nome: string,
        preco: number,
        categoria: string
    ) {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
    }

    public get Codigo(): number {
        return this.codigo;
    }

    public set Codigo(value: number) {
        this.codigo = value;
    }

    public get Nome(): string {
        return this.nome;
    }

    public set Nome(value: string) {
        this.nome = value;
    }

    public get Preco(): number {
        return this.preco;
    }

    public set Preco(value: number) {
        this.preco = value;
    }

    public get Categoria(): string {
        return this.categoria;
    }

    public set Categoria(value: string) {
        this.categoria = value;
    }
}
