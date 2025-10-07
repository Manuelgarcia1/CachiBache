// Ubicación: src/features/register/components/RegisterScreen.tsx

import { Header } from "@sharedcomponents/index"; // Importa el componente de encabezado compartido.
import { router } from "expo-router"; // Herramienta de navegación de Expo Router.
import React, { useState } from "react";
import {
  KeyboardAvoidingView, // Para ajustar la vista cuando el teclado aparece.
  Platform, // Para detectar la plataforma (iOS/Android).
  ScrollView, // Para permitir el desplazamiento del contenido.
  StyleSheet, // Para definir estilos.
  Text, // Componente de texto.
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Para asegurar que el contenido no se superponga con las áreas seguras del dispositivo.
import { RegisterForm, RegisterFormData } from "./RegisterForm"; // Importa el formulario de registro y su tipo de datos.

// Componente de pantalla para el registro de usuarios.
export function RegisterScreen() {
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga.

  // Función para manejar el envío del formulario de registro.
  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true); // Activa el estado de carga.

    try {
      console.log("Datos del formulario:", formData);
      // Simula una llamada a la API con un retardo de 2 segundos.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Usuario registrado exitosamente");
      // Navegar al home después del registro exitoso.
      router.push("/(app)/home" as any);
    } catch (error) {
      console.error("Error en el registro:", error);
      // Aquí se podría mostrar una alerta de error al usuario.
    } finally {
      setLoading(false); // Desactiva el estado de carga.
    }
  };

  // Función para manejar el botón de retroceso o el enlace "Volver a Iniciar Sesión".
  const handleBackToLogin = () => {
    router.back(); // Vuelve a la pantalla anterior (normalmente la de login).
  };

  return (
    // Área segura para el contenido de la pantalla.
    <SafeAreaView style={styles.safeArea}>
      {/* Encabezado con botón de retroceso. */}
      <Header onPress={handleBackToLogin} />

      {/* Ajusta la vista para evitar que el teclado oculte los campos. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Contenedor con scroll para el contenido. */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Título principal de la pantalla. */}
          <Text style={styles.mainTitle}>Crear Cuenta</Text>

          {/* Formulario de registro. */}
          <RegisterForm
            onSubmit={handleRegister} // Pasa la función para manejar el envío.
            loading={loading} // Pasa el estado de carga.
            onBackToLogin={handleBackToLogin} // Pasa la función para el enlace de "Volver a Iniciar Sesión".
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos de la pantalla de registro.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#094b7eff", // Color de fondo.
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 24,
  },
});
