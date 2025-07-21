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
export type Cultivar = {
  id: string;
  nomeCientifico: string;
  nomePopular: string;
  tipoPlanta: string;
  tipoSolo: string;
  fornecedor: string;
  praga: string;
  observacao: string;
  phSolo: number;
  dataPlantioInicio: string;
  dataPlantioFim: string;
  periodoDias: number;
  agua: number; // O nome correto é 'agua'
  aduboNitrogenio: number;
  aduboFosforo: number;
  aduboPotassio: number;
  tempoCicloDias: number;
  // ✅ CAMPOS ADICIONADOS
  densidadePlantio?: number;
  densidadeColheita?: number;
  mmAgua?: number; // Adicionando para consistência com o DTO
};

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined;
  DashboardScreen: undefined;
  FazendasScreen: undefined;
  AddFarmScreen: { farm?: Farm };
  AddCultivoScreen: { cultivar?: Cultivar };
  CultivosScreen: undefined;
  PlantioScreen: undefined;
  AddPlantioScreen: { farmId: string };
  AnaliseSoloScreen: { farmId: string; dadosPlantio: any };
};
