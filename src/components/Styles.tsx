// src/components/Styles.ts
import { StyleSheet } from "react-native";
import { colors } from "../components/Colors"; // Importa as cores do arquivo colors.ts

export default StyleSheet.create({
  text: {
    color: colors.textSecondary,
  },
  image: {
    flex: 0, // geralmente não é necessário flex para imagens fixas
    width: 350,
    height: 350,
    resizeMode: "cover", // ou "contain", dependendo do efeito desejado
    alignSelf: "center",
    borderRadius: 175,
    margin: 50,
    marginTop: 75, // metade de 150
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 28,
    marginBottom: 12,
  },
  button: {
    flex: 2,
    position: "absolute",
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 8,
    width: "60%",
    alignSelf: "center",
    bottom: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    flex: 1.5,
    justifyContent: "flex-end",
    backgroundColor: colors.background,
  },
  back2: {
    flex: 1.5,
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "10%",
  },
  textButton: {
    color: colors.white,
    fontWeight: "bold",
  },
  Header: {
    marginTop: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  container: {
    flex: 2,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  textLogin: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 100,
    paddingStart: "5%",
  },
  Header2: {
    marginTop: "15%",
    marginBottom: "8%",
    paddingStart: "5%",
    paddingEnd: "5%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
  },
  email: {
    color: colors.textPrimary,
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    color: colors.textPrimary,
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  registerText: {
    color: colors.textSecondary,
  },

  buttonRegister: {
    marginTop: 14,
    alignSelf: "center",
  },
  buttonLogin: {
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
