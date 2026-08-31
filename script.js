const API_URL = "https://script.google.com/macros/s/AKfycbz1ZBE8fHeQpF4w8tn85nbhLpn_YOpa_Leg5tm53NoISLOOxM7oTnnZDekWJlb0TIVU/exec";

// Atualiza o ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Elementos do DOM
const grid = document.getElementById('productsGrid');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const resultsCount = document.getElementById('resultsCount');
const emptyState = document.getElementById('emptyState');
const resetFiltersBtn = document.getElementById('resetFilters');

// Estado da aplicação
let todosProdutos = [];
let categoriaAtiva = 'Todas';
let termoBusca = '';

// 1. Busca os produtos na planilha
async function carregarProdutos() {
  try {
    const resposta = await fetch(API_URL);
    todosProdutos = await resposta.json();
    
    // Extrai categorias únicas e cria os botões
    renderizarCategorias();
    
    // Renderiza os produtos filtrados (inicialmente todos)
    filtrarERenderizar();
    
  } catch (erro) {
    console.error("Erro ao carregar os achadinhos:", erro);
    grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Ocorreu um erro ao carregar os produtos. Atualize a página e tente novamente.</p>';
  }
}

// 2. Cria os botões de categoria baseados nos produtos que vieram da planilha
function renderizarCategorias() {
  // Pega todas as categorias e remove duplicatas
  const categoriasUnicas = ['Todas', ...new Set(todosProdutos.map(p => p.categoria))];
  
  categoryList.innerHTML = '';
  
  categoriasUnicas.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = cat === categoriaAtiva ? 'active' : '';
    
    btn.addEventListener('click', () => {
      // Atualiza botões ativos
      document.querySelectorAll('#categoryList button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      categoriaAtiva = cat;
      filtrarERenderizar();
    });
    
    categoryList.appendChild(btn);
  });
}

// 3. Filtra os produtos por texto e categoria, e desenha na tela
function filtrarERenderizar() {
  const produtosFiltrados = todosProdutos.filter(produto => {
    const bateCategoria = categoriaAtiva === 'Todas' || produto.categoria === categoriaAtiva;
    
    const termo = termoBusca.toLowerCase();
    const bateBusca = produto.nome.toLowerCase().includes(termo) || 
                      produto.descricao.toLowerCase().includes(termo);
                      
    return bateCategoria && bateBusca;
  });
  
  // Atualiza contador
  resultsCount.textContent = `${produtosFiltrados.length} ${produtosFiltrados.length === 1 ? 'achadinho' : 'achadinhos'}`;
  
  // Limpa a tela
  grid.innerHTML = '';
  
  // Mostra Empty State se não achar nada
  if (produtosFiltrados.length === 0) {
    emptyState.hidden = false;
    return;
  } else {
    emptyState.hidden = true;
  }

  // Desenha os cards
  produtosFiltrados.forEach(produto => {
    const article = document.createElement('article');
    article.className = 'product-card'; 
    
    article.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" loading="lazy">
      <div class="product-info">
        <span class="product-category">${produto.categoria}</span>
        <h3 class="product-title">${produto.nome}</h3>
        <p class="product-desc">${produto.descricao}</p>
        <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="product-link">
          Ver achadinho <span>↗</span>
        </a>
      </div>
    `;
    
    grid.appendChild(article);
  });
}

// 4. Eventos de Busca
searchInput.addEventListener('input', (e) => {
  termoBusca = e.target.value;
  clearSearchBtn.style.display = termoBusca.length > 0 ? 'block' : 'none';
  filtrarERenderizar();
});

clearSearchBtn.addEventListener('click', () => {
  termoBusca = '';
  searchInput.value = '';
  clearSearchBtn.style.display = 'none';
  filtrarERenderizar();
});

resetFiltersBtn.addEventListener('click', () => {
  termoBusca = '';
  searchInput.value = '';
  clearSearchBtn.style.display = 'none';
  categoriaAtiva = 'Todas';
  
  document.querySelectorAll('#categoryList button').forEach(b => {
    b.classList.toggle('active', b.textContent === 'Todas');
  });
  
  filtrarERenderizar();
});

// Inicia o app
carregarProdutos();
