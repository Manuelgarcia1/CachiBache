import React, { useState } from 'react';
import { Stack, Text } from 'tamagui';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { FormField } from '../../../shared/components';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El email no es válido');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateEmail()) {
      onSubmit(email);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) {
      setError('');
    }
  };

  return (
    <Stack space="$4" width="100%" maxWidth={400} padding="$4">
      <Stack space="$3" alignItems="center">
        <Text
          fontSize="$7"
          fontWeight="600"
          textAlign="center"
          color="white"
        >
          Recuperar Contraseña
        </Text>
        
        <Text
          fontSize="$4"
          color="$blue3"
          textAlign="center"
          lineHeight="$1"
          paddingHorizontal="$4"
        >
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </Text>
      </Stack>

      <FormField
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChangeText={handleEmailChange}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <ForgotPasswordButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!email.trim()}
      />

      {onBackToLogin && (
        <Text
          fontSize="$4"
          color="white"
          textAlign="center"
          marginTop="$4"
        >
          ¿Recordaste tu contraseña?{' '}
          <Text
            color="$yellow8"
            fontWeight="600"
            onPress={onBackToLogin}
            textDecorationLine="underline"
          >
            Inicia sesión
          </Text>
        </Text>
      )}
    </Stack>
  );
};
