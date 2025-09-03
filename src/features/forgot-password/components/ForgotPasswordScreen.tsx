import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '../../auth/components/AppLogo';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface ForgotPasswordScreenProps {
  onPasswordResetSent?: () => void;
  onBackToLogin?: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onPasswordResetSent,
  onBackToLogin,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string) => {
    setLoading(true);
    
    try {
      // Aquí iría la lógica de envío de email con tu API
      console.log('Enviando email de recuperación a:', email);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Si el envío es exitoso
      console.log('Email de recuperación enviado exitosamente');
      
      Alert.alert(
        'Email Enviado',
        'Hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.',
        [
          {
            text: 'OK',
            onPress: () => onPasswordResetSent?.()
          }
        ]
      );
      
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      Alert.alert(
        'Error',
        'No pudimos enviar el email de recuperación. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={150}
      >
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Logo y título */}
          <View style={styles.header}>
            <AppLogo />
            <Text style={styles.title}>
              ¿Olvidaste tu contraseña?
            </Text>
            <Text style={styles.subtitle}>
              No te preocupes, te ayudamos a recuperarla
            </Text>
          </View>

          {/* Formulario de recuperación */}
          <ForgotPasswordForm
            onSubmit={handleSubmit}
            loading={loading}
            onBackToLogin={onBackToLogin}
          />
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 300,
  },
});
