/* Resumo pedido */

function exibirResumoPagamento() {
  const unidade = lerUnidadeSelecionada();
  const opcoesPedido = lerOpcoesPedido();
  const quantidadeItens = contarItensCarrinho();
  const totais = calcularTotais(lerCarrinho());

  document.querySelector(".texto_resumo_pagamento").textContent =
    textoQuantidadeItens(quantidadeItens) +
    " · " +
    textoFormaRecebimento(opcoesPedido.formaRecebimento) +
    " · " +
    unidade.nome;

  document.querySelector(".botao_pagar").textContent =
    "Pagar " + formatarPreco(totais.total);
}

function validarFormulario() {
  const campoNome = document.getElementById("campo_nome");
  const formaPagamento = document.querySelector(
    'input[name="forma_pagamento"]:checked',
  );
  const campoPrivacidade = document.getElementById("campo_privacidade");
  const camposErro = [];

  const nomeDigitado = campoNome.value.trim();
  if (nomeDigitado.length < 2) {
    mostrarErroCampo(
      "erro_nome",
      campoNome,
      "Informe seu nome para continuar (pelo menos 2 letras).",
    );
    camposErro.push(campoNome);
  } else {
    limparErroCampo("erro_nome", campoNome);
  }

  if (!formaPagamento) {
    mostrarErroCampo(
      "erro_forma_pagamento",
      null,
      "Escolha uma forma de pagamento.",
    );
    camposErro.push(document.querySelector('input[name="forma_pagamento"]'));
  } else {
    limparErroCampo("erro_forma_pagamento", null);
  }

  if (!campoPrivacidade.checked) {
    mostrarErroCampo(
      "erro_privacidade",
      campoPrivacidade,
      "Confirme que leu a Política de Privacidade.",
    );
    camposErro.push(campoPrivacidade);
  } else {
    limparErroCampo("erro_privacidade", campoPrivacidade);
  }

  if (camposErro.length > 0) {
    camposErro[0].focus();
    mostrarAviso("Revise os campos destacados para continuar.", "erro");
    return false;
  }

  return true;
}

/* Solicitar pagamento - Simulação do serviço externo (botões para aprovar ou recusar) */

function solicitarPagamento(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  document.querySelector(".mensagem_pagamento_recusado").hidden = true;

  document.querySelector(".botao_pagar").disabled = true;

  const painel = document.querySelector(".painel_servico_pagamento");
  painel.hidden = false;
  painel.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* Pagamento recusado */

function tratarPagamentoRecusado() {
  document.querySelector(".painel_servico_pagamento").hidden = true;
  document.querySelector(".botao_pagar").disabled = false;

  const mensagemRecusado = document.querySelector(
    ".mensagem_pagamento_recusado",
  );
  mensagemRecusado.hidden = false;
  mensagemRecusado.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* Pagamento aprovado */

function tratarPagamentoAprovado() {
  const unidade = lerUnidadeSelecionada();
  const opcoesPedido = lerOpcoesPedido();
  const itensCarrinho = lerCarrinho();
  const totais = calcularTotais(itensCarrinho);

  if (totais.desconto > 0) {
    registrarMovimentoPontos(
      "Desconto usado",
      -regrasFidelidade.pontosDesconto,
    );
  }

  const pontosGanhos = calcularPontosGanhos(totais.total);

  const novoPedido = criarPedido({
    idUnidade: unidade.id,
    nomeCliente: document.getElementById("campo_nome").value.trim(),
    formaRecebimento: opcoesPedido.formaRecebimento,
    formaPagamento: document.querySelector(
      'input[name="forma_pagamento"]:checked',
    ).value,
    itensCarrinho: itensCarrinho,
    totais: totais,
    pontosGanhos: pontosGanhos,
  });

  if (pontosGanhos > 0) {
    registrarMovimentoPontos(
      "Pedido " +
        formatarNumeroPedido(novoPedido.numero) +
        " · " +
        unidade.nome,
      pontosGanhos,
    );
  }

  esvaziarCarrinho();
  alterarOpcaoPedido("usarDesconto", false);

  guardarAvisoProximaPagina(
    "Pagamento aprovado. Pedido " +
      formatarNumeroPedido(novoPedido.numero) +
      " recebido pela loja.",
  );

  window.location.href = "pedido.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const unidade = lerUnidadeSelecionada();

  if (!unidade || lerCarrinho().length === 0) {
    window.location.href = "cardapio.html";
    return;
  }

  exibirResumoPagamento();

  document
    .querySelector(".formulario_pagamento")
    .addEventListener("submit", solicitarPagamento);
  document
    .querySelector(".botao_simular_aprovado")
    .addEventListener("click", tratarPagamentoAprovado);
  document
    .querySelector(".botao_simular_recusado")
    .addEventListener("click", tratarPagamentoRecusado);
});
