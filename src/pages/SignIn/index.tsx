import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from "react-native-animatable";
import Styles from "../../components/Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { useAuth } from "../../contexts/AuthContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const API_BASE_URL = "http://192.168.3.3:3000";

export default function SignIn() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Substitua sua função handleLogin por esta
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o email e a senha.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = {
          id: data.id,
          nome: data.name,
          email: data.email,
          role: data.role,
        };

        await login(user, data.accessToken);

        

        navigation.navigate("DashboardScreen");
      } else {
        Alert.alert("Erro de Login", data.message || "Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível se conectar ao servidor."
      );
    }
  };
  // A parte visual (return) deve estar aqui, dentro da função SignIn
  return (
    <View style={Styles.container}>
      <Animatable.View animation="fadeInLeft" delay={600} style={Styles.Header}>
        <Text style={Styles.textLogin}>Bem-Vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={Styles.Header2}>
        <Text style={Styles.email}>Email</Text>
        <TextInput
          placeholder="Digite um email..."
          style={Styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={Styles.email}>Senha</Text>
        <TextInput
          placeholder="Sua senha"
          secureTextEntry={true}
          style={Styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={Styles.buttonLogin} onPress={handleLogin}>
          <Text style={Styles.textButton}>Acessar</Text>
        </TouchableOpacity>

        <View style={Styles.lineRegister}>
          <View>
            <Text style={Styles.registerText}>Não possui uma conta?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={Styles.buttonLineRegister}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}
