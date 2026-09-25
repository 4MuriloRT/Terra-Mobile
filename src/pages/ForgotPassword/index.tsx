// src/pages/ForgotPassword/index.tsx
// Fluxo completo de recuperação de senha:
// Etapa 1: Email → Etapa 2: Código de verificação → Etapa 3: Nova senha

import React, { useState, useRef } from "react";
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
import {
  authForgotPassword,
  authVerifyResetToken,
  authResetPassword,
} from "../../services/api";

type NavigationProp = StackNavigationProp<RootStackParamList>;

type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, label: "Email", icon: "mail-outline" as const },
  { id: 2, label: "Código", icon: "key-outline" as const },
  { id: 3, label: "Nova Senha", icon: "lock-closed-outline" as const },
];

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Etapa 1
  const [email, setEmail] = useState("");

  // Etapa 2
  const [token, setToken] = useState("");

  // Etapa 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Etapa 1: solicitar código ──────────────────────────────────────────────
  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Campo obrigatório", "Digite seu email cadastrado.");
      return;
    }
    setIsLoading(true);
    try {
      await authForgotPassword(email.trim());
      Alert.alert(
        "Código enviado! 📧",
        `Um código de verificação foi enviado para ${email}. Verifique sua caixa de entrada.`
      );
      setStep(2);
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Email não encontrado.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Etapa 2: verificar código ──────────────────────────────────────────────
  const handleVerifyCode = async () => {
    if (!token.trim()) {
      Alert.alert("Campo obrigatório", "Digite o código recebido por email.");
      return;
    }
    setIsLoading(true);
    try {
      await authVerifyResetToken(email.trim(), token.trim());
      setStep(3);
    } catch (error: any) {
      Alert.alert("Código inválido", error?.message || "Código incorreto ou expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Etapa 3: redefinir senha ───────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Campos obrigatórios", "Preencha a nova senha e confirmação.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Senhas diferentes", "As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setIsLoading(true);
    try {
      await authResetPassword(email.trim(), token.trim(), newPassword);
      Alert.alert(
        "Senha redefinida! ✅",
        "Sua senha foi alterada com sucesso. Faça o login com a nova senha.",
        [{ text: "Fazer Login", onPress: () => navigation.navigate("SignIn") }]
      );
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Não foi possível redefinir a senha.");
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
            <Ionicons name="key-outline" size={34} color="#4b7940" />
          </View>
          <Text style={styles.headerTitle}>Recuperar Senha</Text>
          <Text style={styles.headerSub}>Redefina sua senha em 3 passos simples</Text>
        </Animatable.View>

        {/* Barra de progresso */}
        <Animatable.View animation="fadeIn" delay={100} style={styles.stepsRow}>
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.id}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    step > s.id && styles.stepDone,
                    step === s.id && styles.stepActive,
                  ]}
                >
                  {step > s.id ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Ionicons
                      name={s.icon}
                      size={16}
                      color={step === s.id ? "#fff" : "rgba(255,255,255,0.4)"}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step === s.id && styles.stepLabelActive,
                  ]}
                >
                  {s.label}
                </Text>
              </View>
              {idx < STEPS.length - 1 && (
                <View
                  style={[styles.stepLine, step > s.id && styles.stepLineDone]}
                />
              )}
            </React.Fragment>
          ))}
        </Animatable.View>

        {/* Card */}
        <Animatable.View
          key={step} // força re-animação ao mudar etapa
          animation="fadeInUp"
          delay={200}
          duration={500}
          style={styles.card}
        >
          {/* ── ETAPA 1 ── */}
          {step === 1 && (
            <>
              <Text style={styles.cardTitle}>Digite seu email</Text>
              <Text style={styles.cardSub}>
                Enviaremos um código de verificação para o email cadastrado na sua conta.
              </Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email cadastrado</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#4b7940" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
              <ActionButton
                label="Enviar Código"
                icon="send-outline"
                onPress={handleSendCode}
                isLoading={isLoading}
              />
            </>
          )}

          {/* ── ETAPA 2 ── */}
          {step === 2 && (
            <>
              <Text style={styles.cardTitle}>Insira o código</Text>
              <Text style={styles.cardSub}>
                Verifique a caixa de entrada de <Text style={styles.emailHighlight}>{email}</Text> e insira o código recebido.
              </Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Código de verificação</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="key-outline" size={18} color="#4b7940" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 123456"
                    placeholderTextColor="#aaa"
                    value={token}
                    onChangeText={setToken}
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <ActionButton
                label="Verificar Código"
                icon="shield-checkmark-outline"
                onPress={handleVerifyCode}
                isLoading={isLoading}
              />

              {/* Reenviar */}
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => { setStep(1); setToken(""); }}
              >
                <Ionicons name="refresh-outline" size={14} color="#4b7940" />
                <Text style={styles.resendText}>Não recebeu? Tentar outro email</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── ETAPA 3 ── */}
          {step === 3 && (
            <>
              <Text style={styles.cardTitle}>Nova senha</Text>
              <Text style={styles.cardSub}>
                Escolha uma senha forte para proteger sua conta.
              </Text>

              {/* Nova senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#4b7940" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showNew}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                    <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar nova senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#4b7940" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Repita a senha"
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

              {/* Indicador de força da senha */}
              {newPassword.length > 0 && (
                <PasswordStrength password={newPassword} />
              )}

              <ActionButton
                label="Redefinir Senha"
                icon="lock-open-outline"
                onPress={handleResetPassword}
                isLoading={isLoading}
              />
            </>
          )}

          {/* Link para login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Lembrou a senha?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.loginLink}> Fazer login</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Componente: Botão de ação ─────────────────────────────────────────────
function ActionButton({
  label,
  icon,
  onPress,
  isLoading,
}: {
  label: string;
  icon: any;
  onPress: () => void;
  isLoading: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, isLoading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.85}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <Ionicons name={icon} size={20} color="#fff" />
          <Text style={styles.actionButtonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── Componente: Força da senha ────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const score = getStrength();
  const labels = ["", "Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];
  const colors = ["", "#dc2626", "#f97316", "#eab308", "#22c55e", "#16a34a"];

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              { backgroundColor: i <= score ? colors[score] : "#e5e7eb" },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: colors[score] }]}>
        {labels[score]}
      </Text>
    </View>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#1a2e1a" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },

  // Header
  header: { alignItems: "center", marginBottom: 28, paddingTop: 10 },
  backBtn: { position: "absolute", left: 0, top: 10, padding: 8 },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(75,121,64,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(75,121,64,0.4)",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4, textAlign: "center" },

  // Steps
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  stepItem: { alignItems: "center", gap: 6 },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  stepActive: {
    borderColor: "#4b7940",
    backgroundColor: "#4b7940",
  },
  stepDone: {
    borderColor: "#22c55e",
    backgroundColor: "#22c55e",
  },
  stepLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  stepLabelActive: { color: "#fff" },
  stepLine: { flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.15)", marginHorizontal: 6, marginBottom: 20 },
  stepLineDone: { backgroundColor: "#22c55e" },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  cardTitle: { fontSize: 22, fontWeight: "700", color: "#1a2e1a", marginBottom: 6 },
  cardSub: { fontSize: 14, color: "#777", marginBottom: 22, lineHeight: 20 },
  emailHighlight: { color: "#4b7940", fontWeight: "600" },

  // Inputs
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7f5",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e8e0",
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#222" },
  eyeBtn: { padding: 4 },

  // Botão
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#263c20",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: "#263c20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Reenviar
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  resendText: { color: "#4b7940", fontSize: 13, fontWeight: "600" },

  // Força da senha
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    marginTop: -6,
  },
  strengthBars: { flexDirection: "row", gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "600", minWidth: 70 },

  // Login link
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  loginText: { color: "#777", fontSize: 14 },
  loginLink: { color: "#4b7940", fontWeight: "700", fontSize: 14 },
});
