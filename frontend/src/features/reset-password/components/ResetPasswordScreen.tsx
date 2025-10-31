import { authService } from '@/src/shared/services/auth.service';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, Text } from 'tamagui';
import { ResetPasswordForm } from './ResetPasswordForm';

export function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (values: { password: string, passwordConfirmation: string }) => {
    if (!token) {
      setError('Token no encontrado. Por favor, solicita un nuevo enlace.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.resetPassword({
        token,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });
      setSuccess(response.message);
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Ocurrió un error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#094b7eff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <Text fontSize="$6" fontWeight="600" color="white" textAlign="center">
              Restablecer Contraseña
            </Text>

            {error && (
              <Stack backgroundColor="$red9" padding="$3" borderRadius="$4" width="100%" maxWidth={300}>
                <Text color="white" fontSize="$3" textAlign="center">{error}</Text>
              </Stack>
            )}

            {success && (
              <Stack backgroundColor="$green9" padding="$3" borderRadius="$4" width="100%" maxWidth={300}>
                <Text color="white" fontSize="$3" textAlign="center">{success}</Text>
              </Stack>
            )}

            <ResetPasswordForm onSubmit={handleResetPassword} loading={loading || !!success} />
          </Stack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
