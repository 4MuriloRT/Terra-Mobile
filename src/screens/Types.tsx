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

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined;
  DashboardScreen: undefined;
  FazendasScreen: undefined;
  AddFarmScreen: { farm?: Farm };
  AddCultivoScreen: undefined;
  CultivosScreen: undefined;
  PlantioScreen: undefined;
};
