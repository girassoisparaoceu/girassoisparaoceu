const API_URL = "https://script.google.com/macros/s/AKfycbxMbo5pc6gPJdjelCCTlrZAUbhhu9GgCKDaoHipIje-XcWTcmCKzxmGTuu7YeGkqd1P/exec";

// Atualiza o ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

let todosProdutos = [];

// Função que busca os dados da planilha
async function carregarProdutosDaPlanilha() {
  const grid = document.getElementById('productsGrid');
  
  try {
    const resposta = await fetch(API_URL);
    todosProdutos = await resposta.json();
    
    // Limpa a mensagem de "Carregando..."
    grid.innerHTML = '';
    
    renderizarProdutos(todosProdutos);
    
  } catch (erro) {
    console.error("Erro ao carregar os achadinhos:", erro);
    grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Ocorreu um erro ao carregar os produtos. Tente recarregar a página.</p>';
  }
}

// Função para montar o HTML de cada produto na tela
function renderizarProdutos(produtos) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = ''; // Limpa a grade antes de renderizar
  
  if(produtos.length === 0) {
     document.getElementById('emptyState').hidden = false;
     return;
  } else {
     document.getElementById('emptyState').hidden = true;
  }

  produtos.forEach(produto => {
    // Cria o card do produto. 
    // Adapte as classes CSS abaixo (como 'product-card', 'product-image') conforme o seu style.css
    const produtoEl = document.createElement('article');
    produtoEl.className = 'product-card'; 
    
    produtoEl.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" loading="lazy">
      <div class="product-info">
        <span class="product-category">${produto.categoria}</span>
        <h3 class="product-title">${produto.nome}</h3>
        <p class="product-desc">${produto.descricao}</p>
        <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="product-link">
          Ver na loja <span>↗</span>
        </a>
      </div>
    `;
    
    grid.appendChild(produtoEl);
  });
}

// Inicia o carregamento assim que a página abre
carregarProdutosDaPlanilha();
