function exibirSaudacao() {
  const saudacao = document.querySelector(".texto_saudacao");
  const nomeCliente = lerClienteFidelidade();

  if (nomeCliente) {
    saudacao.textContent = "Olá, " + nomeCliente + "!";
  } else {
    saudacao.textContent = "Olá!";
  }
}

/* Simulação de login: é feito no próprio navegador, sem servidor nem banco de
dados. O CPF não é guardado, enviado ou mostrado no console.
     - Nome ou CPF vazio não entra.
     - CPF sem exatamente 11 números não entra.
     -Consentimento de participação desmarcado não entra.
     - Tudo certo entra.*/

function mostrarErroLogin(texto) {
  mostrarErroCampo("erro_login", null, texto);
  mostrarAviso(texto, "erro");
}

function limparCpf(cpfDigitado) {
  return cpfDigitado.replace(/[.\-]/g, "");
}

function tratarLogin(evento) {
  evento.preventDefault();

  const campoNome = document.getElementById("campo_nome_completo");
  const campoCpf = document.getElementById("campo_cpf");
  const campoConsentimento = document.querySelector(
    ".campo_consentimento_fidelidade",
  );
  const nomeCompleto = campoNome.value.trim();
  const cpfDigitado = campoCpf.value.trim();

  const erros = [];

  limparErroCampo("erro_login", campoNome);
  campoCpf.removeAttribute("aria-invalid");
  campoConsentimento.removeAttribute("aria-invalid");

  // Caso 1
  if (nomeCompleto === "" || cpfDigitado === "") {
    if (nomeCompleto === "") {
      campoNome.setAttribute("aria-invalid", "true");
    }
    if (cpfDigitado === "") {
      campoCpf.setAttribute("aria-invalid", "true");
    }
    erros.push(
      "Preencha o nome completo e o CPF. Os dois campos são obrigatórios.",
    );
  }

  // Caso 2
  const cpfNumeros = limparCpf(cpfDigitado);
  if (cpfDigitado !== "" && !/^\d{11}$/.test(cpfNumeros)) {
    campoCpf.setAttribute("aria-invalid", "true");
    erros.push("O CPF deve conter 11 números.");
  }

  // Caso 3
  if (!campoConsentimento.checked) {
    campoConsentimento.setAttribute("aria-invalid", "true");
    erros.push(
      "É necessário aceitar o consentimento de participação no programa de fidelidade para continuar.",
    );
  }

  if (erros.length > 0) {
    mostrarErroLogin(erros.join(" "));
    return;
  }

  // Caso 4
  entrarFidelidade(nomeCompleto);
  campoCpf.value = "";

  salvarConsentimentos(
    campoConsentimento.checked,
    document.querySelector(".campo_consentimento_ofertas").checked,
  );

  mostrarAviso(
    "Login realizado. Bem-vindo(a) ao programa de fidelidade!",
    "sucesso",
  );
  atualizarPagina();
}

function exibirSituacaoPrograma() {
  const entrou = lerClienteFidelidade() !== null;

  document.querySelector(".area_login").hidden = entrou;
  document.querySelector(".area_participante").hidden = !entrou;

  document.querySelector(".texto_regra_fidelidade").textContent =
    "A cada " +
    formatarPreco(1) +
    " pago você ganha " +
    regrasFidelidade.pontosPorReal +
    " ponto. " +
    "Com " +
    regrasFidelidade.pontosDesconto +
    " pontos, você troca por " +
    formatarPreco(regrasFidelidade.valorDesconto) +
    " de desconto no carrinho.";

  if (entrou) {
    exibirSaldo();
    exibirHistorico();
    exibirOfertas();
  }
}

/* Pontos */

