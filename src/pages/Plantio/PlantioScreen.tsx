import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../components/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";

type PlantioScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PlantioScreen"
>;

const plantioData = [
  { id: "1", name: "Soja", image: require("../../assets/soy.svg") },
  { id: "2", name: "Milho", image: require("../../assets/corn.svg") },
  { id: "3", name: "Feijão", image: require("../../assets/bean.svg") },
  { id: "4", name: "Arroz", image: require("../../assets/rice.svg") },
  { id: "5", name: "Café", image: require("../../assets/coffee.svg") },
  { id: "6", name: "Banana", image: require("../../assets/banana.svg") },
  { id: "7", name: "Laranja", image: require("../../assets/orange.svg") },
  { id: "8", name: "Algodão", image: require("../../assets/cotton.svg") },
];

const { width } = Dimensions.get("window");
const numColumns = 2;
const totalHorizontalPadding = 20 * 2;
const spaceBetweenColumns = 20;
const itemContainerSize =
  (width - totalHorizontalPadding - spaceBetweenColumns) / numColumns;
const iconCircleSize = itemContainerSize * 0.9;

export default function PlantioScreen() {
  const navigation = useNavigation<PlantioScreenNavigationProp>();

  const renderItem = ({ item }: { item: (typeof plantioData)[0] }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.iconCircle}>
        <Image source={item.image} style={styles.itemImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Novo Plantio</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={plantioData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2C26",
  },
  header: {
    backgroundColor: "transparent",
    padding: 15,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.white,
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    margin: 15,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
    paddingBottom: 50,
  },
  itemContainer: {
    width: itemContainerSize,
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: iconCircleSize,
    height: iconCircleSize,
    borderRadius: iconCircleSize / 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
