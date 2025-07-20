import AsyncStorage from "@react-native-async-storage/async-storage";

// Lembre-se de manter o IP correto do seu backend aqui
const API_BASE_URL = "http://192.168.3.50:3000";

// Função genérica para fazer requisições autenticadas
const fetchAuthenticated = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = await AsyncStorage.getItem("@TerraManager:token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options, // Permite passar method, body, etc.
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Para DELETE, uma resposta 204 (No Content) também é sucesso
  if (!response.ok && response.status !== 204) {
    // Tenta extrair uma mensagem de erro do corpo da resposta
    const errorData = await response
      .json()
      .catch(() => ({ message: `Falha na requisição para: ${endpoint}` }));
    throw new Error(errorData.message);
  }

  // Retorna a resposta JSON apenas se houver conteúdo
  if (response.status !== 204) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    }
  }

  // Retorna nulo para respostas sem conteúdo, como DELETE
  return null;
};

// Funções para o Dashboard
export const fetchClima = () => {
  const cidade = "ARINOS";
  const estado = "MG";
  const pais = "BR";
  const endpoint = `/dashboard/clima?city=${cidade}&state=${estado}&country=${pais}`;
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

// Função para buscar os cultivares
export const fetchCultivares = () => {
  return fetchAuthenticated("/cultivar");
};

// **NOVA FUNÇÃO para excluir um cultivar**
// Ela fará uma chamada DELETE para a rota /cultivar/:id no seu backend
export const deleteCultivar = (id: number) => {
  return fetchAuthenticated(`/cultivar/${id}`, { method: "DELETE" });
};

// **NOVA FUNÇÃO para ATUALIZAR um cultivar**
// Ela fará uma chamada PUT para a rota /cultivar/:id no seu backend
export const updateCultivar = (id: number, data: any) => {
  return fetchAuthenticated(`/cultivar/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
