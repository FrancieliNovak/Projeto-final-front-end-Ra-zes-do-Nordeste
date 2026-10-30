/* Unidades */

const listaUnidades = [
  {
    id: "recife",
    nome: "Recife — PE",
    formato: "completa",
    descricaoFormato: "Loja completa",
    imagem: "unidade_recife.png",
  },
  {
    id: "salvador",
    nome: "Salvador — BA",
    formato: "completa",
    descricaoFormato: "Loja completa",
    imagem: "unidade_salvador.png",
  },
  {
    id: "fortaleza",
    nome: "Fortaleza — CE",
    formato: "reduzida",
    descricaoFormato: "Formato reduzido · cardápio menor",
    imagem: "unidade_fortaleza.png",
  },
];

/* Categorias do cardápio */

const listaCategorias = [
  { id: "tapiocas", nome: "Tapiocas" },
  { id: "cuscuz", nome: "Cuscuz" },
  { id: "bolos", nome: "Bolos" },
  { id: "sucos", nome: "Sucos" },
  { id: "cafes", nome: "Cafés" },
  { id: "sazonal", nome: "Sazonal" },
];

/* Campanhas sazonais */

const periodoFimAno = {
  nome: "Fim de ano",
  diaInicio: 1,
  mesInicio: 10,
  diaFim: 31,
  mesFim: 12,
};
const periodoJunino = {
  nome: "São João",
  diaInicio: 1,
  mesInicio: 6,
  diaFim: 31,
  mesFim: 7,
};

/* Produtos */

