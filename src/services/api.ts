// src/services/api.ts
// Serviço centralizado de API usando axios com interceptors de autenticação automática

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api.config";
import {
  Farm,
  Cultivar,
  Talhao,
  OperacaoPlantio,
  Aplicacao,
  ProdutoEstoque,
  Fornecedor,
  StatusPlantio,
} from "../screens/Types";

// ─── INSTÂNCIA AXIOS ─────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: injeta o token automaticamente em cada requisição
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@TerraManager:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: extrai a mensagem de erro do backend de forma padronizada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erro de conexão com o servidor.";
    return Promise.reject(new Error(Array.isArray(message) ? message.join(", ") : message));
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const authLogin = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { id, name, email, role, accessToken }
};

export const authRegister = async (registerData: {
  nome: string;
  email: string;
  password: string;
  cpf?: string;
  telefone?: string;
}) => {
  const { data } = await api.post("/user", registerData);
  return data;
};

// ─── FAZENDA ─────────────────────────────────────────────────────────────────

export const fetchFarms = async (): Promise<{ data: Farm[]; count: number }> => {
  const { data } = await api.get("/fazenda/lista");
  return data;
};

export const createFarm = async (farmData: Omit<Farm, "id" | "ativo">): Promise<Farm> => {
  const { data } = await api.post("/fazenda", farmData);
  return data;
};

export const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
  const { data } = await api.put(`/fazenda/${id}`, farmData);
  return data;
};

export const deleteFarm = async (id: string): Promise<void> => {
  await api.delete(`/fazenda/${id}`);
};

// ─── TALHÃO ──────────────────────────────────────────────────────────────────

export const fetchTalhoesByFazenda = async (
  idFazenda: number
): Promise<{ data: Talhao[]; count: number }> => {
  const { data } = await api.get(`/talhao/fazenda/${idFazenda}`);
  return data;
};

export const createTalhao = async (
  talhaoData: Omit<Talhao, "id" | "ativo">
): Promise<Talhao> => {
  const { data } = await api.post("/talhao", talhaoData);
  return data;
};

export const updateTalhao = async (
  id: number,
  talhaoData: Partial<Omit<Talhao, "id">>
): Promise<Talhao> => {
  const { data } = await api.put(`/talhao/${id}`, talhaoData);
  return data;
};

export const deleteTalhao = async (id: number): Promise<void> => {
  await api.delete(`/talhao/${id}`);
};

export const fetchResumoTalhoes = async (idFazenda: number) => {
  const { data } = await api.get(`/talhao/fazenda/${idFazenda}/resumo`);
  return data; // { areaTotalHa, totalTalhoes, talhoes }
};

// ─── CULTIVAR ─────────────────────────────────────────────────────────────────

export const fetchCultivares = async (): Promise<{ data: Cultivar[]; count: number }> => {
  const { data } = await api.get("/cultivar/lista");
  return data;
};

export const createCultivar = async (
  cultivarData: Omit<Cultivar, "id">
): Promise<Cultivar> => {
  const { data } = await api.post("/cultivar", cultivarData);
  return data;
};

export const updateCultivar = async (
  id: string,
  cultivarData: Partial<Omit<Cultivar, "id">>
): Promise<Cultivar> => {
  const { data } = await api.put(`/cultivar/${id}`, cultivarData);
  return data;
};

export const deleteCultivar = async (id: string): Promise<void> => {
  await api.delete(`/cultivar/${id}`);
};

// ─── PLANTIO ─────────────────────────────────────────────────────────────────

export const createPlantio = async (plantioData: any) => {
  const { data } = await api.post("/plantio", plantioData);
  return data;
};

export const fetchPlantiosByFazenda = async (
  fazendaId: number,
  tipoPlanta: string
) => {
  const { data } = await api.get(
    `/plantio/fazenda/${fazendaId}/tipo-planta/${tipoPlanta}`
  );
  return data; // { data: Plantio[], count }
};

export const fetchPlantiosByFazendaFiltro = async (
  fazendaId: number,
  options?: Record<string, any>,
  page = 1,
  pageSize = 20
) => {
  const params: Record<string, any> = { page, pageSize };
  if (options && Object.keys(options).length > 0) {
    params.options = JSON.stringify(options);
  }
  const { data } = await api.get(`/plantio/fazenda/${fazendaId}`, { params });
  return data; // { data: Plantio[], count }
};

export const updatePlantio = async (plantioId: number, plantioData: any) => {
  const { data } = await api.put(`/plantio/${plantioId}`, plantioData);
  return data;
};

export const updateStatusPlantio = async (
  plantioId: number,
  statusPlantio: StatusPlantio
) => {
  const { data } = await api.patch(`/plantio/${plantioId}/status`, {
    statusPlantio,
  });
  return data;
};

export const deletePlantio = async (plantioId: number): Promise<void> => {
  await api.delete(`/plantio/${plantioId}`);
};

export const fetchCustoPorSafra = async (idFazenda: number, ano: number) => {
  const { data } = await api.get(`/plantio/fazenda/${idFazenda}/custo-safra`, {
    params: { ano },
  });
  return data;
};

