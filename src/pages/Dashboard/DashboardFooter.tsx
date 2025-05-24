import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export const DashboardFooter = () => {
  return (
    <View style={styles.footer}>
      <FontAwesome5 name="seedling" size={28} color="#131e10" />
      <FontAwesome5 name="home" size={28} color="#131e10" />
      <FontAwesome5 name="tractor" size={28} color="#131e10" />
      <FontAwesome5 name="users" size={28} color="#131e10" />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 32,
    backgroundColor: "#fff",    
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
