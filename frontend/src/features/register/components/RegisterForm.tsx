// Ubicación: src/features/register/components/RegisterForm.tsx

import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

// Imports con alias que configuramos previamente
import { FormField } from '@sharedcomponents/index';
import { registerSchema } from '@sharedvalidation/schemas';

// Imports de componentes locales
import { RegisterButton } from './RegisterButton';
import { TermsCheckbox } from './TermsCheckbox';

// Interface de las props que el componente recibe
interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
}

// Interface de la data del formulario
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

  // Función para mostrar la alerta de términos
  const handleTermsPress = () => {
    Alert.alert(
      'Términos y Condiciones',
      'Aquí se mostraría el texto completo de los términos y condiciones de uso de la aplicación.'
    );
  };

  // Valores iniciales para el formulario
  const initialValues: RegisterFormData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  };

  // Función que se ejecuta cuando el formulario es válido y se envía
  const handleFormSubmit = (
    values: RegisterFormData,
    { setSubmitting }: FormikHelpers<RegisterFormData>
  ) => {
    onSubmit(values); // Llama a la función del padre (RegisterScreen)
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View style={styles.formContainer}>
          {/* Campo de Nombre Completo */}
          <FormField
            label="Nombre Completo"
            placeholder="Ingresa tu nombre completo"
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            error={touched.fullName ? errors.fullName : undefined}
            autoCapitalize="words"
          />

          {/* Campo de Email */}
          <FormField
            label="Email"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            keyboardType="email-address"
          />

          {/* Campo de Contraseña */}
          <FormField
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            secureTextEntry
          />

          {/* Campo de Confirmar Contraseña */}
          <FormField
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            secureTextEntry
          />

          {/* Campo de Teléfono */}
          <FormField
            label="Teléfono"
            placeholder="+54 9 11 1234-5678"
            value={values.phone}
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={touched.phone ? errors.phone : undefined}
            keyboardType="phone-pad"
          />

          {/* Checkbox de Términos y Condiciones */}
          <View>
            <TermsCheckbox
              checked={values.acceptTerms}
              onCheckedChange={(checked) => setFieldValue('acceptTerms', checked)}
              onTermsPress={handleTermsPress}
            />
            {touched.acceptTerms && errors.acceptTerms && (
              <Text style={styles.errorText}>{errors.acceptTerms}</Text>
            )}
          </View>

          {/* Botón de Registro */}
          <RegisterButton
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={!values.acceptTerms}
          />

          {/* Enlace para volver a Iniciar Sesión */}
          {onBackToLogin && (
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.backLink}>
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  );
}

// Estilos definidos con StyleSheet para mantener la consistencia visual
const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    color: '#FBBF24', // Color amarillo para errores
    marginTop: -10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  backLink: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
});