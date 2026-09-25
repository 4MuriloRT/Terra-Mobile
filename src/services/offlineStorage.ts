// src/services/offlineStorage.ts
// Camada de abstração sobre AsyncStorage para persistência local (modo offline)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Farm, Cultivar, Plantio, Talhao, OperacaoPlantio, Aplicacao } from "../screens/Types";

// ─── CHAVES DE ARMAZENAMENTO ─────────────────────────────────────────────────
const KEYS = {
  FAZENDAS: "@TerraOffline:fazendas",
  CULTIVARES: "@TerraOffline:cultivares",
  PLANTIOS: "@TerraOffline:plantios",
  TALHOES: "@TerraOffline:talhoes",
  OPERACOES: "@TerraOffline:operacoes",
  APLICACOES: "@TerraOffline:aplicacoes",
  PENDING_OPS: "@TerraOffline:pending_ops",
  LAST_SYNC: "@TerraOffline:last_sync",
};

// ─── TIPOS INTERNOS ──────────────────────────────────────────────────────────

export type PendingOperation = {
  id: string;           // UUID local para controle
  endpoint: string;     // ex: "/fazenda"
  method: "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, any>;
  entityType: string;   // "fazenda" | "plantio" | "talhao" etc.
  localId?: string;     // ID local temporário (para operações POST)
  createdAt: string;    // ISO timestamp
};

// ─── HELPERS GENÉRICOS ───────────────────────────────────────────────────────

async function getAll<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveAll<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

// ─── FAZENDAS ─────────────────────────────────────────────────────────────────

export const localFarms = {
  getAll: () => getAll<Farm>(KEYS.FAZENDAS),
  save: (farms: Farm[]) => saveAll(KEYS.FAZENDAS, farms),
  upsert: async (farm: Farm) => {
    const farms = await getAll<Farm>(KEYS.FAZENDAS);
    const idx = farms.findIndex((f) => f.id === farm.id);
    if (idx >= 0) farms[idx] = farm;
    else farms.push(farm);
    await saveAll(KEYS.FAZENDAS, farms);
  },
  remove: async (id: string) => {
    const farms = await getAll<Farm>(KEYS.FAZENDAS);
    await saveAll(KEYS.FAZENDAS, farms.filter((f) => f.id !== id));
  },
};

// ─── CULTIVARES ────────────────────────────────────────────────────────────────

export const localCultivares = {
  getAll: () => getAll<Cultivar>(KEYS.CULTIVARES),
  save: (cultivares: Cultivar[]) => saveAll(KEYS.CULTIVARES, cultivares),
  upsert: async (cultivar: Cultivar) => {
    const items = await getAll<Cultivar>(KEYS.CULTIVARES);
    const idx = items.findIndex((c) => c.id === cultivar.id);
    if (idx >= 0) items[idx] = cultivar;
    else items.push(cultivar);
    await saveAll(KEYS.CULTIVARES, items);
  },
  remove: async (id: string) => {
    const items = await getAll<Cultivar>(KEYS.CULTIVARES);
    await saveAll(KEYS.CULTIVARES, items.filter((c) => c.id !== id));
  },
};

// ─── PLANTIOS ─────────────────────────────────────────────────────────────────

export const localPlantios = {
  getAll: () => getAll<Plantio>(KEYS.PLANTIOS),
  getByFazenda: async (idFazenda: number): Promise<Plantio[]> => {
    const items = await getAll<Plantio>(KEYS.PLANTIOS);
    return items.filter((p) => p.idFazenda === idFazenda);
  },
  save: (plantios: Plantio[]) => saveAll(KEYS.PLANTIOS, plantios),
  upsert: async (plantio: Plantio) => {
    const items = await getAll<Plantio>(KEYS.PLANTIOS);
    const idx = items.findIndex((p) => p.id === plantio.id);
    if (idx >= 0) items[idx] = plantio;
    else items.push(plantio);
    await saveAll(KEYS.PLANTIOS, items);
  },
  upsertMany: async (plantios: Plantio[]) => {
    const existing = await getAll<Plantio>(KEYS.PLANTIOS);
    const map = new Map(existing.map((p) => [p.id, p]));
    plantios.forEach((p) => map.set(p.id, p));
    await saveAll(KEYS.PLANTIOS, Array.from(map.values()));
  },
  remove: async (id: number) => {
    const items = await getAll<Plantio>(KEYS.PLANTIOS);
    await saveAll(KEYS.PLANTIOS, items.filter((p) => p.id !== id));
  },
};

// ─── TALHÕES ──────────────────────────────────────────────────────────────────

