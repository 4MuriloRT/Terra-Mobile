// src/pages/SignIn/index.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { useAuth } from "../../contexts/AuthContext";
import { authLogin } from "../../services/api";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Extrai mensagem legível do erro Axios
function parseError(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.message)) return data.message.join("\n");
  if (typeof err?.message === "string") return err.message;
  return "Ocorreu um erro inesperado. Tente novamente.";
}

export default function SignIn() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  // Erros inline por campo
  const [emailError, setEmailError]   = useState("");
  const [passError, setPassError]     = useState("");
  const [globalError, setGlobalError] = useState("");

  const validate = (): boolean => {
    let ok = true;
    setEmailError(""); setPassError(""); setGlobalError("");

    if (!email.trim()) {
      setEmailError("Informe seu email."); ok = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email inválido."); ok = false;
    }
    if (!password) {
      setPassError("Informe sua senha."); ok = false;
    } else if (password.length < 6) {
      setPassError("A senha deve ter pelo menos 6 caracteres."); ok = false;
    }
    return ok;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await authLogin(email.trim(), password);
      await login(
        { id: String(data.id), nome: data.name || data.nome || email, email: data.email, role: data.role },
        data.accessToken
      );
      navigation.navigate("DashboardTabs");
    } catch (err: any) {
      const msg = parseError(err);
      const status = err?.response?.status;

      if (status === 401 || msg.toLowerCase().includes("credenciais") || msg.toLowerCase().includes("invalid")) {
        setPassError("Email ou senha incorretos. Verifique e tente novamente.");
      } else if (msg.toLowerCase().includes("email")) {
        setEmailError("Email não encontrado.");
      } else if (msg.toLowerCase().includes("plano") || msg.toLowerCase().includes("plan")) {
        setGlobalError("Sua conta não possui um plano ativo. Contate o suporte.");
      } else {
        setGlobalError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar backgroundColor="#1a2e1a" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={700} style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={40} color="#4b7940" />
          </View>
          <Text style={styles.appName}>Terra Manager</Text>
          <Text style={styles.appTagline}>Gestão inteligente de fazendas</Text>
        </Animatable.View>

        {/* Card */}
        <Animatable.View animation="fadeInUp" delay={200} duration={700} style={styles.card}>
          <Text style={styles.cardTitle}>Bem-vindo(a) de volta</Text>
          <Text style={styles.cardSub}>Acesse sua conta para continuar</Text>

          {/* Erro global */}
          {globalError ? (
            <View style={styles.globalErrorBox}>
              <Ionicons name="warning-outline" size={18} color="#b91c1c" />
              <Text style={styles.globalErrorText}>{globalError}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color={emailError ? "#ef4444" : "#4b7940"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(v) => { setEmail(v); setEmailError(""); setGlobalError(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {email.length > 0 && !emailError && /\S+@\S+\.\S+/.test(email) && (
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              )}
            </View>
            {emailError ? <Text style={styles.errorText}><Ionicons name="alert-circle-outline" size={12} /> {emailError}</Text> : null}
          </View>

          {/* Senha */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, passError ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={passError ? "#ef4444" : "#4b7940"} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Sua senha"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={(v) => { setPassword(v); setPassError(""); setGlobalError(""); }}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {passError ? <Text style={styles.errorText}><Ionicons name="alert-circle-outline" size={12} /> {passError}</Text> : null}
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" size="small" />
              : <><Ionicons name="log-in-outline" size={20} color="#fff" /><Text style={styles.loginBtnText}>Entrar</Text></>
            }
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Link cadastro */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}> Cadastre-se grátis</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#1a2e1a" },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 40 },

  header: { alignItems: "center", marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(75,121,64,0.2)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "rgba(75,121,64,0.4)", marginBottom: 14,
  },
  appName:    { fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  appTagline: { fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 4 },

  card: {
    backgroundColor: "#fff", borderRadius: 24, padding: 28,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 12,
  },
  cardTitle: { fontSize: 22, fontWeight: "700", color: "#1a2e1a", marginBottom: 4 },
  cardSub:   { fontSize: 14, color: "#777", marginBottom: 20 },

  globalErrorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#fef2f2", borderRadius: 10, padding: 12,
    borderLeftWidth: 3, borderLeftColor: "#ef4444", marginBottom: 16,
  },
  globalErrorText: { flex: 1, fontSize: 13, color: "#b91c1c", lineHeight: 18 },

  fieldGroup:   { marginBottom: 16 },
  label:        { fontSize: 13, fontWeight: "600", color: "#444", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f5f7f5", borderRadius: 12,
    borderWidth: 1.5, borderColor: "#e0e8e0",
    paddingHorizontal: 12, height: 52,
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fff5f5" },
  inputIcon:  { marginRight: 10 },
  input:      { flex: 1, fontSize: 16, color: "#222", height: "100%" },
  eyeBtn:     { padding: 4 },
  errorText:  { fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: "500" },

  forgotBtn:  { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { fontSize: 13, color: "#4b7940", fontWeight: "600" },

  loginBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#263c20", borderRadius: 14, paddingVertical: 16,
    shadowColor: "#263c20", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  loginBtnText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },

  divider:     { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e8e8e8" },
  dividerText: { marginHorizontal: 12, color: "#aaa", fontSize: 13 },

  registerRow:  { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  registerText: { color: "#777", fontSize: 14 },
  registerLink: { color: "#4b7940", fontWeight: "700", fontSize: 14 },
});
