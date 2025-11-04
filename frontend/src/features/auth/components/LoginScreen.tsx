import { useAuth } from "@/src/shared/contexts/AuthContext";
import { authService } from "@/src/shared/services/auth.service";
import { AppLogo } from "@features/welcome";
import { Header } from "@sharedcomponents/index";
import { loginSchema } from "@sharedvalidation/schemas";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Stack, Text, YStack } from "tamagui";
import { Feather } from "@expo/vector-icons";

interface LoginFormData {
  email: string;
  password: string;
}

// Pantalla de login con email: formulario de autenticación con email y contraseña
export function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Maneja el login con email: valida campos y llama al backend para autenticar
  const handleEmailLogin = async (
    values: LoginFormData,
    { setSubmitting }: FormikHelpers<LoginFormData>
  ) => {
    setLoading(true);
    setError(null);
    console.log("📧 Iniciando login con email...");
    console.log("👤 Email:", values.email);

    try {
      // Llamar al servicio de autenticación real
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      console.log("✅ Login exitoso - Usuario autenticado");
      console.log("👤 Usuario:", response.user.email);

      // Guardar ambos tokens y datos del usuario en el contexto
      await login(
        response.accessToken,
        {
          email: response.user.email,
          name: response.user.fullName,
          emailVerified: response.user.emailVerified,
          role: response.user.role,
        },
        response.refreshToken
      );

      console.log("✅ Sesión iniciada - Navegando a la app");
    } catch (error: any) {
      console.error("❌ Error en login:", error);

      // Mostrar mensaje de error apropiado al usuario
      if (error.statusCode === 401) {
        setError("Email o contraseña incorrectos");
      } else if (error.statusCode === 0) {
        setError(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
      } else {
        setError(
          error.message ||
            "Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const initialValues: LoginFormData = {
    email: "",
    password: "",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#094b7eff" }}>
      <Header onPress={handleBack} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Stack
            flex={1}
            backgroundColor="#094b7eff"
            justifyContent="center"
            alignItems="center"
            padding="$4"
            space="$5"
          >
            <AppLogo size={250} />

            <Text
              fontSize="$6"
              fontWeight="600"
              color="#ffffff"
              textAlign="center"
              marginBottom="$3"
            >
              Ingresar con Email
            </Text>

            {error && (
              <Stack
                backgroundColor="$red9"
                padding="$3"
                borderRadius="$4"
                width="100%"
                maxWidth={300}
              >
                <Text color="white" fontSize="$3" textAlign="center">
                  {error}
                </Text>
              </Stack>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={handleEmailLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <Stack
                  space="$4"
                  width="100%"
                  maxWidth={400}
                  paddingHorizontal="$4"
                >
                  <Stack space="$2">
                    <Input
                      placeholder="Email"
                      placeholderTextColor="#999"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      height={55}
                      backgroundColor="white"
                      borderRadius="$6"
                      paddingHorizontal="$5"
                      fontSize="$4"
                      borderColor={
                        touched.email && errors.email ? "$red8" : "transparent"
                      }
                      borderWidth={2}
                    />
                    {touched.email && errors.email && (
                      <Text color="#ff6b6b" fontSize="$3" marginTop="$1">
                        {errors.email}
                      </Text>
                    )}
                  </Stack>

                  <Stack space="$2">
                    <YStack position="relative">
                      <Input
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry={!showPassword}
                        height={55}
                        backgroundColor="white"
                        borderRadius="$6"
                        paddingHorizontal="$5"
                        fontSize="$4"
                        borderColor={
                          touched.password && errors.password
                            ? "$red8"
                            : "transparent"
                        }
                        borderWidth={2}
                        paddingRight={50}
                      />
                      <YStack
                        position="absolute"
                        right={15}
                        top={0}
                        height="100%"
                        justifyContent="center"
                        onPress={() => setShowPassword(!showPassword)}
                        pressStyle={{ opacity: 0.7 }}
                      >
                        <Feather
                          name={showPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#666"
                        />
                      </YStack>
                    </YStack>
                    {touched.password && errors.password && (
                      <Text color="#ff6b6b" fontSize="$3" marginTop="$1">
                        {errors.password}
                      </Text>
                    )}
                  </Stack>

                  <YStack space="$2" marginTop="$2">
                    <Button
                      size="$4"
                      backgroundColor="$yellow8"
                      color="$black"
                      fontWeight="bold"
                      borderRadius="$10"
                      pressStyle={{ backgroundColor: "$yellow9" }}
                      onPress={() => handleSubmit()}
                      disabled={
                        loading ||
                        !values.email ||
                        !values.password ||
                        !!errors.email ||
                        !!errors.password
                      }
                      opacity={
                        loading ||
                        !values.email ||
                        !values.password ||
                        !!errors.email ||
                        !!errors.password
                          ? 0.6
                          : 1
                      }
                    >
                      {loading ? "Ingresando..." : "Ingresar"}
                    </Button>

                    <Button
                      size="$3"
                      backgroundColor="transparent"
                      color="#ffffff"
                      fontWeight="500"
                      borderRadius="$4"
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => router.navigate("/forgot-password")}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </YStack>
                </Stack>
              )}
            </Formik>
          </Stack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
