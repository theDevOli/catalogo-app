import express from "express";
import cors from "cors";

import CategoriaService from "./CategoriaService";
import ProdutoService from "./ProdutoService";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: "GET,POST,PUT",
        credentials: false,
    })
);

app.use("/api", CategoriaService);
app.use("/api", ProdutoService);
app.listen(8080, () => console.log("Server listening on port 8080"));
