import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Stack, Text } from 'tamagui';
import { FormField } from '../../../shared/components';
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

export function RegisterForm({
  onSubmit,
  loading = false,
  onBackToLogin,
}: RegisterFormProps) {
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
    <Stack width="100%" padding="$4" space="$4">
      <Text
        fontSize="$9"
        fontWeight="bold"
        textAlign="center"
        color="$gray12"
        marginBottom="$2"
      >
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
        <Text
          fontSize="$3"
          color="$red10"
          textAlign="center"
          marginTop="$2"
        >
          {errors.acceptTerms}
        </Text>
      )}

      <RegisterButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.acceptTerms}
      />

      {onBackToLogin && (
        <Button
          backgroundColor="transparent"
          color="$blue10"
          fontSize="$3"
          padding="$2"
          marginTop="$2"
          onPress={onBackToLogin}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      )}
    </Stack>
  );
}
