// src/components/DashboardCarousel.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    title: "Produção Atual",
    icon: "seedling",
    value: "120 kg",
  },
  {
    id: "2",
    title: "Área Plantada",
    icon: "tractor",
    value: "15 ha",
  },
  {
    id: "3",
    title: "Funcionários",
    icon: "users",
    value: "8",
  },
  {
    id: "4",
    title: "Safra",
    icon: "leaf",
    value: "Outubro",
  },
];

const DashboardCarousel = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => (
          <View style={styles.card}>
            <FontAwesome5 name={item.icon} size={30} color="#4B7F52" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  card: {
    width: width * 0.8,
    marginHorizontal: 10,
    backgroundColor: "#DFF0D8",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  value: {
    marginTop: 5,
    fontSize: 18,
    color: "#222",
  },
});

export default DashboardCarousel;
