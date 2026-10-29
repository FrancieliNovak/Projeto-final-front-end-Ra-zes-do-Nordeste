const intervaloStatus = 5000;

let temporizadorStatus = null;

function etapaPedido(pedido) {
  return Math.min(pedido.etapaAtual, ultimaEtapa);
}

function pedidoPronto(pedido) {
  return etapaPedido(pedido) === ultimaEtapa;
}

/* Linha do tempo status */

function buscarHorarioEtapa(pedido, nomeEtapa) {
  const registro = pedido.historicoEtapas.find(function (historico) {
    return historico.etapa === nomeEtapa;
  });
  return registro ? formatarHorario(registro.horario) : "";
}

function exibirLinhaTempo(pedido) {
  const etapaAtual = etapaPedido(pedido);
  let htmlEtapas = "";

  etapasPedido.forEach(function (nomeEtapa, indiceEtapa) {
    let classeEtapa = "etapa_status";
    let textoSituacao = "";

    const etapaFinalAlcancada =
      indiceEtapa === ultimaEtapa && etapaAtual === ultimaEtapa;

    if (indiceEtapa < etapaAtual || etapaFinalAlcancada) {
      classeEtapa = "etapa_status etapa_concluida";
      textoSituacao = buscarHorarioEtapa(pedido, nomeEtapa) + " · concluído";
    } else if (indiceEtapa === etapaAtual) {
      classeEtapa = "etapa_status etapa_atual";
      textoSituacao = buscarHorarioEtapa(pedido, nomeEtapa) + " · etapa atual";
    }

    htmlEtapas =
      htmlEtapas +
      `
            <li class="${classeEtapa}">
                <span class="nome_etapa_status">${nomeEtapa}</span>
                <span class="situacao_etapa_status">${textoSituacao}</span>
            </li>
        `;
  });

  document.querySelector(".linha_tempo_status").innerHTML = htmlEtapas;
}

function textoMensagemPrincipal(pedido) {
  const nomeEtapa = etapasPedido[etapaPedido(pedido)];

  if (nomeEtapa === "Em preparo") {
    return "Seu pedido está sendo preparado.";
  }
  if (nomeEtapa === "Pronto" && pedido.formaRecebimento === "retirada") {
    return "Seu pedido está pronto para levar!";
  }
  if (nomeEtapa === "Pronto") {
    return "Seu pedido está pronto e será servido.";
  }
  return "Seu pedido foi recebido pela loja.";
}

function exibirItensPedido(pedido) {
  let quantidadeItens = 0;
  let htmlItens = "";

  pedido.itens.forEach(function (item) {
    quantidadeItens = quantidadeItens + item.quantidade;

    let textoCombo = "";
    if (item.composicao) {
      textoCombo = `<span class="detalhe_item_carrinho">Inclui: ${item.composicao}</span>`;
    }

    let textoObservacao = "";
    if (item.observacao !== "") {
      textoObservacao = `<span class="detalhe_item_carrinho">Obs.: ${escaparTexto(item.observacao)}</span>`;
    }

    htmlItens =
      htmlItens +
      `
            <li class="item_resumo">
                <span>${item.quantidade}× ${item.nomeProduto} ${textoCombo} ${textoObservacao}</span>
                <span>${formatarPreco(item.precoUnitario * item.quantidade)}</span>
            </li>
        `;
  });

  document.querySelector(".resumo_itens_pedido").textContent =
    "Itens do pedido (" +
    quantidadeItens +
    ") · " +
    formatarPreco(pedido.total);
  document.querySelector(".lista_itens_pedido").innerHTML = htmlItens;

  let htmlDesconto = "";
  if (pedido.desconto > 0) {
    htmlDesconto = `<div class="linha_valor"><span>Desconto fidelidade</span><span>− ${formatarPreco(pedido.desconto)}</span></div>`;
  }

  document.querySelector(".valores_pedido").innerHTML = `
        <div class="linha_valor"><span>Subtotal</span><span>${formatarPreco(pedido.subtotal)}</span></div>
        ${htmlDesconto}
        <div class="linha_valor linha_valor_total"><span>Total</span><strong>${formatarPreco(pedido.total)}</strong></div>
        <p class="texto_ajuda">Pagamento: ${textoFormaPagamento(pedido.formaPagamento)}</p>
    `;
}

function exibirPontosPedido(pedido) {
  const caixa = document.querySelector(".caixa_pontos_pedido");

  if (pedido.pontosGanhos > 0) {
    caixa.innerHTML = `Você ganhou <strong>+${pedido.pontosGanhos} pontos</strong> neste pedido.
            <a class="link_simples" href="fidelidade.html">Ver fidelidade ›</a>`;
  } else {
    caixa.innerHTML = `Participe do programa de fidelidade para acumular pontos.
            <a class="link_simples" href="fidelidade.html">Saiba mais ›</a>`;
  }
}

function exibirPedido(pedido) {
  const unidade = buscarUnidade(pedido.idUnidade);

  document.querySelector(".texto_dados_pedido").textContent =
    "Loja " +
    unidade.nome +
    " · " +
    textoFormaRecebimento(pedido.formaRecebimento);
  document.querySelector(".numero_pedido").textContent =
    "Pedido " + formatarNumeroPedido(pedido.numero);
  document.querySelector(".texto_caixa_sucesso").textContent =
    textoMensagemPrincipal(pedido);

  document.querySelector(".botao_entregue").hidden = !pedidoPronto(pedido);

  exibirLinhaTempo(pedido);
  exibirItensPedido(pedido);
  exibirPontosPedido(pedido);
}

/* Simulação de atualização de status. Começa com pagamento aprovado, utilizando um temporizador por vez, para ao chegar em pronto */

function iniciarSimulacaoStatus(pedido) {
  const pagamentoAprovado = pedido.situacaoPagamento === "aprovado";

  if (!pagamentoAprovado || pedidoPronto(pedido) || temporizadorStatus !== null) {
    return;
  }

  temporizadorStatus = setInterval(atualizarStatus, intervaloStatus);
}

function pararSimulacaoStatus() {
  clearInterval(temporizadorStatus);
  temporizadorStatus = null;
}

function atualizarStatus() {
  avancarEtapaPedido();

  const pedidoSalvo = lerPedidoAtual();

  if (!pedidoSalvo) {
    pararSimulacaoStatus();
    return;
  }

  exibirPedido(pedidoSalvo);
  mostrarAviso(
    "Status atualizado: " + etapasPedido[etapaPedido(pedidoSalvo)] + ".",
    "sucesso",
  );

  if (pedidoPronto(pedidoSalvo)) {
    pararSimulacaoStatus();
  }
}

function exibirAreaVazia() {
  document.querySelector(".conteudo_pedido").hidden = true;
  document.querySelector(".linha_tempo_status").innerHTML = "";
  document.querySelector(".sem_pedido").hidden = false;
}

function concluirEntrega() {
  pararSimulacaoStatus();
  limparPedidoAtual();
  exibirAreaVazia();
  mostrarAviso("Pedido entregue. O status foi limpo.", "sucesso");
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".botao_entregue")
    .addEventListener("click", concluirEntrega);

  const pedido = lerPedidoAtual();

  if (!pedido) {
    exibirAreaVazia();
    return;
  }

  document.querySelector(".conteudo_pedido").hidden = false;
  exibirPedido(pedido);
  iniciarSimulacaoStatus(pedido);
});
