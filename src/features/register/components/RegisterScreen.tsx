import React, { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import { RegisterForm, RegisterFormData } from "./RegisterForm";
import { Header } from '@sharedcomponents/index';


export function RegisterScreen() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);

    try {
      console.log("Datos del formulario:", formData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Usuario registrado exitosamente");
      // Navegar al home después del registro exitoso
      router.push("/(app)/home" as any);
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false);
    }
  };

   const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Pasamos la función handleBackToLogin al Header */}
      <Header onPress={handleBackToLogin} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.mainTitle}>Crear Cuenta</Text>
          
          {/* 2. Pasamos la misma función al RegisterForm para el enlace de texto de abajo */}
          <RegisterForm 
            onSubmit={handleRegister} 
            loading={loading} 
            onBackToLogin={handleBackToLogin} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Los estilos de RegisterScreen se mantienen igual
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5eb0ef',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
});
