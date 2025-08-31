import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormField } from './FormField';
import { RegisterButton } from './RegisterButton';
import { TermsCheckbox } from './TermsCheckbox';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  onBackToLogin,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleTermsPress = () => {
    // Aquí puedes navegar a la pantalla de términos
    Alert.alert('Términos y Condiciones', 'Aquí irían los términos y condiciones de la aplicación.');
  };

  const updateField = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Crear Cuenta
      </Text>
      
      <FormField
        label="Nombre Completo"
        placeholder="Ingresa tu nombre completo"
        value={formData.fullName}
        onChangeText={(text) => updateField('fullName', text)}
        error={errors.fullName}
        autoCapitalize="words"
      />

      <FormField
        label="Email"
        placeholder="tu@email.com"
        value={formData.email}
        onChangeText={(text) => updateField('email', text)}
        error={errors.email}
        keyboardType="email-address"
      />

      <FormField
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        value={formData.password}
        onChangeText={(text) => updateField('password', text)}
        error={errors.password}
        secureTextEntry
      />

      <FormField
        label="Confirmar Contraseña"
        placeholder="Repite tu contraseña"
        value={formData.confirmPassword}
        onChangeText={(text) => updateField('confirmPassword', text)}
        error={errors.confirmPassword}
        secureTextEntry
      />

      <FormField
        label="Teléfono"
        placeholder="+54 9 11 1234-5678"
        value={formData.phone}
        onChangeText={(text) => updateField('phone', text)}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <TermsCheckbox
        checked={formData.acceptTerms}
        onCheckedChange={(checked) => updateField('acceptTerms', checked)}
        onTermsPress={handleTermsPress}
      />

      {errors.acceptTerms && (
        <Text style={styles.errorText}>
          {errors.acceptTerms}
        </Text>
      )}

      <RegisterButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.acceptTerms}
      />

      {onBackToLogin && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackToLogin}
        >
          <Text style={styles.backButtonText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 8,
  },
  backButton: {
    padding: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 14,
    textAlign: 'center',
  },
});
