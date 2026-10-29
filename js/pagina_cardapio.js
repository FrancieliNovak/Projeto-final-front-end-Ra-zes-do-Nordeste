let categoriaAtiva = null;

/*Escolha loja */

function preencherSeletorLoja(unidadeAtual) {
  const seletor = document.querySelector(".campo_seletor_loja");

  let htmlOpcoes = "";
  listaUnidades.forEach(function (unidade) {
    const selecionado = unidade.id === unidadeAtual.id ? " selected" : "";
    htmlOpcoes =
      htmlOpcoes +
      `<option value="${unidade.id}"${selecionado}>${unidade.nome}</option>`;
  });

  seletor.innerHTML = htmlOpcoes;
}

function tratarTrocaLoja(evento) {
  const idNovaUnidade = evento.target.value;
  salvarUnidadeSelecionada(idNovaUnidade);

  const nomesRemovidos = removerItensIndisponiveis(idNovaUnidade);
  const novaUnidade = buscarUnidade(idNovaUnidade);

  if (nomesRemovidos.length > 0) {
    mostrarAviso(
      "Loja alterada para " +
        novaUnidade.nome +
        ". Removido do carrinho por não estar disponível: " +
        nomesRemovidos.join(", ") +
        ".",
      "erro",
    );
  } else {
    mostrarAviso("Loja alterada para " + novaUnidade.nome + ".", "sucesso");
  }

  categoriaAtiva = null;
  exibirCardapio();
}

/* Produtos e categorias*/

function produtosUnidade(idUnidade) {
  return listaProdutos.filter(function (produto) {
    return produtoVendidoUnidade(produto, idUnidade);
  });
}

function categoriasUnidade(idUnidade) {
  const produtos = produtosUnidade(idUnidade);

  return listaCategorias.filter(function (categoria) {
    return produtos.some(function (produto) {
      return produto.categoria === categoria.id;
    });
  });
}

function exibirCategorias(categorias) {
  const listaTela = document.querySelector(".lista_categorias");

  let htmlBotoes = "";
  categorias.forEach(function (categoria) {
    const estaAtiva = categoria.id === categoriaAtiva;
    let classeExtra = "";
    if (categoria.id === "sazonal") {
      classeExtra = " botao_categoria_sazonal";
    }

    htmlBotoes =
      htmlBotoes +
      `
            <button class="botao_categoria${classeExtra}" type="button"
                data-id-categoria="${categoria.id}" aria-pressed="${estaAtiva}">
                ${categoria.nome}
            </button>
        `;
  });

  listaTela.innerHTML = htmlBotoes;
  ligarBotoesCategoria();
}

function ligarBotoesCategoria() {
  const botoes = document.querySelectorAll(".botao_categoria");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      categoriaAtiva = botao.getAttribute("data-id-categoria");
      exibirCardapio();
    });
  });
}

function criarCartaoProduto(produto, idUnidade) {
  const linkDetalhes = "produto.html";
  const estaDisponivel = produtoDisponivel(produto, idUnidade);
  const textoBotao = textoBotaoAdicionar(produto, "+ Adicionar");

  let htmlBotao = `
        <button class="botao_secundario botao_adicionar_carrinho" type="button"
            data-id-produto="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">
            ${textoBotao}
        </button>
    `;
  let htmlIndisponivel = "";

  if (!estaDisponivel) {
    htmlBotao = `<button class="botao_secundario" type="button" disabled>Indisponível</button>`;
    htmlIndisponivel = `<p class="texto_indisponivel">Disponível de ${textoPeriodo(produto.periodoSazonal)}</p>`;
  }

  return `
        <article class="cartao_produto">
            <a class="moldura_imagem moldura_imagem_produto link_produto" href="${linkDetalhes}" data-id-produto="${produto.id}">
                <img src="${caminhoImagem(produto.imagem)}" alt="imagem produto">
            </a>
            <div class="informacoes_produto">
                <h3 class="nome_produto"><a class="link_produto" href="${linkDetalhes}" data-id-produto="${produto.id}">${produto.nome}</a></h3>
                <p class="descricao_produto">${produto.descricaoCurta}</p>
                ${htmlIndisponivel}
                <div class="rodape_cartao_produto">
                    <span class="preco_produto">${formatarPreco(produto.preco)}</span>
                    ${htmlBotao}
                </div>
            </div>
        </article>
    `;
}

