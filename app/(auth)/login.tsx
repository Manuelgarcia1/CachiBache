import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, Stack, Text } from 'tamagui';
import { AppLogo } from '@features/auth/components/AppLogo';
import { useAuth } from '@/src/shared/contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      console.log('⚠️ Email y contraseña son requeridos');
      return;
    }

    setLoading(true);
    console.log('📧 Iniciando login con email...');
    console.log('👤 Email:', email);

    try {
      const mockToken = `email-${Date.now()}`;
      console.log('🔑 Generando token mock para email:', mockToken);

      await login(mockToken, { email, name: email.split('@')[0] });

      console.log('✅ Login exitoso - La navegación será automática');
    } catch (error) {
      console.error('❌ Error en login con email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack
        flex={1}
        backgroundColor="$blue8"
        justifyContent="center"
        alignItems="center"
        padding="$4"
        space="$4"
      >
        <AppLogo />

        <Text fontSize="$6" fontWeight="600" color="white" textAlign="center">
          Ingresar con Email
        </Text>

        <Stack space="$3" width="100%" maxWidth={300}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            size="$4"
            backgroundColor="white"
          />

          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            size="$4"
            backgroundColor="white"
          />

          <Button
            size="$4"
            backgroundColor="$yellow8"
            color="$gray12"
            fontWeight="600"
            borderRadius="$6"
            pressStyle={{ backgroundColor: "$yellow9" }}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <Button
            size="$4"
            backgroundColor="transparent"
            borderColor="$gray8"
            borderWidth={2}
            color="white"
            fontWeight="600"
            borderRadius="$6"
            pressStyle={{ backgroundColor: "$gray9" }}
            onPress={() => router.back()}
          >
            Volver
          </Button>
        </Stack>
      </Stack>
    </KeyboardAvoidingView>
  );
}