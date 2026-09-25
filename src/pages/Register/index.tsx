// src/pages/Register/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/Types";
import { authRegister } from "../../services/api";

type NavigationProp = StackNavigationProp<RootStackParamList, "Register">;

// ─── PLANOS ───────────────────────────────────────────────────────────────────
const PLANOS = [
  {
    id: "FREE",
    nome: "Free",
    preco: "Gratuito",
    icon: "leaf-outline" as const,
    cor: "#6b7280",
    recursos: ["Gestão de fazendas", "Cadastro de cultivares", "Plantios básicos"],
  },
  {
    id: "PRO",
    nome: "Pro",
    preco: "Para testes",
    icon: "star-outline" as const,
    cor: "#4b7940",
    recursos: ["Tudo do Free", "Cotações em tempo real", "Análise de solo", "Operações detalhadas"],
    destaque: true,
  },
  {
    id: "PREMIUM",
    nome: "Premium",
    preco: "Para testes",
    icon: "diamond-outline" as const,
    cor: "#D4A373",
    recursos: ["Tudo do Pro", "Relatórios avançados", "API de dados de solo", "Suporte prioritário"],
  },
];

const ROLES = [
  { id: "USER", label: "Produtor Rural / Agricultor" },
  { id: "AGRONOMO", label: "Agrônomo / Técnico" },
  { id: "ADMIN", label: "Administrador" },
];

export default function Register() {
  const navigation = useNavigation<NavigationProp>();

  // Campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("USER");
  const [plano, setPlano] = useState("FREE");
  const [isLoading, setIsLoading] = useState(false);

  // Máscaras simples
  const maskCpf = (v: string) => {
    return v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  };

  const maskTelefone = (v: string) => {
    return v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Campos obrigatórios", "Preencha nome, email e senha.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Senhas diferentes", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await authRegister({
        nome: nome.trim(),
        email: email.trim(),
        password,
        cpf: cpf.replace(/\D/g, "") || undefined,
        telefone: telefone.replace(/\D/g, "") || undefined,
        role,
        plano,
      });

      Alert.alert(
        "Conta criada! 🌱",
        `Bem-vindo(a) ao Terra Manager!\nPlano ${plano} ativado. Faça login para continuar.`,
        [{ text: "Fazer Login", onPress: () => navigation.navigate("SignIn") }]
      );
    } catch (error: any) {
      Alert.alert(
        "Erro no Cadastro",
        error?.message || "Não foi possível criar a conta."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor="#1a2e1a" barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add-outline" size={32} color="#4b7940" />
          </View>
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <Text style={styles.headerSub}>Junte-se ao Terra Manager</Text>
        </Animatable.View>

        {/* Card Principal */}
        <Animatable.View animation="fadeInUp" delay={150} duration={600} style={styles.card}>

          {/* Dados Pessoais */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="person-outline" size={16} color="#4b7940" /> Dados Pessoais
          </Text>

          <InputField
            label="Nome Completo *"
            icon="person-outline"
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
          />
          <InputField
            label="Email *"
            icon="mail-outline"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="CPF"
            icon="card-outline"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(v) => setCpf(maskCpf(v))}
            keyboardType="numeric"
          />
          <InputField
            label="Telefone"
            icon="call-outline"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChangeText={(v) => setTelefone(maskTelefone(v))}
            keyboardType="phone-pad"
          />

          {/* Senha */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            <Ionicons name="lock-closed-outline" size={16} color="#4b7940" /> Segurança
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#4b7940" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#4b7940" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Repita sua senha"
                placeholderTextColor="#aaa"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={18} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Perfil / Role */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            <Ionicons name="briefcase-outline" size={16} color="#4b7940" /> Perfil de Uso
          </Text>
          <View style={styles.roleContainer}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleOption, role === r.id && styles.roleSelected]}
                onPress={() => setRole(r.id)}
              >
                <View style={[styles.radioCircle, role === r.id && styles.radioSelected]}>
                  {role === r.id && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.roleLabel, role === r.id && styles.roleLabelSelected]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Seleção de Plano */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            <Ionicons name="rocket-outline" size={16} color="#4b7940" /> Escolha seu Plano
          </Text>
          <Text style={styles.planoNote}>
            Para fins de demonstração, todos os planos estão disponíveis sem cobrança.
          </Text>

          {PLANOS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.planoCard,
                plano === p.id && { borderColor: p.cor, borderWidth: 2 },
                p.destaque && styles.planoDestaque,
              ]}
              onPress={() => setPlano(p.id)}
              activeOpacity={0.8}
            >
              {p.destaque && (
                <View style={styles.planoBadge}>
                  <Text style={styles.planoBadgeText}>⭐ Recomendado</Text>
                </View>
              )}
              <View style={styles.planoHeader}>
                <View style={[styles.planoIconCircle, { backgroundColor: p.cor + "22" }]}>
                  <Ionicons name={p.icon} size={22} color={p.cor} />
                </View>
                <View style={styles.planoInfo}>
                  <Text style={[styles.planoNome, { color: p.cor }]}>{p.nome}</Text>
                  <Text style={styles.planoPreco}>{p.preco}</Text>
                </View>
                <View style={[styles.checkCircle, plano === p.id && { backgroundColor: p.cor }]}>
                  {plano === p.id && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
              </View>
              <View style={styles.planoRecursos}>
                {p.recursos.map((r, i) => (
                  <View key={i} style={styles.recursoRow}>
                    <Ionicons name="checkmark-circle" size={14} color={p.cor} />
                    <Text style={styles.recursoText}>{r}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Link login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.loginLink}> Fazer login</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── COMPONENTE AUXILIAR ──────────────────────────────────────────────────────
function InputField({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={18} color="#4b7940" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || "words"}
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#1a2e1a" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 40,
    paddingTop: 20,
  },

  // Header
  header: { alignItems: "center", marginBottom: 24, paddingTop: 10 },
  backBtn: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 8,
  },
  logoCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(75,121,64,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(75,121,64,0.4)",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    marginTop: 4,
  },

  // Inputs
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 5 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7f5",
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#e0e8e0",
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: "#222" },
  eyeBtn: { padding: 4 },

  // Role
  roleContainer: { gap: 8 },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e0e8e0",
    backgroundColor: "#f9faf9",
  },
  roleSelected: { borderColor: "#4b7940", backgroundColor: "#f0f7ef" },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioSelected: { borderColor: "#4b7940" },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4b7940",
  },
  roleLabel: { fontSize: 14, color: "#555" },
  roleLabelSelected: { color: "#263c20", fontWeight: "600" },

  // Plano
  planoNote: {
    fontSize: 12,
    color: "#888",
    marginBottom: 14,
    lineHeight: 18,
  },
  planoCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e0e8e0",
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fafbfa",
  },
  planoDestaque: {
    backgroundColor: "#f0f7ef",
  },
  planoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#4b7940",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  planoBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  planoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  planoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  planoInfo: { flex: 1 },
  planoNome: { fontSize: 17, fontWeight: "700" },
  planoPreco: { fontSize: 12, color: "#888", marginTop: 2 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  planoRecursos: { gap: 4 },
  recursoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  recursoText: { fontSize: 13, color: "#555" },

  // Botão
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#263c20",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    shadowColor: "#263c20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },

  // Login link
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  loginText: { color: "#777", fontSize: 14 },
  loginLink: { color: "#4b7940", fontWeight: "700", fontSize: 14 },
});