const listaProdutos = [
  /* Tapiocas */
  {
    id: "tapioca_carne_sol",
    nome: "Tapioca de carne de sol",
    categoria: "tapiocas",
    descricaoCurta: "Carne de sol desfiada com manteiga de garrafa.",
    descricaoCompleta:
      "Tapioca feita na hora, recheada com carne de sol desfiada e finalizada com manteiga de garrafa.",
    preco: 18.0,
    imagem: "tapioca_carne_sol.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "tapioca_queijo_coalho",
    nome: "Tapioca de queijo coalho",
    categoria: "tapiocas",
    descricaoCurta: "Queijo coalho derretido na chapa.",
    descricaoCompleta:
      "Tapioca feita na hora, recheada com queijo coalho derretido na chapa.",
    preco: 15.0,
    imagem: "tapioca_queijo_coalho.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "tapioca_coco",
    nome: "Tapioca de coco",
    categoria: "tapiocas",
    descricaoCurta: "Coco ralado com leite condensado.",
    descricaoCompleta:
      "Tapioca doce recheada com coco ralado e leite condensado.",
    preco: 13.0,
    imagem: "tapioca_coco.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },

  /*  Cuscuz */
  {
    id: "cuscuz_ovo_queijo",
    nome: "Cuscuz com ovo e queijo coalho",
    categoria: "cuscuz",
    descricaoCurta: "Cuscuz de milho, ovo e queijo coalho.",
    descricaoCompleta:
      "Cuscuz de milho cozido no vapor, servido com ovo e queijo coalho na chapa.",
    preco: 16.0,
    imagem: "cuscuz_ovo_queijo.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "cuscuz_carne_sol",
    nome: "Cuscuz recheado com carne de sol",
    categoria: "cuscuz",
    descricaoCurta: "Cuscuz recheado com carne de sol e cebola.",
    descricaoCompleta:
      "Cuscuz de milho recheado com carne de sol acebolada. Disponível nas lojas completas.",
    preco: 22.0,
    imagem: "cuscuz_carne_sol.png",
    unidades: ["recife", "salvador"],
    periodoSazonal: null,
  },

  /*  Bolos */
  {
    id: "bolo_macaxeira",
    nome: "Bolo de macaxeira",
    categoria: "bolos",
    descricaoCurta: "Fatia de bolo de macaxeira com coco.",
    descricaoCompleta:
      "Fatia de bolo de macaxeira feito com coco, de textura cremosa.",
    preco: 9.0,
    imagem: "bolo_macaxeira.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "bolo_milho",
    nome: "Bolo de milho",
    categoria: "bolos",
    descricaoCurta: "Fatia de bolo de milho verde.",
    descricaoCompleta:
      "Fatia de bolo de milho verde, feito na própria unidade.",
    preco: 8.0,
    imagem: "bolo_milho.png",
    unidades: ["recife", "salvador"],
    periodoSazonal: null,
  },
  {
    id: "bolo_rolo",
    nome: "Bolo de rolo",
    categoria: "bolos",
    descricaoCurta: "Fatia de bolo de rolo com goiabada.",
    descricaoCompleta:
      "Fatia de bolo de rolo com camadas finas de massa e goiabada.",
    preco: 10.0,
    imagem: "bolo_rolo.png",
    unidades: ["recife"],
    periodoSazonal: null,
  },
  {
    id: "bolo_souza_leao",
    nome: "Bolo Souza Leão",
    categoria: "bolos",
    descricaoCurta: "Fatia de bolo Souza Leão.",
    descricaoCompleta:
      "Fatia de bolo Souza Leão, feito com massa de mandioca e leite de coco.",
    preco: 10.0,
    imagem: "bolo_souza_leao.png",
    unidades: ["fortaleza"],
    periodoSazonal: null,
  },

  /* Sucos  */
  {
    id: "suco_caja",
    nome: "Suco de cajá",
    categoria: "sucos",
    descricaoCurta: "Copo de 400 ml.",
    descricaoCompleta: "Suco natural de cajá, servido em copo de 400 ml.",
    preco: 9.0,
    imagem: "suco_caja.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "suco_caju",
    nome: "Suco de caju",
    categoria: "sucos",
    descricaoCurta: "Copo de 400 ml.",
    descricaoCompleta: "Suco natural de caju, servido em copo de 400 ml.",
    preco: 9.0,
    imagem: "suco_caju.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "suco_graviola",
    nome: "Suco de graviola",
    categoria: "sucos",
    descricaoCurta: "Copo de 400 ml.",
    descricaoCompleta: "Suco natural de graviola, servido em copo de 400 ml.",
    preco: 9.0,
    imagem: "suco_graviola.png",
    unidades: ["recife", "salvador"],
    periodoSazonal: null,
  },
  {
    id: "suco_maracuja",
    nome: "Suco de maracujá",
    categoria: "sucos",
    descricaoCurta: "Copo de 400 ml.",
    descricaoCompleta: "Suco natural de maracujá, servido em copo de 400 ml.",
    preco: 9.0,
    imagem: "suco_maracuja.png",
    unidades: ["recife", "salvador"],
    periodoSazonal: null,
  },

  /*Cafés */
  {
    id: "cafe_coado",
    nome: "Café passado na hora",
    categoria: "cafes",
    descricaoCurta: "Xícara de café coado.",
    descricaoCompleta: "Café coado na hora, servido em xícara.",
    preco: 5.0,
    imagem: "cafe_coado.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },
  {
    id: "cafe_leite",
    nome: "Café com leite",
    categoria: "cafes",
    descricaoCurta: "Xícara de café com leite.",
    descricaoCompleta:
      "Café coado na hora com leite quente, servido em xícara.",
    preco: 6.5,
    imagem: "cafe_leite.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: null,
  },

  /*Combo sazonal */
  {
    id: "combo_fim_ano",
    nome: "Combo de fim de ano",
    categoria: "sazonal",
    descricaoCurta: "Tapioca de carne seca + Suco de caju + Bolo de macaxeira",
    descricaoCompleta:
      "Combo da campanha de fim de ano: Tapioca de carne seca + Suco de caju + Bolo de macaxeira.",
    preco: 29.0,
    imagem: "combo_fim_ano.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: periodoFimAno,
    itensCombo: ["Tapioca de carne seca", "Suco de caju", "Bolo de macaxeira"],
  },
  {
    id: "combo_junino",
    nome: "Combo junino",
    categoria: "sazonal",
    descricaoCurta: "Tapioca de carne seca com queijo coalho + Quentão + Pamonha doce",
    descricaoCompleta:
      "Combo da campanha de São João: Tapioca de carne seca com queijo coalho + Quentão + Pamonha doce.",
    preco: 35.0,
    imagem: "combo_junino.png",
    unidades: ["recife", "salvador", "fortaleza"],
    periodoSazonal: periodoJunino,
    itensCombo: [
      "Tapioca de carne seca com queijo coalho",
      "Quentão",
      "Pamonha doce",
    ],
  },
];
