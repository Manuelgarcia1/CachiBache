import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { FormField } from './FormField';

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
    <View style={styles.container}>
      <Text style={styles.title}>
        Recuperar Contraseña
      </Text>
      
      <Text style={styles.description}>
        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
      </Text>

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
        <Text style={styles.backText}>
          ¿Recordaste tu contraseña?{' '}
          <Text style={styles.backLink} onPress={onBackToLogin}>
            Inicia sesión
          </Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginTop: 24,
  },
  backLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
