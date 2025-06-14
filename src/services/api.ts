import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.3.3:3000'; // Sua URL base

const fetchAuthenticated = async (endpoint: string) => {
  const token = await AsyncStorage.getItem('@TerraManager:token');

  if (!token) {
    throw new Error('Token de autenticação não encontrado.');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar dados do endpoint: ${endpoint}`);
  }

  return response.json();
};

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