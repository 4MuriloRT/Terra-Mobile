// Define o formato de um objeto Fazenda
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

// **CORREÇÃO: A definição do tipo Cultivar foi completada**
// Agora inclui todos os campos que vêm do backend para que a tela de edição funcione.
export type Cultivar = {
  id: number;
  nomeCientifico: string;
  nomePopular: string;
  tipoPlanta: string;
  tipoSolo: string;
  phSolo: number;
  dataPlantioInicio: string;
  dataPlantioFim: string;
  periodoDias: number;
  mmAgua: number;
  aduboNitrogenio: number;
  aduboFosforo: number;
  aduboPotassio: number;
  aduboCalcio: number | null;
  aduboMagnesio: number | null;
  tempoCicloDias: number;
  densidadePlantio: number;
  densidadeColheita: number;
  observacao: string | null;
  idPraga: number | null;
  idFornecedor: number | null;
};

// Define todas as rotas e seus parâmetros
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined;
  DashboardScreen: undefined;
  FazendasScreen: undefined;
  AddFarmScreen: { farm?: Farm };
  CultivosScreen: undefined;
  // Agora a tela de adicionar pode receber um cultivar para edição
  AddCultivoScreen: { cultivar?: Cultivar };
  PlantioScreen: undefined;
};
