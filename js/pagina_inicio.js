/* Unidade */

function criarCartaoUnidade(unidade, idUnidadeAtual) {
  let classeSelecionada = "";
  if (unidade.id === idUnidadeAtual) {
    classeSelecionada = " cartao_unidade_selecionado";
  }

  let classeEtiqueta = "etiqueta_formato";
  if (unidade.formato === "reduzida") {
    classeEtiqueta = "etiqueta_formato etiqueta_formato_reduzido";
  }

  return `
        <button class="cartao_unidade${classeSelecionada}" type="button" data-id-unidade="${unidade.id}">
            <span class="moldura_imagem moldura_imagem_unidade">
                <img src="${caminhoImagem(unidade.imagem)}" alt="">
            </span>
            <span class="informacoes_unidade">
                <span class="nome_unidade">${unidade.nome}</span>
                <span class="${classeEtiqueta}">${unidade.descricaoFormato}</span>
            </span>
            <span class="seta_cartao" aria-hidden="true">›</span>
        </button>
    `;
}

function exibirUnidades() {
  const listaTela = document.querySelector(".lista_unidades");
  const unidadeAtual = lerUnidadeSelecionada();
  const idUnidadeAtual = unidadeAtual ? unidadeAtual.id : null;

  let htmlCartoes = "";
  listaUnidades.forEach(function (unidade) {
    htmlCartoes = htmlCartoes + criarCartaoUnidade(unidade, idUnidadeAtual);
  });

  listaTela.innerHTML = htmlCartoes;
  ligarCartoesUnidade();
}

function ligarCartoesUnidade() {
  const cartoes = document.querySelectorAll(".cartao_unidade");

  cartoes.forEach(function (cartao) {
    cartao.addEventListener("click", function () {
      escolherUnidade(cartao.getAttribute("data-id-unidade"));
    });
  });
}

function escolherUnidade(idUnidade) {
  salvarUnidadeSelecionada(idUnidade);
  window.location.href = "pages/cardapio.html";
}

document.addEventListener("DOMContentLoaded", function () {
  exibirUnidades();
});
