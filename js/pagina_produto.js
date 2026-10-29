let produtoAtual = null;
let quantidadeEscolhida = 1;


function exibirProduto(produto) {
  const categoria = buscarCategoria(produto.categoria);
  const imagem = document.querySelector(".imagem_detalhe_produto");

  imagem.src = caminhoImagem(produto.imagem);

  document.querySelector(".categoria_detalhe").textContent = categoria.nome;
  document.querySelector(".nome_detalhe").textContent = produto.nome;
  document.querySelector(".preco_detalhe").textContent = formatarPreco(
    produto.preco,
  );
  document.querySelector(".descricao_detalhe").textContent =
    produto.descricaoCompleta;
  document.title = produto.nome + " — Raízes do Nordeste";

  exibirItensCombo(produto);

  document.querySelector(".detalhe_produto").hidden = false;
  atualizarQuantidadeTela();
}

function exibirItensCombo(produto) {
  const caixaCombo = document.querySelector(".caixa_combo");

  if (!produtoCombo(produto)) {
    caixaCombo.hidden = true;
    return;
  }

  let htmlItens = "";
  nomesItensCombo(produto).forEach(function (nomeItem) {
    htmlItens = htmlItens + `<li>${nomeItem}</li>`;
  });

  document.querySelector(".lista_combo").innerHTML = htmlItens;
  caixaCombo.hidden = false;
}

function exibirProdutoNaoEncontrado() {
  document.querySelector(".produto_nao_encontrado").hidden = false;
}

function atualizarQuantidadeTela() {
  const valorTotal = produtoAtual.preco * quantidadeEscolhida;
  const textoBotao = textoBotaoAdicionar(produtoAtual, "Adicionar ao carrinho");

  document.querySelector(".valor_quantidade").textContent = quantidadeEscolhida;
  document.querySelector(".botao_confirmar_produto").textContent =
    textoBotao + " · " + formatarPreco(valorTotal);

  document.querySelector(".botao_diminuir").disabled = quantidadeEscolhida <= 1;
  document.querySelector(".botao_aumentar").disabled =
    quantidadeEscolhida >= quantidadeMaximaItem;
}

function diminuirQuantidade() {
  if (quantidadeEscolhida > 1) {
    quantidadeEscolhida = quantidadeEscolhida - 1;
    atualizarQuantidadeTela();
  }
}

function aumentarQuantidade() {
  if (quantidadeEscolhida < quantidadeMaximaItem) {
    quantidadeEscolhida = quantidadeEscolhida + 1;
    atualizarQuantidadeTela();
  }
}

function confirmarProduto(evento) {
  evento.preventDefault();

  const observacao = document.querySelector(".campo_observacao").value;
  const adicionou = adicionarCarrinho(
    produtoAtual.id,
    quantidadeEscolhida,
    observacao,
  );

  if (!adicionou) {
    mostrarAviso(
      "Não foi possível adicionar. O produto não está disponível nesta loja.",
      "erro",
    );
    return;
  }

  guardarAvisoProximaPagina(produtoAtual.nome + " adicionado ao carrinho.");
  window.location.href = "carrinho.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const unidade = garantirUnidadeSelecionada();
  if (!unidade) {
    return;
  }

  produtoAtual = buscarProduto(lerProdutoEscolhido());

  if (!produtoAtual || !produtoDisponivel(produtoAtual, unidade.id)) {
    exibirProdutoNaoEncontrado();
    return;
  }

  exibirProduto(produtoAtual);

  document
    .querySelector(".botao_diminuir")
    .addEventListener("click", diminuirQuantidade);
  document
    .querySelector(".botao_aumentar")
    .addEventListener("click", aumentarQuantidade);
  document
    .querySelector(".formulario_produto")
    .addEventListener("submit", confirmarProduto);
});
