import AsyncStorage from "@react-native-async-storage/async-storage";

// URL base do seu servidor backend
const API_BASE_URL = "http://192.168.3.50:3000";

// --- INTERFACES ---
// Adicionando a definição da interface que estava faltando
export interface FarmData {
  id?: number;
  nome: string;
  latitude: number;
  longitude: number;
  municipio: string;
  uf: string;
  cnpj?: string;
  areaTotal?: number;
  soloPredominante?: string;
  cultivoPredominante?: string;
  ativo?: boolean;
}

// --- FUNÇÕES AUXILIARES ---

/**
 * Realiza uma requisição GET autenticada para um endpoint da API.
 */
const fetchAuthenticated = async (endpoint: string) => {
  const token = await AsyncStorage.getItem("@TerraManager:token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => response.text());
    throw new Error(
      errorBody.message ||
        `O servidor respondeu com um erro (${response.status}).`
    );
  }

  const responseText = await response.text();
  // Retorna null se a resposta for vazia, para evitar erro no JSON.parse()
  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
};

// --- FUNÇÕES DE API ---

/**
 * Busca a lista de todas as fazendas do usuário.
 */
export const fetchFarms = async (token: string) => {
  const endpoint = "/fazenda/lista"; // Endpoint para listar fazendas
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar as fazendas.");
  }

  return response.json();
};

/**
 * Envia os dados de uma nova fazenda para o backend via POST.
 */
export const createFarm = async (
  farmData: Omit<FarmData, "id">,
  token: string
) => {
  const endpoint = "/fazenda"; // Endpoint para criar fazenda
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(farmData),
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível cadastrar a fazenda." }));
    throw new Error(errorBody.message);
  }

  return response.json();
};

/**
 * Atualiza os dados de uma fazenda existente via PUT.
 */
export const updateFarm = async (
  id: number,
  farmData: Partial<FarmData>,
  token: string
) => {
  const endpoint = `/fazenda/${id}`; // Endpoint para atualizar uma fazenda específica
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(farmData),
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível atualizar a fazenda." }));
    throw new Error(errorBody.message);
  }

  return response.json();
};

/**
 * Deleta uma fazenda do banco de dados via DELETE.
 */
export const deleteFarm = async (id: number, token: string) => {
  const endpoint = `/fazenda/${id}`; // Endpoint para deletar uma fazenda específica
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível deletar a fazenda." }));
    throw new Error(errorBody.message);
  }

  // Métodos DELETE bem-sucedidos geralmente retornam status 204 (No Content)
  return { message: "Fazenda deletada com sucesso." };
};

/**
 * Envia os dados de um novo cultivar para o backend.
 */
export const createCultivar = async (cultivarData: any, token: string) => {
  const endpoint = "/cultivar";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cultivarData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message || "Não foi possível cadastrar o cultivar."
    );
  }

  return response.json();
};

/**
 * Busca a lista de cultivares cadastrados.
 */
export const fetchCultivares = async (token: string) => {
  const endpoint = "/cultivar";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os cultivares.");
  }

  return response.json();
};

/**
 * Envia os dados completos de um novo plantio para o backend.
 */
export const createPlantio = async (plantioData: any, token: string) => {
  const endpoint = "/plantio";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(plantioData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message || "Não foi possível cadastrar o plantio."
    );
  }

  return response.json();
};

/**
 * Envia os dados de uma nova Análise de Solo para o backend.
 */
export const createAnaliseSolo = async (analiseData: any, token: string) => {
  const endpoint = "/analise-solo";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(analiseData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message || "Não foi possível salvar a Análise de Solo."
    );
  }

  return response.json();
};

/**
 * Busca os plantios de uma fazenda específica.
 */
export const fetchPlantiosByFazenda = async (
  fazendaId: string,
  token: string
) => {
  const endpoint = `/plantio/fazenda/${fazendaId}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os plantios para esta fazenda.");
  }

  return response.json();
};

// --- FUNÇÕES PARA O DASHBOARD ---

export const fetchClima = () => {
  const endpoint = `/dashboard/clima?city=ARINOS&state=MG&country=BR`;
  return fetchAuthenticated(endpoint);
};

export const fetchCotacao = (symbol: string) => {
  const endpoint = `/dashboard/cotacao-bolsa?symbol=${symbol}`;
  return fetchAuthenticated(endpoint);
};

export const fetchNoticia = (query: string, size: number = 5) => {
  const endpoint = `/dashboard/noticias?query=${query}&size=${size}`;
  return fetchAuthenticated(endpoint);
};
