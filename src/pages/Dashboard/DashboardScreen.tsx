import React, { useState, useEffect } from "react";
// 1. Importe o componente 'Image' do react-native
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Linking,
  Alert,
  Image,
} from "react-native";
import { DashboardHeader } from "../Header";
import { DashboardCard } from "./DashboardCard";
import { DashboardFooter } from "../Dashboard/DashboardFooter";
import DashboardCarousel from "./DashboardCarousel";
import { useDashboard } from "../../hooks/useDashboard";

// ... (Componentes ClimaContent e CotacaoContent)
const ClimaContent = ({ data }: { data: any }) => (
  <>
    <Text style={styles.dataText}>{data?.temperaturaMax}°C</Text>
    <Text style={styles.dataSubText}>{data?.condicao}</Text>
  </>
);
const CotacaoContent = ({ data }: { data: any }) => (
  <>
    <Text style={styles.dataText}>R$ {data?.precoAtual}</Text>
    <Text style={styles.dataSubText}>{data?.simbolo}</Text>
  </>
);

// 2. Criamos um componente específico para o conteúdo da notícia
const NoticiaContent = ({ data }: { data: any }) => {
  // Verifica se o campo 'img' contém um link válido
  const temImagem = data?.img && data.img.startsWith("http");

  return (
    <View style={styles.noticiaContainer}>
      {temImagem && (
        <Image source={{ uri: data.img }} style={styles.newsImage} />
      )}
      <Text style={[styles.longText, styles.newsTitle]}>{data?.titulo}</Text>
      <Text style={styles.newsDescription}>{data?.descricao}</Text>
    </View>
  );
};

export default function DashboardScreen() {
  const { clima, cotacao, noticias, isLoading, error } = useDashboard();
  const [currentNoticiaIndex, setCurrentNoticiaIndex] = useState(0);

  useEffect(() => {
    if (noticias && noticias.length > 1) {
      // 3. Aumentamos o tempo para 10 segundos (10000 milissegundos)
      const timer = setInterval(() => {
        setCurrentNoticiaIndex(
          (prevIndex) => (prevIndex + 1) % noticias.length
        );
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [noticias]);

  const noticiaAtual =
    noticias && noticias.length > 0 ? noticias[currentNoticiaIndex] : null;

  const handleNoticiaPress = async (noticiaClicada: any) => {
    if (!noticiaClicada || !noticiaClicada.url) {
      Alert.alert("Erro", "Link da notícia não disponível.");
      return;
    }
    try {
      await Linking.openURL(noticiaClicada.url);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível abrir o link da notícia.");
    }
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <DashboardCarousel />

        <View style={styles.row}>
          <DashboardCard title="CLIMA" loading={isLoading} flex={1}>
            {clima && <ClimaContent data={clima} />}
          </DashboardCard>
          <DashboardCard title="COTAÇÃO SOJA" loading={isLoading} flex={1}>
            {cotacao && <CotacaoContent data={cotacao} />}
          </DashboardCard>
        </View>

        <DashboardCard
          title="ÚLTIMAS NOTÍCIAS"
          loading={isLoading}
          onPress={() => handleNoticiaPress(noticiaAtual)}
        >
          {/* Usamos nosso novo componente NoticiaContent */}
          {noticiaAtual && <NoticiaContent data={noticiaAtual} />}
        </DashboardCard>
      </ScrollView>
      <DashboardFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  content: {
    padding: 10,
    paddingBottom: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  dataText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B4332",
  },
  dataSubText: {
    fontSize: 14,
    color: "#6C757D",
  },
  // Estilos para o conteúdo da notícia
  noticiaContainer: {
    alignItems: "center",
    gap: 8,
  },
  newsImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  newsTitle: {
    fontWeight: "bold",
  },
  newsDescription: {
    fontSize: 14,
    color: "#6C757D",
  },
  longText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