export const localTalhoes = {
  getAll: () => getAll<Talhao>(KEYS.TALHOES),
  getByFazenda: async (idFazenda: number): Promise<Talhao[]> => {
    const items = await getAll<Talhao>(KEYS.TALHOES);
    return items.filter((t) => t.idFazenda === idFazenda);
  },
  save: (talhoes: Talhao[]) => saveAll(KEYS.TALHOES, talhoes),
  upsert: async (talhao: Talhao) => {
    const items = await getAll<Talhao>(KEYS.TALHOES);
    const idx = items.findIndex((t) => t.id === talhao.id);
    if (idx >= 0) items[idx] = talhao;
    else items.push(talhao);
    await saveAll(KEYS.TALHOES, items);
  },
  upsertMany: async (talhoes: Talhao[]) => {
    const existing = await getAll<Talhao>(KEYS.TALHOES);
    const map = new Map(existing.map((t) => [t.id, t]));
    talhoes.forEach((t) => map.set(t.id, t));
    await saveAll(KEYS.TALHOES, Array.from(map.values()));
  },
  remove: async (id: number) => {
    const items = await getAll<Talhao>(KEYS.TALHOES);
    await saveAll(KEYS.TALHOES, items.filter((t) => t.id !== id));
  },
};

// ─── OPERAÇÕES DE PLANTIO ─────────────────────────────────────────────────────

export const localOperacoes = {
  getAll: () => getAll<OperacaoPlantio>(KEYS.OPERACOES),
  getByPlantio: async (idPlantio: number): Promise<OperacaoPlantio[]> => {
    const items = await getAll<OperacaoPlantio>(KEYS.OPERACOES);
    return items.filter((o) => o.idPlantio === idPlantio);
  },
  save: (operacoes: OperacaoPlantio[]) => saveAll(KEYS.OPERACOES, operacoes),
  upsert: async (operacao: OperacaoPlantio) => {
    const items = await getAll<OperacaoPlantio>(KEYS.OPERACOES);
    const idx = items.findIndex((o) => o.id === operacao.id);
    if (idx >= 0) items[idx] = operacao;
    else items.push(operacao);
    await saveAll(KEYS.OPERACOES, items);
  },
  upsertMany: async (operacoes: OperacaoPlantio[]) => {
    const existing = await getAll<OperacaoPlantio>(KEYS.OPERACOES);
    const map = new Map(existing.map((o) => [o.id, o]));
    operacoes.forEach((o) => map.set(o.id, o));
    await saveAll(KEYS.OPERACOES, Array.from(map.values()));
  },
  remove: async (id: number) => {
    const items = await getAll<OperacaoPlantio>(KEYS.OPERACOES);
    await saveAll(KEYS.OPERACOES, items.filter((o) => o.id !== id));
  },
};

// ─── APLICAÇÕES ──────────────────────────────────────────────────────────────

export const localAplicacoes = {
  getAll: () => getAll<Aplicacao>(KEYS.APLICACOES),
  getByOperacao: async (idOperacao: number): Promise<Aplicacao[]> => {
    const items = await getAll<Aplicacao>(KEYS.APLICACOES);
    return items.filter((a) => a.idOperacaoPlantio === idOperacao);
  },
  upsert: async (aplicacao: Aplicacao) => {
    const items = await getAll<Aplicacao>(KEYS.APLICACOES);
    const idx = items.findIndex((a) => a.id === aplicacao.id);
    if (idx >= 0) items[idx] = aplicacao;
    else items.push(aplicacao);
    await saveAll(KEYS.APLICACOES, items);
  },
  upsertMany: async (aplicacoes: Aplicacao[]) => {
    const existing = await getAll<Aplicacao>(KEYS.APLICACOES);
    const map = new Map(existing.map((a) => [a.id, a]));
    aplicacoes.forEach((a) => map.set(a.id, a));
    await saveAll(KEYS.APLICACOES, Array.from(map.values()));
  },
  remove: async (id: number) => {
    const items = await getAll<Aplicacao>(KEYS.APLICACOES);
    await saveAll(KEYS.APLICACOES, items.filter((a) => a.id !== id));
  },
};

// ─── FILA DE OPERAÇÕES PENDENTES ─────────────────────────────────────────────

export const pendingQueue = {
  getAll: () => getAll<PendingOperation>(KEYS.PENDING_OPS),

  add: async (op: Omit<PendingOperation, "id" | "createdAt">) => {
    const ops = await getAll<PendingOperation>(KEYS.PENDING_OPS);
    const newOp: PendingOperation = {
      ...op,
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    ops.push(newOp);
    await saveAll(KEYS.PENDING_OPS, ops);
    return newOp;
  },

  remove: async (id: string) => {
    const ops = await getAll<PendingOperation>(KEYS.PENDING_OPS);
    await saveAll(KEYS.PENDING_OPS, ops.filter((op) => op.id !== id));
  },

  clear: () => AsyncStorage.removeItem(KEYS.PENDING_OPS),

  count: async () => {
    const ops = await getAll<PendingOperation>(KEYS.PENDING_OPS);
    return ops.length;
  },
};

// ─── CONTROLE DE SINCRONIZAÇÃO ───────────────────────────────────────────────

export const syncMeta = {
  getLastSync: async (): Promise<Date | null> => {
    const raw = await AsyncStorage.getItem(KEYS.LAST_SYNC);
    return raw ? new Date(raw) : null;
  },
  setLastSync: () =>
    AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString()),
};

// ─── LIMPAR TUDO (logout) ─────────────────────────────────────────────────────
export const clearAllOfflineData = async () => {
  await Promise.all(Object.values(KEYS).map((k) => AsyncStorage.removeItem(k)));
};
