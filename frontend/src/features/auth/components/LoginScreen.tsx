import { useAuth } from "@/src/shared/contexts/AuthContext";
import { AppLogo } from "@features/welcome";
import { Header } from "@sharedcomponents/index";
import { loginSchema } from "@sharedvalidation/schemas";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Stack, Text } from "tamagui";

interface LoginFormData {
  email: string;
  password: string;
}

// Pantalla de login con email: formulario de autenticación con email y contraseña
export function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Maneja el login con email: valida campos y genera token mock
  const handleEmailLogin = async (
    values: LoginFormData,
    { setSubmitting }: FormikHelpers<LoginFormData>
  ) => {
    setLoading(true);
    console.log("📧 Iniciando login con email...");
    console.log("👤 Email:", values.email);

    try {
      const mockToken = `email-${Date.now()}`;
      console.log("🔑 Generando token mock para email:", mockToken);

      await login(mockToken, { email: values.email, name: values.email.split("@")[0] });

      console.log("✅ Login exitoso - Navegando a la app");
    } catch (error) {
      console.error("❌ Error en login con email:", error);
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
            space="$4"
          >
            <AppLogo />

            <Text fontSize="$6" fontWeight="600" color="white" textAlign="center">
              Ingresar con Email
            </Text>

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
                <Stack space="$4" width="100%" maxWidth={300}>
                  <Stack space="$1">
                    <Input
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      size="$4"
                      backgroundColor="white"
                      borderColor={touched.email && errors.email ? "$red8" : "white"}
                    />
                    {touched.email && errors.email && (
                      <Text color="$red8" fontSize="$2">
                        {errors.email}
                      </Text>
                    )}
                  </Stack>

                  <Stack space="$1">
                    <Input
                      placeholder="Contraseña"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry
                      size="$4"
                      backgroundColor="white"
                      borderColor={touched.password && errors.password ? "$red8" : "white"}
                    />
                    {touched.password && errors.password && (
                      <Text color="$red8" fontSize="$2">
                        {errors.password}
                      </Text>
                    )}
                  </Stack>

                  <Button
                    size="$4"
                    backgroundColor="$yellow8"
                    color="$gray12"
                    fontWeight="600"
                    borderRadius="$6"
                    pressStyle={{ backgroundColor: "$yellow9" }}
                    onPress={() => handleSubmit()}
                    disabled={loading || !values.email || !values.password || !!errors.email || !!errors.password}
                  >
                    {loading ? "Ingresando..." : "Ingresar"}
                  </Button>
                </Stack>
              )}
            </Formik>
          </Stack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
