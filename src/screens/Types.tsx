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
  id: string;
  dataPlantio: string;
  areaPlantada: number;
  statusPlantio: string;
  cultivar: {
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
  PlantioScreen: undefined;
  AddPlantioScreen: { farmId: string };
  AnaliseSoloScreen: { farmId: string; dadosPlantio: any };
};
