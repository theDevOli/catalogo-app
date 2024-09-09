import express from "express";
import cors from "cors";

import { Produto } from "../Model/Produto";
import { pa } from "../DAO/ProdutoAccessor";
import { error } from "../utils/errorMsg";

const router = express.Router();

router.use(
    cors({
        origin: "*",
        methods: "GET,POST,PUT",
        credentials: false,
    })
);

router.use(express.json());

router.get("/ProdutoServices/produtos", async (req, res) => {
    try {
        const data = await pa.getAllProdutos();
        res.status(200).json({ err: null, data });
    } catch (err) {
        res.status(500).json({ err: error.SERVER_ERROR, data: null });
    }
});

router.post("/ProdutoServices/produto/:codigo", async (req, res) => {
    try {
        const { body } = req;
        const produto = new Produto(
            body?.codigo,
            body?.nome,
            body?.preco,
            body?.categoria
        );
        try {
            const ok = await pa.addProduto(produto);
            if (!ok) {
                res.status(409).json({
                    err: error.CONFLICT_ADD_ERROR,
                    data: null,
                });
                return;
            }
            res.status(201).json({ err: null, data: true });
        } catch (err) {
            res.status(500).json({ err: error.SERVER_ERROR, data: null });
        }
    } catch (err) {
        res.status(400).json({ err: error.BAD_REQUEST_ERROR, data: null });
    }
});

router.put("/ProdutoServices/produto/:codigo", async (req, res) => {
    try {
        const { body } = req;
        const produto = new Produto(
            body?.codigo,
            body?.nome,
            body?.preco,
            body?.categoria
        );
        try {
            const ok = await pa.updateProduto(produto);
            if (!ok) {
                res.status(404).json({
                    err: error.NOT_FOUND_ERROR,
                    data: null,
                });
                return;
            }
            res.status(200).json({ err: null, data: true });
        } catch (err) {
            res.status(500).json({ err: error.SERVER_ERROR, data: null });
        }
    } catch (err) {
        res.status(400).json({ err: error.BAD_REQUEST_ERROR, data: null });
    }
});
export default router;
