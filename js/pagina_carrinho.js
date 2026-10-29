function criarItemCarrinho(item, indiceItem) {
  const produto = buscarProduto(item.idProduto);

  let textoCombo = "";
  if (produtoCombo(produto)) {
    textoCombo = `<p class="composicao_combo">Inclui: ${textoComposicaoCombo(produto)}</p>`;
  }

  let textoObservacao = "";
  if (item.observacao !== "") {
    textoObservacao = "Obs.: " + escaparTexto(item.observacao) + " · ";
  }

  const diminuirDesativado = item.quantidade <= 1 ? " disabled" : "";
  const aumentarDesativado =
    item.quantidade >= quantidadeMaximaItem ? " disabled" : "";

  return `
        <li class="item_carrinho">
            <div class="cabecalho_item_carrinho">
                <h2 class="nome_item_carrinho">${produto.nome}</h2>
                <span class="preco_item_carrinho">${formatarPreco(calcularPrecoItem(item))}</span>
            </div>
            ${textoCombo}
            <p class="detalhe_item_carrinho">${textoObservacao}${formatarPreco(produto.preco)} cada</p>

            <div class="acoes_item_carrinho">
                <div class="controle_quantidade" role="group" aria-label="Quantidade de ${produto.nome}">
                    <button class="botao_quantidade" type="button" data-acao="diminuir" data-indice="${indiceItem}"
                        aria-label="Diminuir quantidade de ${produto.nome}"${diminuirDesativado}>−</button>
                    <span class="valor_quantidade">${item.quantidade}</span>
                    <button class="botao_quantidade" type="button" data-acao="aumentar" data-indice="${indiceItem}"
                        aria-label="Aumentar quantidade de ${produto.nome}"${aumentarDesativado}>+</button>
                </div>
                <button class="botao_remover" type="button" data-acao="remover" data-indice="${indiceItem}"
                    aria-label="Remover ${produto.nome} do carrinho">Remover</button>
            </div>
        </li>
    `;
}

/* Fidelidade */

function exibirCaixaFidelidade() {
  const caixa = document.querySelector(".caixa_fidelidade_carrinho");
  const saldo = calcularSaldoPontos();
  const opcoesPedido = lerOpcoesPedido();

  if (!participaFidelidade()) {
    caixa.innerHTML = `
            <p>Participe do programa de fidelidade e acumule pontos nos seus pedidos.
            <a class="link_simples" href="fidelidade.html">Saiba mais</a></p>
        `;
    return;
  }

  if (!podeUsarDescontoFidelidade()) {
    const pontosFaltando = regrasFidelidade.pontosDesconto - saldo;
    caixa.innerHTML = `<p>Você tem ${saldo} pontos. Faltam ${pontosFaltando} pontos para usar um desconto.</p>`;
    return;
  }

  const marcado = opcoesPedido.usarDesconto ? " checked" : "";
  caixa.innerHTML = `
        <label class="opcao_escolha">
            <input type="checkbox" class="campo_usar_desconto"${marcado}>
            <span>Usar desconto de fidelidade de ${formatarPreco(regrasFidelidade.valorDesconto)}
            (você tem ${saldo} pontos; serão usados ${regrasFidelidade.pontosDesconto})</span>
        </label>
    `;
}

function atualizarValores() {
  const totais = calcularTotais(lerCarrinho());

  document.querySelector(".valor_subtotal").textContent = formatarPreco(
    totais.subtotal,
  );
  document.querySelector(".valor_desconto").textContent =
    "− " + formatarPreco(totais.desconto);
  document.querySelector(".linha_desconto").hidden = totais.desconto === 0;
  document.querySelector(".valor_total").textContent = formatarPreco(
    totais.total,
  );
}

function exibirCarrinho() {
  const itensCarrinho = lerCarrinho();
  const carrinhoVazio = itensCarrinho.length === 0;

  document.querySelector(".carrinho_vazio").hidden = !carrinhoVazio;
  document.querySelector(".conteudo_carrinho").hidden = carrinhoVazio;

  if (carrinhoVazio) {
    return;
  }

  let htmlItens = "";
  itensCarrinho.forEach(function (item, indiceItem) {
    htmlItens = htmlItens + criarItemCarrinho(item, indiceItem);
  });
  document.querySelector(".lista_itens_carrinho").innerHTML = htmlItens;
  ligarBotoesItens();

  exibirCaixaFidelidade();
  atualizarValores();
}

function ligarBotoesItens() {
  const botoes = document.querySelectorAll(".lista_itens_carrinho button");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      tratarCliqueItem(botao);
    });
  });
}

function tratarCliqueItem(botao) {
  const indiceItem = Number(botao.getAttribute("data-indice"));
  const item = lerCarrinho()[indiceItem];
  const produto = buscarProduto(item.idProduto);
  const acao = botao.getAttribute("data-acao");

  if (acao === "remover") {
    removerCarrinho(indiceItem);
    mostrarAviso(produto.nome + " removido do carrinho.", "sucesso");
  }

  if (acao === "aumentar" || acao === "diminuir") {
    const novaQuantidade =
      acao === "aumentar" ? item.quantidade + 1 : item.quantidade - 1;

    if (alterarQuantidade(indiceItem, novaQuantidade)) {
      mostrarAviso(
        "Quantidade de " +
          produto.nome +
          " alterada para " +
          novaQuantidade +
          ".",
        "sucesso",
      );
    }
  }

  exibirCarrinho();
}

/* Forma de recebimento e desconto */

function prepararFormaRecebimento() {
  const opcoesPedido = lerOpcoesPedido();
  const opcoesTela = document.querySelectorAll(
    'input[name="forma_recebimento"]',
  );

  opcoesTela.forEach(function (opcao) {
    opcao.checked = opcao.value === opcoesPedido.formaRecebimento;

    opcao.addEventListener("change", function () {
      alterarOpcaoPedido("formaRecebimento", opcao.value);
    });
  });
}

function tratarMudancaDesconto(evento) {
  if (!evento.target.classList.contains("campo_usar_desconto")) {
    return;
  }

  alterarOpcaoPedido("usarDesconto", evento.target.checked);
  atualizarValores();
}

document.addEventListener("DOMContentLoaded", function () {
  const unidade = garantirUnidadeSelecionada();
  if (!unidade) {
    return;
  }

  document.querySelector(".texto_loja_atual").textContent =
    "Loja: " + unidade.nome;

  const nomesRemovidos = removerItensIndisponiveis(unidade.id);
  if (nomesRemovidos.length > 0) {
    mostrarAviso(
      "Removido do carrinho por não estar mais disponível: " +
        nomesRemovidos.join(", ") +
        ".",
      "erro",
    );
  }

  exibirCarrinho();
  prepararFormaRecebimento();

  document
    .querySelector(".caixa_fidelidade_carrinho")
    .addEventListener("change", tratarMudancaDesconto);
});
