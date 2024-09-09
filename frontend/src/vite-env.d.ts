/// <reference types="vite/client" />

interface ICategoria {
    Codigo: number;
    Nome: string;
}

interface IProduto {
    Codigo: number;
    Nome: string;
    Preco: number;
    Categoria: string;
}

interface ICart extends IProduto {
    Quantidade: number;
}

type categoriaType = {
    codigo: number;
    nome: string;
};

type produtoType = {
    codigo: number;
    nome: string;
    preco: number;
    categoria: string;
};

type cartType = {
    codigo: number;
    nome: string;
    preco: number;
    categoria: string;
    quantidade: number;
};

type RESTful = {
    err: null | string;
    data: null | any[];
};
