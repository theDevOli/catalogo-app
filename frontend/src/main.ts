import { Cart } from "./Model/Cart.model";

function init(): void {
    changingLoadingStatus();
    document.querySelector(".menu-item")?.classList.add("active");
    setProductToList();
    cardWriter();
    changingLoadingStatus();
}

window.onload = function () {
    document
        .querySelector("button.icon")
        ?.addEventListener("click", menuToggler);
    init();
    document
        .querySelector("ul.menu")
        ?.addEventListener("click", navbarClickHandler.bind(event));
    document
        .querySelector(".container")
        ?.addEventListener("click", buttonClickInContainer.bind(event));
    document
        .querySelector(".container")
        ?.addEventListener("submit", submitFormInContainer.bind(event));
};

const getEditableCartId = (className: string): number =>
    Number(className.split(" ")[2].split("-")[1]);

const codeFormater = (code: number): string => String(code).padStart(3, "0");

async function getData(url: string): Promise<RESTful | undefined> {
    try {
        const response = await fetch(`http://localhost:8080/api/${url}`, {
            method: "GET",
        });
        const result: RESTful = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function postData(url: string, body: any): Promise<void> {
    try {
        await fetch(`http://localhost:8080/api/${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error(error);
    }
}

async function setProductToList(): Promise<void> {
    const res = await getData("ProdutoServices/produtos");
    if (!res) return;
    const carts: Cart[] =
        res?.data?.map((produto: produtoType) => Cart.FromDB(produto)) || [];
    const cartString = JSON.stringify(carts);

    localStorage.setItem("produto", cartString);
}

async function submitFormInContainer(e: Event): Promise<void> {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let body: any = { codigo: 0 };
    formData.forEach((value, key): void => {
        body = { ...body, [key]: value };
    });

    const bodyKeys = Object.keys(body);
    if (bodyKeys.length === 1) return;

    changingLoadingStatus();
    if (
        bodyKeys.includes("preco") &&
        bodyKeys.includes("categoria") &&
        bodyKeys.includes("nome")
    ) {
        const res = await getData("ProdutoServices/produtos");
        if (!res) return;
        if (!res.data) return;
        const produtos: produtoType[] = res.data;
        const id = produtos[produtos.length - 1].codigo + 1;
        const productBody = {
            ...body,
            codigo: id,
            preco: Number(body.preco),
            categoria: Number(body.categoria),
        };
        await postData(`ProdutoServices/produto/${id}`, productBody);
        setProductToList();
        clearInputs();
        changingLoadingStatus();
        return;
    }

    const res = await getData("CategoriaServices/categorias");
    if (!res) return;
    if (!res.data) return;
    const categoria: categoriaType[] = res.data;
    const id = categoria[categoria.length - 1].codigo + 1;

    const categoriaBody = { ...body, codigo: id };
    await postData(`CategoriaServices/categoria/${id}`, categoriaBody);
    clearInputs();
    changingLoadingStatus();
}

function changingLoadingStatus(): void {
    document.querySelector(".overlay")?.classList.toggle("hidden");
}

function clearInputs(): void {
    document.querySelectorAll("input").forEach((el: HTMLInputElement) => {
        el.value = "";
    });
}

function getProductFomLocalStorage(): cartType[] {
    const tempProdutos = localStorage.getItem("produto");
    if (!tempProdutos) return [];
    const produtos: cartType[] = JSON.parse(tempProdutos);
    return produtos;
}

function menuToggler(): void {
    document.querySelector(".fa-bars")?.classList.toggle("hidden");
    document.querySelector(".fa-xmark")?.classList.toggle("hidden");
    document.querySelector("ul.menu")?.classList.toggle("hidden");
}

function navbarClickHandler(e: Event): void {
    const liTarget = (
        (e.target as HTMLElement).parentElement as HTMLAnchorElement
    ).parentElement;

    if (!liTarget?.classList.contains("menu-item")) return;

    const innerText = (e.target as HTMLSpanElement).innerHTML;

    if (innerText.toLowerCase() === "Lista de Produtos".toLocaleLowerCase())
        cardWriter();

    if (innerText.toLowerCase() === "Cadastro de Produtos".toLowerCase())
        displayProductsForm();

    if (innerText.toLowerCase() === "Cadastro de Categoria".toLowerCase())
        displayCategoryForm();

    if (innerText.toLowerCase() === "Carrinho".toLowerCase()) displayCarrinho();

    document.querySelectorAll(".menu-item").forEach((el): void => {
        el.classList.remove("active");
    });

    liTarget.classList.add("active");
}

function cardWriter(): void {
    const container = document.querySelector(".container");

    const produtos = getProductFomLocalStorage();
    if (produtos.length === 0) {
        container!.innerHTML = `<div class="message-box">
          <h2>Sem Produtos Disponiveis</h2>
          <p>Nao ha produtos disponiveis no momento. Por favor, volte mais tarde!</p>
      </div>`;
        return;
    }

    let html = "";

    produtos.forEach((produto, i: number) => {
        html += `<div class="card">
                  <div class="card-content">
                      <h2 class="card-title">Produto ${i + 1}</h2>
                      <p class="card-info"><strong>Código:</strong> ${codeFormater(
                          produto.codigo
                      )}</p>
                      <p class="card-info"><strong>Nome:</strong> ${
                          produto.nome
                      }</p>
                      <p class="card-info"><strong>Preço:</strong> R$ ${
                          produto.preco
                      }</p>
                      <p class="card-info"><strong>Categoria:</strong> ${
                          produto.categoria
                      }</p>
                      <button class="add-to-cart" id="${
                          produto.codigo
                      }">Adicionar ao Carrinho</button><span class="cart-info">${
            produto.quantidade
        }</span></div>
              </div>`;
    });

    container!.innerHTML = html;
}

async function displayProductsForm(): Promise<void> {
    const res = await getData("CategoriaServices/categorias");
    if (!res) return;
    if (!res.data) return;
    const categorias: categoriaType[] = res.data;

    let html = `<div id="product"class="form-container">
              <h1>Cadastro de Produtos</h1>
              <form id="product-form">
                  <!-- <div class="form-group">
                      <label for="codigo">Código</label>
                      <input type="text" id="codigo" name="codigo" required />
                  </div> -->
                  <div class="form-group">
                      <label for="nome">Nome</label>
                      <input type="text" id="nome" name="nome" required />
                  </div>
                  <div class="form-group">
                      <label for="preco">Preço</label>
                      <input
                          type="number"
                          id="preco"
                          name="preco"
                          step="0.01"
                          required
                      />
                  </div>`;
    html += `<div class="form-group">
                      <label for="categoria">Categoria</label>
                      <select
                          id="categoria"
                          name="categoria"
                          required
                      >`;
    categorias.forEach((categoria) => {
        html += `<option value="${categoria.codigo}">${categoria.nome}</option>`;
    });
    html += `</select>
                  </div>
                    <div class="form-group">
                      <button type="submit" class="submit-btn produto">
                          Salvar Produto
                      </button>
                  </div>
              </form>
          </div>`;
    document.querySelector(".container")!.innerHTML = html;
}

function buttonClickInContainer(e: Event): void {
    const className = (e.target as Element).className;
    const buttonId = Number((e.target as Element).id);
    if (className.toLocaleLowerCase() === "add-to-cart".toLowerCase()) {
        addToCartEvent(buttonId);
        return;
    }

    if (className.includes("delete-btn")) deleteProduct(buttonId);

    if (className.includes("increase"))
        editCart(getEditableCartId(className), "increase");

    if (className.includes("decrease"))
        editCart(getEditableCartId(className), "decrease");
}

function editCart(id: number, operation: "increase" | "decrease"): void {
    const produtos = getProductFomLocalStorage();
    if (produtos.length === 0) return;
    const newProdutos = produtos.map((produto): cartType => {
        if (produto.codigo === id)
            return {
                ...produto,
                quantidade:
                    operation === "increase"
                        ? produto.quantidade + 1
                        : produto.quantidade - 1,
            };
        return produto;
    });
    const produtosString = JSON.stringify(newProdutos);
    localStorage.setItem("produto", produtosString);
    displayCarrinho();
}

function addToCartEvent(buttonId: number): void {
    const produtos = getProductFomLocalStorage();
    if (produtos.length === 0) return;
    const newProdutos = produtos.map((produto): cartType => {
        if (produto.codigo === buttonId)
            return { ...produto, quantidade: produto.quantidade + 1 };
        return produto;
    });

    const produtosString = JSON.stringify(newProdutos);
    localStorage.setItem("produto", produtosString);
    cardWriter();
}

function deleteProduct(buttonId: number): void {
    const produtos = getProductFomLocalStorage();
    if (produtos.length === 0) return;
    const newProdutos = produtos.map((produto): cartType => {
        if (produto.codigo === buttonId) return { ...produto, quantidade: 0 };
        return produto;
    });
    const produtosString = JSON.stringify(newProdutos);
    localStorage.setItem("produto", produtosString);
    displayCarrinho();
}

function displayCategoryForm(): void {
    document.querySelector(
        ".container"
    )!.innerHTML = `<div id="category" class="form-container">
              <h1>Cadastro de Categorias</h1>
              <form id="category-form">
                  <!-- <div class="form-group">
                      <label for="codigo">Código</label>
                      <input type="text" id="codigo" name="codigo" required />
                  </div> -->
                  <div class="form-group">
                      <label for="nome">Nome</label>
                      <input type="text" id="nome" name="nome" required />
                  </div>
                  <div class="form-group">
                      <button type="submit" class="submit-btn categoria">
                          Salvar Categoria
                      </button>
                  </div>
              </form>
          </div>`;
}

function displayCarrinho(): void {
    const container = document.querySelector(".container");
    const produtos = getProductFomLocalStorage();

    const inCart = produtos.filter(
        (produto): boolean => produto.quantidade !== 0
    );
    if (inCart.length === 0) {
        container!.innerHTML = `<div class="message-box">
          <h2>Sem Produtos No Carrinho</h2>
          <p>Nao ha produtos no seu carrinho no momento. Navegue para lista de produtos!</p>
      </div>`;
        return;
    }

    let html = `<div class="cart"><h1>Lista de Produtos</h1>
      <table class="product-table">
          <thead>
              <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Editar Quantidade</th>
              </tr>
          </thead>`;
    inCart.forEach((cart) => {
        html += `<tbody>
              <tr>
                  <td>${codeFormater(cart.codigo)}</td>
                  <td>${cart.nome}</td>
                  <td>R$ ${cart.preco}</td>
                  <td>
                      <div class="quantity-control">
                          <i class="fas fa-minus-circle decrease-${
                              cart.codigo
                          }"></i>
                          <span class="quantity">${cart.quantidade}</span>
                          <i class="fas fa-plus-circle increase-${
                              cart.codigo
                          }"></i>
                          <i class="fa-solid fa-trash delete-btn" id="${
                              cart.codigo
                          }"></i>
                      </div>
                  </td>
              </tr>`;
    });

    html += `</tbody>
      </table></div>`;
    container!.innerHTML = html;
}
