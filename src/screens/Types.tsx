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

export type Plantio = {
  id: number;
  idCultivar: number;
  idAnaliseSolo?: number;
  dataPlantio: string;
  dataEmergencia?: string;
  dataPrevistaColheita?: string;
  dataMaturacao?: string;
  areaPlantada: number;
  densidadePlanejada: number;
  densidadePlantioReal?: number;
  phSoloInicial?: number;
  umidadeSoloInicial?: number;
  espacamentoEntreLinhas?: number;
  loteSemente?: string;
  taxaGerminacao?: number;
  tratamentoSemente?: string;
  profundidadeSemeadura?: number;
  orientacaoTransplantio?: string;
  mmAguaAplicado?: number;
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
  custoSemente?: number;
  custoFertilizante?: number;
  custoDefensivo?: number;
  custoCombustivel?: number;
  custoOutros?: number;
  statusPlantio: string;
  observacao?: string;
  cultivar?: {
    // Objeto cultivar aninhado
    id: number;
    nomePopular: string;
  };
};

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

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined;
  DashboardScreen: undefined;
  FazendasScreen: undefined;
  AddFarmScreen: { farm?: Farm }; // Alterado para Farm
  AddCultivoScreen: { cultivar?: Cultivar };
  CultivosScreen: undefined;

  PlantioScreen: undefined; // Tela de seleção de cultura
  ListPlantioScreen: { farmId: string; cultureType: string };
  SelectCultivarScreen: { farmId: string; cultureType: string };
  AddPlantioScreen: {
    farmId: string;
    cultureType: string;
    cultivarId?: string; // Para novos plantios
    plantio?: Plantio;
  };
  ResultadoAnaliseSoloScreen: { plantioId: number };
  //AnaliseSoloScreen: { farmId: string; dadosPlantio: any };
};