// ─── OPERAÇÃO DE PLANTIO ─────────────────────────────────────────────────────

export const fetchOperacoesByPlantio = async (
  idPlantio: number
): Promise<OperacaoPlantio[]> => {
  const { data } = await api.get(`/operacao-plantio/plantio/${idPlantio}`);
  return data;
};

export const createOperacaoPlantio = async (
  operacaoData: any
): Promise<OperacaoPlantio> => {
  const { data } = await api.post("/operacao-plantio", operacaoData);
  return data;
};

export const updateOperacaoPlantio = async (
  id: number,
  operacaoData: any
): Promise<OperacaoPlantio> => {
  const { data } = await api.put(`/operacao-plantio/${id}`, operacaoData);
  return data;
};

export const deleteOperacaoPlantio = async (id: number): Promise<void> => {
  await api.delete(`/operacao-plantio/${id}`);
};

// ─── APLICAÇÃO ───────────────────────────────────────────────────────────────

export const fetchAplicacoesByOperacao = async (
  idOperacaoPlantio: number
): Promise<Aplicacao[]> => {
  const { data } = await api.get(
    `/aplicacao-plantio/operacao/${idOperacaoPlantio}`
  );
  return data;
};

export const createAplicacao = async (aplicacaoData: any): Promise<Aplicacao> => {
  const { data } = await api.post("/aplicacao-plantio", aplicacaoData);
  return data;
};

export const deleteAplicacao = async (id: number): Promise<void> => {
  await api.delete(`/aplicacao-plantio/${id}`);
};

// ─── PRODUTO DE ESTOQUE ───────────────────────────────────────────────────────

export const fetchEstoqueByFazenda = async (
  idFazenda: number
): Promise<{ data: ProdutoEstoque[]; count: number }> => {
  const { data } = await api.get(`/produto-estoque/fazenda/${idFazenda}`);
  return data;
};

export const createProdutoEstoque = async (
  produtoData: any
): Promise<ProdutoEstoque> => {
  const { data } = await api.post("/produto-estoque", produtoData);
  return data;
};

export const updateProdutoEstoque = async (
  id: number,
  produtoData: any
): Promise<ProdutoEstoque> => {
  const { data } = await api.put(`/produto-estoque/${id}`, produtoData);
  return data;
};

export const deleteProdutoEstoque = async (id: number): Promise<void> => {
  await api.delete(`/produto-estoque/${id}`);
};

// ─── FORNECEDOR ───────────────────────────────────────────────────────────────

export const fetchFornecedores = async (): Promise<{
  data: Fornecedor[];
  count: number;
}> => {
  const { data } = await api.get("/fornecedor/lista");
  return data;
};

export const createFornecedor = async (
  fornecedorData: any
): Promise<Fornecedor> => {
  const { data } = await api.post("/fornecedor", fornecedorData);
  return data;
};

export const updateFornecedor = async (
  id: number,
  fornecedorData: any
): Promise<Fornecedor> => {
  const { data } = await api.put(`/fornecedor/${id}`, fornecedorData);
  return data;
};

export const deleteFornecedor = async (id: number): Promise<void> => {
  await api.delete(`/fornecedor/${id}`);
};

// ─── ANÁLISE DE SOLO ─────────────────────────────────────────────────────────

export const createAnaliseSolo = async (analiseData: any) => {
  const { data } = await api.post("/analise-solo", analiseData);
  return data;
};

export const getAnaliseSoloById = async (id: number) => {
  const { data } = await api.get(`/analise-solo/${id}`);
  return data;
};

export const updateAnaliseSolo = async (id: number, analiseData: any) => {
  const { data } = await api.put(`/analise-solo/${id}`, analiseData);
  return data;
};

export const deleteAnaliseSolo = async (id: number): Promise<void> => {
  await api.delete(`/analise-solo/${id}`);
};

export const getCalculoCalagem = async (idPlantio: number) => {
  const { data } = await api.get(`/analise-solo/calagem/${idPlantio}`);
  return data;
};

export const getCalculoAdubacao = async (idPlantio: number) => {
  const { data } = await api.get(`/analise-solo/adubacao/${idPlantio}`);
  return data;
};

export const getComparativoNutrientes = async (idPlantio: number) => {
  const { data } = await api.get(
    `/analise-solo/comparativo-nutrientes/${idPlantio}`
  );
  return data;
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export const fetchClima = async (city = "ARINOS", state = "MG", country = "BR") => {
  const { data } = await api.get(
    `/dashboard/clima?city=${city}&state=${state}&country=${country}`
  );
  return data;
};

export const fetchCotacao = async (symbol: string) => {
  const { data } = await api.get(`/dashboard/cotacao-bolsa?symbol=${symbol}`);
  return data;
};

export const fetchNoticia = async (query: string, size = 5) => {
  const { data } = await api.get(
    `/dashboard/noticias?query=${query}&size=${size}`
  );
  return data;
};
