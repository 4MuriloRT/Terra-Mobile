// src/screens/Types.tsx
// Tipos TypeScript espelhando os modelos do back-end (Prisma schema)

// ─── FAZENDA ─────────────────────────────────────────────────────────────────
export type Farm = {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  areaTotal: number;
  cnpj: string;
  soloPredominante: string;
  cultivoPredominante: string;
  municipio: string;
  uf: string;
  ativo: boolean;
};

// ─── TALHÃO ──────────────────────────────────────────────────────────────────
export type Talhao = {
  id: number;
  idFazenda: number;
  nome: string;
  areaHa: number;
  geometria?: Record<string, unknown>; // GeoJSON
  observacao?: string;
  ativo: boolean;
};

// ─── ZONA DE MANEJO ──────────────────────────────────────────────────────────
export type ZonaManejo = {
  id: number;
  idFazenda: number;
  idTalhao?: number;
  nome: string;
  descricao?: string;
  tipo?: string;
  geometria: Record<string, unknown>; // GeoJSON
  cor?: string;
  ativo: boolean;
};

// ─── CULTIVAR ────────────────────────────────────────────────────────────────
export interface Cultivar {
  id: string;
  nomeCientifico: string;
  nomePopular: string;
  tipoPlanta: string;
  tipoSolo: string;
  observacao: string;
  phSolo: number;
  dataPlantioInicio: string;
  dataPlantioFim: string;
  periodoDias: number;
  mmAgua?: number;
  aduboNitrogenio: number;
  aduboFosforo: number;
  aduboPotassio: number;
  aduboCalcio: number;
  aduboMagnesio: number;
  tempoCicloDias: number;
  densidadePlantio?: number;
  densidadeColheita?: number;
}

// ─── PLANTIO ─────────────────────────────────────────────────────────────────
export type Plantio = {
  id: number;
  idCultivar: number;
  idFazenda: number;
  idTalhao?: number;
  idAnaliseSolo?: number;
  dataPlantio: string;
  dataEmergencia?: string;
  dataPrevistaColheita?: string;
  dataMaturacao?: string;
  areaPlantada: number;
  densidadePlanejada: number;
  densidadePlantioReal: number;
  phSoloInicial?: number;
  umidadeSoloInicial?: number;
  espacamentoEntreLinhas?: number;
  loteSemente?: string;
  taxaGerminacao?: number;
  tratamentoSemente?: string;
  profundidadeSemeadura?: number;
  orientacaoTransplantio?: string;
  mmAguaAplicado: number;
  irrigacaoVolume?: number;
  irrigacaoDuracao?: number;
  aduboNitrogenioDose?: number;
  aduboNitrogenioUnidade?: string;
  aduboPotassioDose?: number;
  aduboPotassioUnidade?: string;
  aduboFosforoDose?: number;
  aduboFosforoUnidade?: string;
  defensivoUtilizado?: string;
  doseDefensivo?: number;
  unidadeDefensivo?: string;
  rendimentoEstimado?: number;
  custoSemente?: number;
  custoFertilizante?: number;
  custoDefensivo?: number;
  custoCombustivel?: number;
  custoOutros?: number;
  custoTotal?: number;
  statusPlantio: StatusPlantio;
  observacao?: string;
  cultivar?: {
    id: number;
    nomePopular: string;
    tipoPlanta?: string;
  };
  talhao?: {
    id: number;
    nome: string;
  };
};

export type StatusPlantio =
  | "PLANEJADO"
  | "EXECUTADO"
  | "EM_MONITORAMENTO"
  | "CONCLUIDO";

// ─── OPERAÇÃO DE PLANTIO ─────────────────────────────────────────────────────
export type TipoEtapaOperacao =
  | "PREPARO_SOLO"
  | "SEMEADURA"
  | "APLICACAO_DEFENSIVO"
  | "APLICACAO_FERTILIZANTE"
  | "IRRIGACAO"
  | "COLHEITA"
  | "OUTROS";

export type OperacaoPlantio = {
  id: number;
  idPlantio: number;
  idTalhao?: number;
  tipoEtapa: TipoEtapaOperacao;
  dataInicio: string;
  dataFim?: string;
  areaHa: number;
  custoTotal?: number;
  custoPorHa?: number;
  observacao?: string;
  ativo: boolean;
  talhao?: {
    id: number;
    nome: string;
  };
};

