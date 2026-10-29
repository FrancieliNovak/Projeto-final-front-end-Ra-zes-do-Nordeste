/*Funções principais*/

function lerArmazenamento(chave, valorPadrao) {
  const textoSalvo = localStorage.getItem(chave);

  if (textoSalvo === null) {
    return valorPadrao;
  }

  try {
    return JSON.parse(textoSalvo);
  } catch (erro) {
    return valorPadrao;
  }
}

function salvarArmazenamento(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarHorario(textoDataHora) {
  return new Date(textoDataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarData(textoDataHora) {
  return new Date(textoDataHora).toLocaleDateString("pt-BR");
}

function textoQuantidadeItens(quantidade) {
  return quantidade + (quantidade === 1 ? " item" : " itens");
}

function escaparTexto(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function caminhoImagem(nomeArquivo) {
  const caminhoRaiz = document.body.getAttribute("data-raiz") || "";
  return caminhoRaiz + "assets/imagens/" + nomeArquivo;
}

let temporizadorAviso = null;

function mostrarAviso(mensagem, tipo) {
  const caixaAviso = document.querySelector(".caixa_aviso");

  if (!caixaAviso) {
    return;
  }

  caixaAviso.textContent = mensagem;

  caixaAviso.className = "caixa_aviso caixa_aviso_visivel";
  if (tipo === "erro") {
    caixaAviso.classList.add("caixa_aviso_erro");
  }

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    caixaAviso.classList.remove("caixa_aviso_visivel");
  }, 3500);
}

const chaveAvisoPendente = "raizes_aviso_pendente";

function guardarAvisoProximaPagina(mensagem) {
  salvarArmazenamento(chaveAvisoPendente, mensagem);
}

function exibirAvisoPendente() {
  const mensagemPendente = lerArmazenamento(chaveAvisoPendente, null);

  if (mensagemPendente) {
    mostrarAviso(mensagemPendente, "sucesso");
    localStorage.removeItem(chaveAvisoPendente);
  }
}

/* Mensagem erro */

function mostrarErroCampo(idMensagem, campo, texto) {
  const mensagem = document.getElementById(idMensagem);
  mensagem.textContent = "⚠ " + texto;
  mensagem.hidden = false;

  if (campo) {
    campo.setAttribute("aria-invalid", "true");
  }
}

function limparErroCampo(idMensagem, campo) {
  document.getElementById(idMensagem).hidden = true;

  if (campo) {
    campo.removeAttribute("aria-invalid");
  }
}

/* Escolha da unidade */

const chaveUnidadeSelecionada = "raizes_unidade_selecionada";

function salvarUnidadeSelecionada(idUnidade) {
  salvarArmazenamento(chaveUnidadeSelecionada, idUnidade);
}

function buscarUnidade(idUnidade) {
  return listaUnidades.find(function (unidade) {
    return unidade.id === idUnidade;
  });
}

function lerUnidadeSelecionada() {
  const idUnidade = lerArmazenamento(chaveUnidadeSelecionada, null);
  return buscarUnidade(idUnidade);
}

function garantirUnidadeSelecionada() {
  const unidade = lerUnidadeSelecionada();

  if (!unidade) {
    window.location.href = "../index.html";
    return null;
  }
  return unidade;
}

/* Busca e disponibilidade */

function buscarProduto(idProduto) {
  return listaProdutos.find(function (produto) {
    return produto.id === idProduto;
  });
}

const chaveProdutoEscolhido = "raizes_produto_escolhido";

function salvarProdutoEscolhido(idProduto) {
  salvarArmazenamento(chaveProdutoEscolhido, idProduto);
}

function lerProdutoEscolhido() {
  return lerArmazenamento(chaveProdutoEscolhido, null);
}

function buscarCategoria(idCategoria) {
  return listaCategorias.find(function (categoria) {
    return categoria.id === idCategoria;
  });
}

function produtoVendidoUnidade(produto, idUnidade) {
  return produto.unidades.includes(idUnidade);
}

function produtoDentroPeriodo(produto) {
  if (produto.periodoSazonal === null) {
    return true;
  }

  const hoje = new Date();
  const numeroHoje = (hoje.getMonth() + 1) * 100 + hoje.getDate();
  const periodo = produto.periodoSazonal;
  const numeroInicio = periodo.mesInicio * 100 + periodo.diaInicio;
  const numeroFim = periodo.mesFim * 100 + periodo.diaFim;

  return numeroHoje >= numeroInicio && numeroHoje <= numeroFim;
}

function produtoDisponivel(produto, idUnidade) {
  return (
    produtoVendidoUnidade(produto, idUnidade) && produtoDentroPeriodo(produto)
  );
}

function textoPeriodo(periodo) {
  const inicio =
    String(periodo.diaInicio).padStart(2, "0") +
    "/" +
    String(periodo.mesInicio).padStart(2, "0");
  const fim =
    String(periodo.diaFim).padStart(2, "0") +
    "/" +
    String(periodo.mesFim).padStart(2, "0");
  return inicio + " a " + fim;
}

/* Combo */

function produtoCombo(produto) {
  return Array.isArray(produto.itensCombo);
}

function nomesItensCombo(produto) {
  if (!produtoCombo(produto)) {
    return [];
  }

  return produto.itensCombo;
}

function textoComposicaoCombo(produto) {
  return nomesItensCombo(produto).join(" + ");
}

function textoBotaoAdicionar(produto, textoPadrao) {
  if (produtoCombo(produto)) {
    return "Incluir no carrinho";
  }
  return textoPadrao;
}

function campanhasSazonais(produtos) {
  const campanhas = [];

  produtos.forEach(function (produto) {
    if (produto.periodoSazonal === null) {
      return;
    }

    let campanha = campanhas.find(function (campanhaLista) {
      return campanhaLista.periodo === produto.periodoSazonal;
    });

    if (!campanha) {
      campanha = { periodo: produto.periodoSazonal, produtos: [] };
      campanhas.push(campanha);
    }

    campanha.produtos.push(produto);
  });

  return campanhas;
}

/* Carrinho */

const chaveCarrinho = "raizes_carrinho";
const chaveOpcoesPedido = "raizes_opcoes_pedido";

const quantidadeMaximaItem = 20;

function lerCarrinho() {
  const itensSalvos = lerArmazenamento(chaveCarrinho, []);

  return itensSalvos.filter(function (item) {
    return buscarProduto(item.idProduto) !== undefined;
  });
}

function salvarCarrinho(itensCarrinho) {
  salvarArmazenamento(chaveCarrinho, itensCarrinho);
  atualizarContadorCarrinho();
}

function esvaziarCarrinho() {
  salvarCarrinho([]);
}

function atualizarContadorCarrinho() {
  const quantidade = contarItensCarrinho();

  document.querySelectorAll(".contador_carrinho").forEach(function (contador) {
    contador.textContent = quantidade;
    contador.hidden = quantidade === 0;
  });
}

function adicionarCarrinho(idProduto, quantidade, observacao) {
  const produto = buscarProduto(idProduto);
  const unidade = lerUnidadeSelecionada();

  if (!produto || !unidade || !produtoDisponivel(produto, unidade.id)) {
    return false;
  }

  const itensCarrinho = lerCarrinho();
  const observacaoLimpa = (observacao || "").trim();

  const itemExistente = itensCarrinho.find(function (item) {
    return item.idProduto === idProduto && item.observacao === observacaoLimpa;
  });

  if (itemExistente) {
    itemExistente.quantidade = Math.min(
      itemExistente.quantidade + quantidade,
      quantidadeMaximaItem,
    );
  } else {
    itensCarrinho.push({
      idProduto: idProduto,
      quantidade: Math.min(quantidade, quantidadeMaximaItem),
      observacao: observacaoLimpa,
    });
  }

  salvarCarrinho(itensCarrinho);
  return true;
}

function alterarQuantidade(indiceItem, novaQuantidade) {
  const itensCarrinho = lerCarrinho();

  if (novaQuantidade < 1 || novaQuantidade > quantidadeMaximaItem) {
    return false;
  }

  itensCarrinho[indiceItem].quantidade = novaQuantidade;
  salvarCarrinho(itensCarrinho);
  return true;
}

function removerCarrinho(indiceItem) {
  const itensCarrinho = lerCarrinho();

  itensCarrinho.splice(indiceItem, 1);
  salvarCarrinho(itensCarrinho);
}

function removerItensIndisponiveis(idUnidade) {
  const itensCarrinho = lerCarrinho();
  const nomesRemovidos = [];

  const itensMantidos = itensCarrinho.filter(function (item) {
    const produto = buscarProduto(item.idProduto);
    const continuaDisponivel = produto && produtoDisponivel(produto, idUnidade);

    if (!continuaDisponivel && produto) {
      nomesRemovidos.push(produto.nome);
    }
    return continuaDisponivel;
  });

  salvarCarrinho(itensMantidos);
  return nomesRemovidos;
}

function contarItensCarrinho() {
  let totalItens = 0;

  lerCarrinho().forEach(function (item) {
    totalItens = totalItens + item.quantidade;
  });

  return totalItens;
}

function calcularPrecoItem(item) {
  const produto = buscarProduto(item.idProduto);
  return produto.preco * item.quantidade;
}

function calcularSubtotal(itensCarrinho) {
  let subtotal = 0;

  itensCarrinho.forEach(function (item) {
    subtotal = subtotal + calcularPrecoItem(item);
  });

  return subtotal;
}
function calcularTotais(itensCarrinho) {
  const subtotal = calcularSubtotal(itensCarrinho);
  const opcoesPedido = lerOpcoesPedido();
  let desconto = 0;

  if (opcoesPedido.usarDesconto && podeUsarDescontoFidelidade()) {
    desconto = Math.min(regrasFidelidade.valorDesconto, subtotal);
  }

  return {
    subtotal: subtotal,
    desconto: desconto,
    total: subtotal - desconto,
  };
}

function lerOpcoesPedido() {
  return lerArmazenamento(chaveOpcoesPedido, {
    formaRecebimento: "retirada",
    usarDesconto: false,
  });
}

function salvarOpcoesPedido(opcoesPedido) {
  salvarArmazenamento(chaveOpcoesPedido, opcoesPedido);
}

function alterarOpcaoPedido(nomeOpcao, valor) {
  const opcoesPedido = lerOpcoesPedido();
  opcoesPedido[nomeOpcao] = valor;
  salvarOpcoesPedido(opcoesPedido);
}

function textoFormaRecebimento(formaRecebimento) {
  if (formaRecebimento === "consumo") {
    return "Consumir na loja";
  }
  return "Para levar";
}

/*Pedido */

const chavePedidoAtual = "raizes_pedido_atual";
const chaveNumeroPedido = "raizes_numero_pedido";

const etapasPedido = ["Recebido", "Em preparo", "Pronto"];
const ultimaEtapa = etapasPedido.length - 1;

function lerPedidoAtual() {
  return lerArmazenamento(chavePedidoAtual, null);
}

function salvarPedidoAtual(pedido) {
  salvarArmazenamento(chavePedidoAtual, pedido);
}

function limparPedidoAtual() {
  localStorage.removeItem(chavePedidoAtual);
}

function gerarNumeroPedido() {
  const novoNumero = lerArmazenamento(chaveNumeroPedido, 0) + 1;
  salvarArmazenamento(chaveNumeroPedido, novoNumero);
  return novoNumero;
}

function criarPedido(dadosPedido) {
  const itensPedido = dadosPedido.itensCarrinho.map(function (item) {
    const produto = buscarProduto(item.idProduto);
    return {
      nomeProduto: produto.nome,
      composicao: textoComposicaoCombo(produto),
      precoUnitario: produto.preco,
      quantidade: item.quantidade,
      observacao: item.observacao,
    };
  });

  const novoPedido = {
    numero: gerarNumeroPedido(),
    idUnidade: dadosPedido.idUnidade,
    nomeCliente: dadosPedido.nomeCliente,
    formaRecebimento: dadosPedido.formaRecebimento,
    formaPagamento: dadosPedido.formaPagamento,
    situacaoPagamento: "aprovado",
    itens: itensPedido,
    subtotal: dadosPedido.totais.subtotal,
    desconto: dadosPedido.totais.desconto,
    total: dadosPedido.totais.total,
    pontosGanhos: dadosPedido.pontosGanhos,
    etapaAtual: 0,
    historicoEtapas: [
      { etapa: etapasPedido[0], horario: new Date().toISOString() },
    ],
  };

  salvarPedidoAtual(novoPedido);
  return novoPedido;
}

function avancarEtapaPedido() {
  const pedido = lerPedidoAtual();

  if (
    !pedido ||
    pedido.situacaoPagamento !== "aprovado" ||
    pedido.etapaAtual >= ultimaEtapa
  ) {
    return false;
  }

  pedido.etapaAtual = pedido.etapaAtual + 1;
  pedido.historicoEtapas.push({
    etapa: etapasPedido[pedido.etapaAtual],
    horario: new Date().toISOString(),
  });

  salvarPedidoAtual(pedido);
  return true;
}

function formatarNumeroPedido(numeroPedido) {
  return "#" + String(numeroPedido).padStart(4, "0");
}

function textoFormaPagamento(formaPagamento) {
  const textos = {
    pix: "Pix",
    credito: "Cartão de crédito",
    debito: "Cartão de débito",
  };
  return textos[formaPagamento] || formaPagamento;
}

/* Fidelidade e consentimentos */

const regrasFidelidade = {
  pontosPorReal: 1,
  pontosDesconto: 100,
  valorDesconto: 5,
};

const chaveConsentimentos = "raizes_consentimentos";
const chaveHistoricoPontos = "raizes_historico_pontos";
const chaveClienteFidelidade = "raizes_cliente_fidelidade";

function lerConsentimentos() {
  return lerArmazenamento(chaveConsentimentos, {
    participarFidelidade: false,
    receberOfertas: false,
    dataRegistro: null,
  });
}

function salvarConsentimentos(participarFidelidade, receberOfertas) {
  salvarArmazenamento(chaveConsentimentos, {
    participarFidelidade: participarFidelidade,
    receberOfertas: receberOfertas,
    dataRegistro: new Date().toISOString(),
  });
}

function participaFidelidade() {
  return lerConsentimentos().participarFidelidade === true;
}

/* Pontos */

function lerHistoricoPontos() {
  return lerArmazenamento(chaveHistoricoPontos, []);
}

function registrarMovimentoPontos(descricao, pontos) {
  const historicoPontos = lerHistoricoPontos();

  historicoPontos.push({
    descricao: descricao,
    pontos: pontos,
    data: new Date().toISOString(),
  });

  salvarArmazenamento(chaveHistoricoPontos, historicoPontos);
}

function calcularSaldoPontos() {
  let saldo = 0;

  lerHistoricoPontos().forEach(function (movimento) {
    saldo = saldo + movimento.pontos;
  });

  return saldo;
}

function calcularPontosGanhos(valorPago) {
  if (!participaFidelidade()) {
    return 0;
  }
  return Math.floor(valorPago * regrasFidelidade.pontosPorReal);
}

function podeUsarDescontoFidelidade() {
  return (
    participaFidelidade() &&
    calcularSaldoPontos() >= regrasFidelidade.pontosDesconto
  );
}

/* Login */

function entrarFidelidade(nomeCompleto) {
  sessionStorage.setItem(chaveClienteFidelidade, nomeCompleto);
}

function lerClienteFidelidade() {
  return sessionStorage.getItem(chaveClienteFidelidade);
}

function excluirDadosFidelidade() {
  localStorage.removeItem(chaveConsentimentos);
  localStorage.removeItem(chaveHistoricoPontos);
  sessionStorage.removeItem(chaveClienteFidelidade);
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarContadorCarrinho();
  exibirAvisoPendente();
});
