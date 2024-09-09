import express from "express";
import cors from "cors";

import Categoria from "../Model/Categoria";
import { ca } from "../DAO/CategoriaAccessor";
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

router.get("/CategoriaServices/categorias", async (req, res) => {
    try {
        const data = await ca.getAllCategoria();
        res.status(200).json({ err: null, data });
    } catch (err) {
        res.status(500).json({ err: error.SERVER_ERROR, data: null });
    }
});

router.post("/CategoriaServices/categoria/:codigo", async (req, res) => {
    try {
        const { body } = req;
        const categoria = new Categoria(body?.codigo, body?.nome);
        try {
            const ok = await ca.addCategoria(categoria);
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

router.put("/CategoriaServices/categoria/:codigo", async (req, res) => {
    try {
        const { body } = req;
        const categoria = new Categoria(body?.codigo, body?.nome);
        try {
            const ok = await ca.updateCategoria(categoria);
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
