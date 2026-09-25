// src/services/syncService.ts
// Serviço de sincronização: processa a fila de operações pendentes e envia ao backend

import { Alert } from "react-native";
import { api } from "./api";
import {
  pendingQueue,
  localFarms,
  localCultivares,
  localPlantios,
  localTalhoes,
  localOperacoes,
  localAplicacoes,
  syncMeta,
} from "./offlineStorage";
import {
  fetchFarms,
  fetchCultivares,
  fetchPlantiosByFazendaFiltro,
  fetchTalhoesByFazenda,
  fetchOperacoesByPlantio,
  fetchAplicacoesByOperacao,
} from "./api";

let isSyncing = false;

// ─── SINCRONIZAÇÃO DA FILA PENDENTE ──────────────────────────────────────────

export async function syncPendingOperations(): Promise<{
  synced: number;
  failed: number;
}> {
  if (isSyncing) return { synced: 0, failed: 0 };
  isSyncing = true;

  const ops = await pendingQueue.getAll();
  let synced = 0;
  let failed = 0;

  for (const op of ops) {
    try {
      if (op.method === "POST") {
        await api.post(op.endpoint, op.body);
      } else if (op.method === "PUT") {
        await api.put(op.endpoint, op.body);
      } else if (op.method === "PATCH") {
        await api.patch(op.endpoint, op.body);
      } else if (op.method === "DELETE") {
        await api.delete(op.endpoint);
      }
      await pendingQueue.remove(op.id);
      synced++;
    } catch (err) {
      console.warn(`[Sync] Falha ao processar operação ${op.id}:`, err);
      failed++;
    }
  }

  isSyncing = false;
  return { synced, failed };
}

// ─── SINCRONIZAÇÃO DOS DADOS DO SERVIDOR → LOCAL ──────────────────────────────
// Baixa os dados atuais do backend e atualiza o cache local

export async function syncDownloadFazendas(): Promise<void> {
  try {
    const result = await fetchFarms();
    await localFarms.save(result.data);
  } catch {
    // silencioso em modo offline
  }
}

export async function syncDownloadCultivares(): Promise<void> {
  try {
    const result = await fetchCultivares();
    await localCultivares.save(result.data);
  } catch {
    // silencioso em modo offline
  }
}

export async function syncDownloadPlantiosByFazenda(
  fazendaId: number
): Promise<void> {
  try {
    const result = await fetchPlantiosByFazendaFiltro(fazendaId);
    await localPlantios.upsertMany(result.data);
  } catch {
    // silencioso em modo offline
  }
}

export async function syncDownloadTalhoesByFazenda(
  fazendaId: number
): Promise<void> {
  try {
    const result = await fetchTalhoesByFazenda(fazendaId);
    await localTalhoes.upsertMany(result.data);
  } catch {
    // silencioso em modo offline
  }
}

export async function syncDownloadOperacoesByPlantio(
  plantioId: number
): Promise<void> {
  try {
    const operacoes = await fetchOperacoesByPlantio(plantioId);
    await localOperacoes.upsertMany(operacoes);
    // Baixa aplicações de cada operação
    for (const op of operacoes) {
      try {
        const aplicacoes = await fetchAplicacoesByOperacao(op.id);
        await localAplicacoes.upsertMany(aplicacoes);
      } catch {
        // silencioso
      }
    }
  } catch {
    // silencioso em modo offline
  }
}

// ─── SINCRONIZAÇÃO COMPLETA ───────────────────────────────────────────────────
// Chame esta função quando o app detectar que está de volta online

export async function runFullSync(
  fazendaIds?: number[],
  plantioIds?: number[]
): Promise<void> {
  // 1. Envia operações pendentes
  const { synced, failed } = await syncPendingOperations();

  // 2. Baixa dados atualizados
  await syncDownloadFazendas();
  await syncDownloadCultivares();

  if (fazendaIds) {
    for (const id of fazendaIds) {
      await syncDownloadTalhoesByFazenda(id);
      await syncDownloadPlantiosByFazenda(id);
    }
  }

  if (plantioIds) {
    for (const id of plantioIds) {
      await syncDownloadOperacoesByPlantio(id);
    }
  }

  await syncMeta.setLastSync();

  if (synced > 0 || failed > 0) {
    const msg =
      failed > 0
        ? `${synced} operação(ões) sincronizada(s). ${failed} falhou(aram).`
        : `${synced} operação(ões) sincronizada(s) com sucesso!`;
    Alert.alert("Sincronização", msg);
  }
}
