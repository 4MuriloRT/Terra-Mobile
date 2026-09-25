// src/pages/SignIn/index.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as Animatable from "react-native-animatable";
import Styles from "../../components/Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { useAuth } from "../../contexts/AuthContext";
import { authLogin } from "../../services/api";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SignIn() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o email e a senha.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authLogin(email, password);

      const user = {
        id: String(data.id),
        nome: data.name || data.nome || email,
        email: data.email,
        role: data.role,
      };

      await login(user, data.accessToken);
      navigation.navigate("DashboardScreen");
    } catch (error: any) {
      Alert.alert(
        "Erro de Login",
        error?.message || "Não foi possível conectar ao servidor."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          editable={!isLoading}
        />
        <Text style={Styles.email}>Senha</Text>
        <TextInput
          placeholder="Sua senha"
          secureTextEntry={true}
          style={Styles.input}
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[Styles.buttonLogin, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={Styles.textButton}>Acessar</Text>
          )}
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