function exibirProdutos(idUnidade) {
  const listaTela = document.querySelector(".lista_produtos");
  const categoria = buscarCategoria(categoriaAtiva);

  document.querySelector(".titulo_categoria").textContent = categoria.nome;

  const produtosCategoria = produtosUnidade(idUnidade).filter(
    function (produto) {
      return produto.categoria === categoriaAtiva;
    },
  );

  let htmlCartoes = "";
  produtosCategoria.forEach(function (produto) {
    htmlCartoes = htmlCartoes + criarCartaoProduto(produto, idUnidade);
  });

  listaTela.innerHTML = htmlCartoes;
  ligarBotoesAdicionar();
  ligarLinksProduto();
}

function ligarBotoesAdicionar() {
  const botoes = document.querySelectorAll(".botao_adicionar_carrinho");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      adicionarProdutoClicado(botao.getAttribute("data-id-produto"));
    });
  });
}

function ligarLinksProduto() {
  const links = document.querySelectorAll(".link_produto");

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      salvarProdutoEscolhido(link.getAttribute("data-id-produto"));
    });
  });
}

/* Campanhas sazonais */

function exibirAvisoSazonal(idUnidade) {
  const avisoTela = document.querySelector(".aviso_sazonal");
  const campanhas = campanhasSazonais(produtosUnidade(idUnidade));

  if (campanhas.length === 0) {
    avisoTela.hidden = true;
    return;
  }

  let htmlCampanhas = "";
  campanhas.forEach(function (campanha) {
    let situacao = "Fora do período no momento.";
    if (produtoDentroPeriodo(campanha.produtos[0])) {
      situacao = "Disponível agora nesta loja.";
    }

    htmlCampanhas =
      htmlCampanhas +
      `
            <span><strong>${campanha.periodo.nome}:</strong> ${textoPeriodo(campanha.periodo)}. ${situacao}</span>
        `;
  });

  avisoTela.innerHTML = `<strong>Campanhas sazonais</strong>${htmlCampanhas}`;
  avisoTela.hidden = false;
}

/* Resumo do carrinho */

function atualizarResumoCarrinho() {
  const itensCarrinho = lerCarrinho();
  const quantidadeItens = contarItensCarrinho();
  const subtotal = calcularSubtotal(itensCarrinho);

  let htmlResumo = "";
  itensCarrinho.forEach(function (item) {
    const produto = buscarProduto(item.idProduto);
    htmlResumo =
      htmlResumo +
      `
            <li class="item_resumo">
                <span>${item.quantidade}× ${produto.nome}</span>
                <span>${formatarPreco(calcularPrecoItem(item))}</span>
            </li>
        `;
  });
  document.querySelector(".lista_resumo_itens").innerHTML = htmlResumo;

  const carrinhoVazio = itensCarrinho.length === 0;
  document.querySelector(".texto_carrinho_vazio").hidden = !carrinhoVazio;
  document.querySelector(".botao_revisar_pagar").hidden = carrinhoVazio;
  document.querySelector(".valor_total_resumo").textContent =
    formatarPreco(subtotal);

  const barraFixa = document.querySelector(".barra_carrinho_fixa");
  barraFixa.querySelector(".texto_barra_carrinho").textContent =
    textoQuantidadeItens(quantidadeItens) + " · " + formatarPreco(subtotal);
  barraFixa.hidden = carrinhoVazio;
}

function adicionarProdutoClicado(idProduto) {
  const produto = buscarProduto(idProduto);
  const adicionou = adicionarCarrinho(produto.id, 1, "");

  if (adicionou) {
    mostrarAviso(produto.nome + " adicionado ao carrinho.", "sucesso");
    atualizarResumoCarrinho();
  } else {
    mostrarAviso(
      "Não foi possível adicionar " +
        produto.nome +
        ". O produto não está disponível nesta loja.",
      "erro",
    );
  }
}

/* Cardápio */

function exibirCardapio() {
  const unidade = lerUnidadeSelecionada();
  const categorias = categoriasUnidade(unidade.id);

  const categoriaExisteLoja = categorias.some(function (categoria) {
    return categoria.id === categoriaAtiva;
  });
  if (!categoriaExisteLoja) {
    categoriaAtiva = categorias[0].id;
  }

  exibirCategorias(categorias);
  exibirAvisoSazonal(unidade.id);
  exibirProdutos(unidade.id);
  atualizarResumoCarrinho();
}

document.addEventListener("DOMContentLoaded", function () {
  const unidade = garantirUnidadeSelecionada();
  if (!unidade) {
    return;
  }

  preencherSeletorLoja(unidade);
  exibirCardapio();

  document
    .querySelector(".campo_seletor_loja")
    .addEventListener("change", tratarTrocaLoja);
});
