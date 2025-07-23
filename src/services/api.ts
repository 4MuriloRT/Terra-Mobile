import AsyncStorage from "@react-native-async-storage/async-storage";
import { Farm, Cultivar } from "../screens/Types"; // Caminho corrigido

// URL base do seu servidor backend
const API_BASE_URL = "http://192.168.3.40:3000"; // Use seu IP aqui

// --- FUNÇÕES AUXILIARES ---

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
  return responseText ? JSON.parse(responseText) : null;
};

// --- FUNÇÕES DE FAZENDA ---

export const fetchFarms = async (token: string) => {
  const endpoint = "/fazenda/lista";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Não foi possível carregar as fazendas.");
  return response.json();
};

export const createFarm = async (farmData: Omit<Farm, "id">, token: string) => {
  const endpoint = "/fazenda";
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

export const updateFarm = async (
  id: string,
  farmData: Partial<Farm>,
  token: string
) => {
  const endpoint = `/fazenda/${id}`;
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

export const deleteFarm = async (id: string, token: string) => {
  const endpoint = `/fazenda/${id}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível deletar a fazenda." }));
    throw new Error(errorBody.message);
  }
  return { message: "Fazenda deletada com sucesso." };
};

// --- FUNÇÕES DE CULTIVAR ---

export const fetchCultivares = async (token: string) => {
  const endpoint = "/cultivar/lista";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Não foi possível carregar os cultivares.");
  return response.json();
};

export const createCultivar = async (
  cultivarData: Omit<Cultivar, "id">,
  token: string
) => {
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
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível cadastrar o cultivar." }));
    throw new Error(errorBody.message);
  }
  return response.json();
};

export const updateCultivar = async (
  id: string,
  cultivarData: Partial<Omit<Cultivar, "id">>,
  token: string
) => {
  const endpoint = `/cultivar/${id}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cultivarData),
  });
  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível atualizar o cultivar." }));
    throw new Error(errorBody.message);
  }
  return response.json();
};

export const deleteCultivar = async (id: string, token: string) => {
  const endpoint = `/cultivar/${id}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Não foi possível deletar o cultivar." }));
    throw new Error(errorBody.message);
  }
  return { message: "Cultivar deletado com sucesso." };
};

// --- FUNÇÕES DE PLANTIO E OUTRAS ---

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

export const fetchPlantiosByFazenda = async (
  fazendaId: string,
  tipoPlanta: string, // Adicionamos o tipoPlanta como parâmetro
  token: string
) => {
  // ✅ Rota corrigida para corresponder ao Swagger
  const endpoint = `/plantio/fazenda/${fazendaId}/tipo-planta/${tipoPlanta}`;
  
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

export const updatePlantio = async (
  plantioId: number,
  data: any,
  token: string
 ) => {
  const endpoint = `/plantio/${plantioId}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
   },
   body: JSON.stringify(data),
  });
 
  if (!response.ok) {
   throw new Error("Não foi possível atualizar o plantio.");
  }
  return response.json();
 };
 
 export const deletePlantio = async (
  plantioId: number,
  token: string
 ) => {
  const endpoint = `/plantio/${plantioId}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
   method: "DELETE",
   headers: {
    Authorization: `Bearer ${token}`,
   },
  });
 
  if (!response.ok) {
   throw new Error("Não foi possível deletar o plantio.");
  }
  return response.json(); // Ou talvez response.status === 204
 };

// --- FUNÇÕES PARA O DASHBOARD ---
export const fetchClima = () =>
  fetchAuthenticated(`/dashboard/clima?city=ARINOS&state=MG&country=BR`);
export const fetchCotacao = (symbol: string) =>
  fetchAuthenticated(`/dashboard/cotacao-bolsa?symbol=${symbol}`);
export const fetchNoticia = (query: string, size = 5) =>
  fetchAuthenticated(`/dashboard/noticias?query=${query}&size=${size}`);
