const grid = document.getElementById("productsGrid");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");

let categoriaAtual = "Todos";


/* =========================================================
   NORMALIZA TEXTO
   Remove acentos e transforma em minúsculas.
   Isso permite buscar, por exemplo:
   "bíblia" ou "biblia"
   ========================================================= */

function normalizar(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}


/* =========================================================
   PROTEÇÃO CONTRA HTML
   Evita que textos cadastrados nos produtos
   sejam interpretados como código HTML.
   ========================================================= */

function escapeHtml(texto = "") {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   CRIA AS CATEGORIAS AUTOMATICAMENTE
   As categorias são retiradas do produtos.js.
   ========================================================= */

function criarCategorias() {

  const categorias = [
    ...new Set(
      produtos
        .map(produto => produto.categoria)
        .filter(Boolean)
    )
  ].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );


  categoryList.innerHTML = [

    `<button
      class="category-button active"
      data-category="Todos">
      Todos
    </button>`,

    ...categorias.map(categoria => `

      <button
        class="category-button"
        data-category="${escapeHtml(categoria)}">

        ${escapeHtml(categoria)}

      </button>

    `)

  ].join("");


  /* Eventos dos botões */

  categoryList
    .querySelectorAll(".category-button")
    .forEach(button => {

      button.addEventListener("click", () => {

        categoriaAtual =
          button.dataset.category;


        categoryList
          .querySelectorAll(".category-button")
          .forEach(botao => {

            botao.classList.remove("active");

          });


        button.classList.add("active");


        renderizar();

      });

    });

}


/* =========================================================
   FILTRA OS PRODUTOS
   ========================================================= */

function produtosFiltrados() {

  const termo =
    normalizar(
      searchInput.value.trim()
    );


  return produtos.filter(produto => {

    const categoriaOk =
      categoriaAtual === "Todos" ||
      produto.categoria === categoriaAtual;


    const textoProduto =
      normalizar(`
        ${produto.nome}
        ${produto.categoria || ""}
        ${produto.descricao || ""}
      `);


    const buscaOk =
      !termo ||
      textoProduto.includes(termo);


    return categoriaOk && buscaOk;

  });

}


/* =========================================================
   RENDERIZA OS PRODUTOS
   ========================================================= */

function renderizar() {

  const lista =
    produtosFiltrados();


  /* Contador */

  resultsCount.textContent =
    `${lista.length} ${
      lista.length === 1
        ? "achadinho encontrado"
        : "achadinhos encontrados"
    }`;


  /* Se não houver produtos */

  if (lista.length === 0) {

    grid.innerHTML = "";

    grid.hidden = true;

    emptyState.hidden = false;

    return;

  }


  grid.hidden = false;

  emptyState.hidden = true;


  /* Cria os cards */

  grid.innerHTML = lista.map(produto => `

    <article class="product-card">

      <img
        class="product-image"
        src="${escapeHtml(produto.imagem)}"
        alt="${escapeHtml(produto.nome)}"
        loading="lazy"
      >

      <div class="product-content">

        <div class="product-category">
          ${escapeHtml(
            produto.categoria || "Achadinho"
          )}
        </div>


        <h3 class="product-title">
          ${escapeHtml(produto.nome)}
        </h3>


        <p class="product-description">
          ${escapeHtml(
            produto.descricao || ""
          )}
        </p>


        <a
          class="product-link"
          href="${escapeHtml(produto.link)}"
          target="_blank"
          rel="noopener noreferrer sponsored"
        >

          Ver na Shopee

          <span>↗</span>

        </a>

      </div>

    </article>

  `).join("");

}


/* =========================================================
   BOTÃO DE LIMPAR BUSCA
   ========================================================= */

function atualizarBotaoLimpar() {

  clearSearch.style.display =
    searchInput.value
      ? "block"
      : "none";

}


/* =========================================================
   BUSCA EM TEMPO REAL
   ========================================================= */

searchInput.addEventListener(
  "input",
  () => {

    atualizarBotaoLimpar();

    renderizar();

  }
);


/* =========================================================
   LIMPAR BUSCA
   ========================================================= */

clearSearch.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    atualizarBotaoLimpar();

    renderizar();

    searchInput.focus();

  }
);


/* =========================================================
   RESETAR FILTROS
   ========================================================= */

resetFilters.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    categoriaAtual = "Todos";


    categoryList
      .querySelectorAll(".category-button")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.category === "Todos"
        );

      });


    atualizarBotaoLimpar();

    renderizar();

  }
);


/* =========================================================
   ANO AUTOMÁTICO DO RODAPÉ
   ========================================================= */

const yearElement =
  document.getElementById("year");

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

criarCategorias();

atualizarBotaoLimpar();

renderizar();
