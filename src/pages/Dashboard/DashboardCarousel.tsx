// src/pages/Dashboard/DashboardCarousel.tsx
// Carrossel de métricas rápidas — deslize horizontalmente para ver mais
import React, { useRef, useState } from "react";
import {
  View, Text, StyleSheet, FlatList,
  Dimensions, TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH  = SCREEN_WIDTH * 0.42;
const CARD_GAP    = 12;

interface MetricCard {
  id: string;
  title: string;
  value: string;
  unit?: string;
  icon: string;
  iconLib: "ionicons" | "fa5";
  color: string;
  bg: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
}

const METRICS: MetricCard[] = [
  {
    id: "1",
    title: "Produção Atual",
    value: "120",
    unit: "kg",
    icon: "seedling",
    iconLib: "fa5",
    color: "#4b7940",
    bg: "#f0f7ef",
    trend: "up",
    trendLabel: "+12%",
  },
  {
    id: "2",
    title: "Área Plantada",
    value: "15",
    unit: "ha",
    icon: "map-outline",
    iconLib: "ionicons",
    color: "#2563eb",
    bg: "#eff6ff",
    trend: "stable",
    trendLabel: "Estável",
  },
  {
    id: "3",
    title: "Funcionários",
    value: "8",
    icon: "people-outline",
    iconLib: "ionicons",
    color: "#7c3aed",
    bg: "#f5f3ff",
    trend: "up",
    trendLabel: "+1",
  },
  {
    id: "4",
    title: "Próx. Safra",
    value: "Out",
    unit: "/2026",
    icon: "leaf-outline",
    iconLib: "ionicons",
    color: "#d97706",
    bg: "#fffbeb",
    trend: "stable",
    trendLabel: "Planejado",
  },
];

const TrendIcon = ({ trend }: { trend?: "up" | "down" | "stable" }) => {
  if (trend === "up")     return <Ionicons name="trending-up"   size={13} color="#16a34a" />;
  if (trend === "down")   return <Ionicons name="trending-down" size={13} color="#dc2626" />;
  return <Ionicons name="remove-outline" size={13} color="#6b7280" />;
};

export default function DashboardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const renderCard = ({ item }: { item: MetricCard }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      {/* Ícone colorido */}
      <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
        {item.iconLib === "fa5"
          ? <FontAwesome5 name={item.icon} size={20} color={item.color} />
          : <Ionicons name={item.icon as any} size={20} color={item.color} />
        }
      </View>

      {/* Valor */}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
        {item.unit ? <Text style={styles.unit}>{item.unit}</Text> : null}
      </View>

      {/* Título */}
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

      {/* Tendência */}
      {item.trend && (
        <View style={styles.trendRow}>
          <TrendIcon trend={item.trend} />
          <Text style={[
            styles.trendLabel,
            { color: item.trend === "up" ? "#16a34a" : item.trend === "down" ? "#dc2626" : "#6b7280" }
          ]}>
            {item.trendLabel}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Resumo da Fazenda</Text>
        <View style={styles.dotsRow}>
          {METRICS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={METRICS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={renderCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a2e1a",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#d1d5db",
  },
  dotActive: {
    width: 18, height: 6, borderRadius: 3,
    backgroundColor: "#4b7940",
  },

  listContent: {
    paddingLeft: 2,
    paddingRight: 10,
    gap: CARD_GAP,
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    marginBottom: 2,
  },
  value: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },
  unit: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