function exibirSaldo() {
  const saldo = calcularSaldoPontos();
  const pontosNecessarios = regrasFidelidade.pontosDesconto;
  const pontosBarra = Math.min(saldo, pontosNecessarios);
  const porcentagem = (pontosBarra / pontosNecessarios) * 100;

  document.querySelector(".valor_saldo").textContent = saldo + " pontos";

  const barra = document.querySelector(".barra_progresso");
  barra.setAttribute("aria-valuemax", pontosNecessarios);
  barra.setAttribute("aria-valuenow", pontosBarra);
  document.querySelector(".preenchimento_progresso").style.width =
    porcentagem + "%";

  let textoProgresso =
    "Faltam " +
    (pontosNecessarios - saldo) +
    " pontos para o próximo desconto.";
  if (saldo >= pontosNecessarios) {
    textoProgresso =
      "Você já pode usar um desconto de " +
      formatarPreco(regrasFidelidade.valorDesconto) +
      " no carrinho.";
  }
  document.querySelector(".texto_progresso").textContent = textoProgresso;
}

function exibirHistorico() {
  const historico = lerHistoricoPontos().slice().reverse();

  let htmlHistorico = "";
  historico.forEach(function (movimento) {
    const sinal = movimento.pontos > 0 ? "+" : "−";
    const dataMovimento = formatarData(movimento.data);

    htmlHistorico =
      htmlHistorico +
      `
            <li class="item_resumo item_historico">
                <span>${movimento.descricao} <span class="texto_ajuda">· ${dataMovimento}</span></span>
                <strong>${sinal}${Math.abs(movimento.pontos)}</strong>
            </li>
        `;
  });

  document.querySelector(".lista_historico_pontos").innerHTML = htmlHistorico;
  document.querySelector(".sem_historico").hidden = historico.length > 0;
}

function exibirOfertas() {
  const secaoOfertas = document.querySelector(".secao_ofertas");

  if (!lerConsentimentos().receberOfertas) {
    secaoOfertas.hidden = true;
    return;
  }

  const campanhas = campanhasSazonais(listaProdutos);
  let htmlOfertas = `<p class="texto_ajuda">Nenhuma oferta no momento.</p>`;

  if (campanhas.length > 0) {
    htmlOfertas = "";
  }

  campanhas.forEach(function (campanha) {
    const nomesProdutos = campanha.produtos.map(function (produto) {
      return produto.nome;
    });

    htmlOfertas =
      htmlOfertas +
      `
            <div class="cartao_oferta">
                <strong>Campanha sazonal — ${campanha.periodo.nome}</strong>
                <span>${nomesProdutos.join(", ")} · de ${textoPeriodo(campanha.periodo)}</span>
            </div>
        `;
  });

  document.querySelector(".lista_ofertas").innerHTML = htmlOfertas;
  secaoOfertas.hidden = false;
}

/* Consentimento e dados */

function exibirConsentimentosSalvos() {
  const consentimentos = lerConsentimentos();

  document.querySelector(".campo_consentimento_fidelidade").checked =
    consentimentos.participarFidelidade;
  document.querySelector(".campo_consentimento_ofertas").checked =
    consentimentos.receberOfertas;

  let textoRegistro = "Nenhuma preferência registrada ainda.";
  if (consentimentos.dataRegistro) {
    textoRegistro =
      "Preferências registradas em " +
      formatarData(consentimentos.dataRegistro) +
      " às " +
      formatarHorario(consentimentos.dataRegistro) +
      ".";
  }
  document.querySelector(".texto_registro_consentimento").textContent =
    textoRegistro;
}

function tratarExclusaoDados() {
  const confirmou = confirm(
    "Tem certeza? Seus pontos, seu histórico de pedidos e seus consentimentos do programa de fidelidade serão apagados e o login será encerrado. Esta ação não pode ser desfeita.",
  );

  if (!confirmou) {
    return;
  }

  excluirDadosFidelidade();
  mostrarAviso(
    "Seus dados do programa de fidelidade foram excluídos.",
    "sucesso",
  );
  atualizarPagina();
}

function atualizarPagina() {
  exibirSaudacao();
  exibirSituacaoPrograma();
  exibirConsentimentosSalvos();
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarPagina();

  document
    .querySelector(".formulario_login")
    .addEventListener("submit", tratarLogin);
  document
    .querySelector(".botao_excluir_dados")
    .addEventListener("click", tratarExclusaoDados);
});
