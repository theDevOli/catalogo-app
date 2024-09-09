import { ICategoria } from "./interfaces.model";

export default class Categoria implements ICategoria {
    constructor(private codigo: number, private nome: string) {
        this.codigo = codigo;
        this.nome = nome;
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
}
