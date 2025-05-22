import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export const DashboardFooter = () => {
  return (
    <View style={styles.footer}>
      <FontAwesome5 name="seedling" size={28} color="#4B7F52" />
      <FontAwesome5 name="home" size={28} color="#4B7F52" />
      <FontAwesome5 name="tractor" size={28} color="#4B7F52" />
      <FontAwesome5 name="users" size={28} color="#4B7F52" />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 32,
    backgroundColor: "#CED5C0",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
