import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '../../auth/components/AppLogo';
import { RegisterForm, RegisterFormData } from './RegisterForm';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    
    try {
      // Aquí iría la lógica de registro con tu API
      console.log('Datos del formulario:', formData);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Si el registro es exitoso
      console.log('Usuario registrado exitosamente');
      onRegisterSuccess?.();
      
    } catch (error) {
      console.error('Error en el registro:', error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
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
          />
        </View>
      </ScrollView>
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
