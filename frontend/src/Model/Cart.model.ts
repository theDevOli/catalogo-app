import { Produto } from "./Produtomodel.";

export class Cart extends Produto implements ICart {
    constructor(
        codigo: number,
        nome: string,
        preco: number,
        categoria: string,
        private quantidade: number
    ) {
        super(codigo, nome, preco, categoria);
        this.quantidade = quantidade;
    }

    public static FromDB(data: produtoType): Cart {
        return new Cart(data.codigo, data.nome, data.preco, data.categoria, 0);
    }

    public get Codigo(): number {
        return super.Codigo;
    }

    public set Codigo(value: number) {
        super.Codigo = value;
    }

    public get Nome(): string {
        return super.Nome;
    }

    public set Nome(value: string) {
        super.Nome = value;
    }

    public get Preco(): number {
        return super.Preco;
    }

    public set Preco(value: number) {
        super.Preco = value;
    }

    public get Categoria(): string {
        return super.Categoria;
    }

    public set Categoria(value: string) {
        super.Categoria = value;
    }

    public get Quantidade(): number {
        return this.quantidade;
    }

    public set Quantidade(value: number) {
        this.quantidade = value;
    }
}
