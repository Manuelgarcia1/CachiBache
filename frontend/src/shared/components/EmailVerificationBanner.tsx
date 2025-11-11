import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';

/**
 * Banner que aparece cuando el usuario no ha verificado su email
 * Muestra un mensaje y permite reenviar el email de verificación
 */
export function EmailVerificationBanner() {
  const { user, isEmailVerified, isGuest } = useAuth();
  const [loading, setLoading] = useState(false);

  // No mostrar el banner si:
  // - El usuario no está autenticado
  // - El email ya está verificado
  // - El usuario es invitado (no tiene email que verificar)
  if (!user || isEmailVerified || isGuest) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      await authService.resendVerificationEmail(user.email);
      Alert.alert(
        'Email enviado',
        'Te hemos reenviado el correo de verificación. Por favor, revisa tu bandeja de entrada y spam.'
      );
    } catch {
      Alert.alert(
        'Error',
        'No pudimos reenviar el email. Por favor, intenta nuevamente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📧</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Verifica tu email</Text>
          <Text style={styles.message}>
            Para crear reportes y usar todas las funciones, verifica tu correo electrónico.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleResendEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Enviando...' : 'Reenviar email'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
