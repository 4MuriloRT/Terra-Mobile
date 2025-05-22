import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  title: string;
  onPress: () => void;
}

export const DashboardCard: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <FontAwesome name="angle-left" size={20} color="#4B7F52" />
      <Text style={styles.text}>{title}</Text>
      <FontAwesome name="angle-right" size={20} color="#4B7F52" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
