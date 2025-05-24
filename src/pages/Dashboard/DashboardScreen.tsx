import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { DashboardHeader } from "../Header";
import { DashboardCard } from "../Dashboard/DashboardCard";
import { DashboardFooter } from "../Dashboard/DashboardFooter";
import DashboardCarousel from "../Dashboard/DashboardCarousel";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <DashboardHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <DashboardCarousel />
        <View style={styles.row}>
          <DashboardCard title="CLIMA" onPress={() => {}} />
          <DashboardCard title="PREÇO" onPress={() => {}} />
        </View>
        <DashboardCard title="NOTÍCIA" onPress={() => {}} />
        <DashboardCard title="CURIOSIDADE" onPress={() => {}} />

        <View style={{ height: 80 }} />
      </ScrollView>

      <DashboardFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#263c20",
  },
  content: {
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 16,
  },
});
