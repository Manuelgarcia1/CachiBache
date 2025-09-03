import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppLogo } from '../../auth/components/AppLogo';
import { RegisterForm } from './RegisterForm';
import type { RegisterFormValues } from './RegisterForm';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
  scrollViewRef?: React.RefObject<KeyboardAwareScrollView>;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onBackToLogin,
  scrollViewRef,
}) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: RegisterFormValues): Promise<void> => {
    setLoading(true);
    
    try {
      // Aquí iría la lógica de registro con tu API
      console.log('Datos del formulario:', formData);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Si el registro es exitoso
      console.log('Usuario registrado exitosamente');
      
      // Mostrar alerta de éxito
      return new Promise((resolve) => {
        Alert.alert(
          '¡Registro exitoso!',
          'Tu cuenta ha sido creada correctamente. Por favor inicia sesión para continuar.',
          [
            {
              text: 'Aceptar',
              onPress: () => {
                onRegisterSuccess?.();
                resolve();
              }
            }
          ]
        );
      });
      
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al registrar tu cuenta. Por favor, inténtalo de nuevo.');
      throw error; // Re-lanzar el error para que Formik lo maneje
    } finally {
      setLoading(false);
    }
  };

  const internalScrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const activeScrollViewRef = scrollViewRef || internalScrollViewRef;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAwareScrollView
        ref={activeScrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100} // Espacio adicional para asegurar que el campo sea visible
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={150} // Altura adicional para asegurar que el campo sea visible
      >
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Logo y título */}
          <View style={styles.header}>
            <AppLogo />
            <Text style={styles.title}>
              Únete a CachiBache
            </Text>
            <Text style={styles.subtitle}>
              Reporta baches en tu ciudad y ayuda a mejorar las calles
            </Text>
          </View>

          {/* Formulario de registro */}
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onBackToLogin={onBackToLogin}
            scrollViewRef={scrollViewRef}
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