// ─── APLICAÇÃO ───────────────────────────────────────────────────────────────
export type TipoAplicacao = "DEFENSIVO" | "FERTILIZANTE";
export type UnidadeDose = "KG_HA" | "G_HA" | "ML_HA" | "L_HA" | "TON_HA";

export type Aplicacao = {
  id: number;
  idOperacaoPlantio: number;
  idProdutosEstoque?: number;
  tipo: TipoAplicacao;
  nomeProduto?: string;
  dosePorHa: number;
  unidadeDose: UnidadeDose;
  quantidadeTotal?: number;
  custoAplicacao?: number;
  dataAplicacao: string;
  observacao?: string;
  ativo: boolean;
  produtoEstoque?: ProdutoEstoque;
};

// ─── PRODUTO DE ESTOQUE ───────────────────────────────────────────────────────
export type CategoriaEstoque =
  | "DEFENSIVOS"
  | "FERTILIZANTES"
  | "SEMENTES"
  | "CONDICIONADORES"
  | "FERRAMENTAS"
  | "EQUIPAMENTOS"
  | "EMBALAGENS";

export type StatusEstoque =
  | "DISPONIVEL"
  | "EM_USO"
  | "ESGOTADO"
  | "DANIFICADO"
  | "EXPIRADO";

export type ProdutoEstoque = {
  id: number;
  descricao?: string;
  marca?: string;
  nome?: string;
  quantidade: number;
  valorUnitario: number;
  unidadeMedida: string;
  dataValidade?: string;
  categoria: CategoriaEstoque;
  status: StatusEstoque;
  idFazenda: number;
  idFornecedor: number;
  ativo: boolean;
  fornecedor?: Fornecedor;
};

// ─── FORNECEDOR ───────────────────────────────────────────────────────────────
export type Fornecedor = {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  responsavel?: string;
  email?: string;
  telefone?: string;
  linkSite?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacao?: string;
  ativo: boolean;
};

// ─── ANÁLISE DE SOLO ─────────────────────────────────────────────────────────
export type AnaliseSolo = {
  id: number;
  idUsuario: number;
  idZonaManejo?: number;
  nomeSolo?: string;
  ph?: number;
  areaTotal?: number;
  hAi?: number;
  sb?: number;
  ctc?: number;
  v?: number;
  m?: number;
  mo?: number;
  prnt?: number;
  valorCultural?: number;
  n?: number;
  p?: number;
  k?: number;
  ativo: boolean;
};

// ─── NAVEGAÇÃO ────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  DashboardScreen: undefined;
  DashboardTabs: undefined;

  // Fazendas
  FazendasScreen: undefined;
  AddFarmScreen: { farm?: Farm };

  // Talhões (novo)
  TalhoesScreen: { fazenda: Farm };
  AddTalhaoScreen: { fazendaId: number; talhao?: Talhao };

  // Cultivares
  AddCultivoScreen: { cultivar?: Cultivar };
  CultivosScreen: undefined;

  // Plantio
  PlantioScreen: undefined;
  ListPlantioScreen: { farmId: string; cultureType: string };
  SelectCultivarScreen: { farmId: string; cultureType: string };
  AddPlantioScreen: {
    farmId: string;
    cultureType: string;
    cultivarId?: string;
    plantio?: Plantio;
  };
  ResultadoAnaliseSoloScreen: { plantioId: number };

  // Operações de Plantio (novo)
  OperacoesScreen: { plantio: Plantio };
  AddOperacaoScreen: { plantioId: number; operacao?: OperacaoPlantio; areaMaxima: number };

  // Aplicações (novo)
  AplicacoesScreen: { operacao: OperacaoPlantio };
  AddAplicacaoScreen: { operacaoId: number; areaHa: number; aplicacao?: Aplicacao };

  // Estoque (novo)
  EstoqueScreen: { fazenda: Farm };
  AddProdutoEstoqueScreen: { fazendaId: number; produto?: ProdutoEstoque };

  // Fornecedores (novo)
  FornecedoresScreen: undefined;
  AddFornecedorScreen: { fornecedor?: Fornecedor };
};
