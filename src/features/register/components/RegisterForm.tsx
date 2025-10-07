// Ubicación: src/features/register/components/RegisterForm.tsx

import { Formik, FormikHelpers } from 'formik'; // Herramientas de Formik para la gestión de formularios.
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Imports con alias que configuramos previamente
import { FormField } from '@sharedcomponents/index'; // Importa el componente genérico de campo de formulario.
import { registerSchema } from '@sharedvalidation/schemas'; // Importa el esquema de validación para el formulario de registro.

// Imports de componentes locales
import { RegisterButton } from './RegisterButton'; // Importa el botón de registro.
import { TermsCheckbox } from './TermsCheckbox'; // Importa el componente de checkbox para términos y condiciones.

// Interface de las props que el componente recibe.
interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void; // Función que se ejecuta al enviar el formulario.
  loading?: boolean; // Indica si el formulario está en estado de carga.
  onBackToLogin?: () => void; // Función opcional para navegar de vuelta al login.
}

// Interface de la data del formulario de registro.
export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

// Componente funcional para el formulario de registro.
export function RegisterForm({
  onSubmit,
  loading = false,
  onBackToLogin,
}: RegisterFormProps) {

  // Función para mostrar la alerta de términos y condiciones.
  const handleTermsPress = () => {
    Alert.alert(
      'Términos y Condiciones',
      'Aquí se mostraría el texto completo de los términos y condiciones de uso de la aplicación.'
    );
  };

  // Valores iniciales para el formulario.
  const initialValues: RegisterFormData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  };

  // Función que se ejecuta cuando el formulario es válido y se envía.
  const handleFormSubmit = (
    values: RegisterFormData,
    { setSubmitting }: FormikHelpers<RegisterFormData>
  ) => {
    onSubmit(values); // Llama a la función onSubmit pasada por props (en RegisterScreen).
    setSubmitting(false); // Indica que el envío ha terminado.
  };

  return (
    // Componente Formik para la gestión del formulario.
    <Formik
      initialValues={initialValues} // Valores iniciales.
      validationSchema={registerSchema} // Esquema de validación de Yup.
      onSubmit={handleFormSubmit} // Función a ejecutar al enviar.
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
        // Contenedor principal del formulario.
        <View style={styles.formContainer}>
          {/* Campo de Nombre Completo */}
          <FormField
            label="Nombre Completo"
            placeholder="Ingresa tu nombre completo"
            value={values.fullName}
            onChangeText={handleChange('fullName')} // Maneja el cambio de texto.
            onBlur={handleBlur('fullName')} // Maneja el evento de desenfoque.
            error={touched.fullName ? errors.fullName : undefined} // Muestra error si el campo ha sido tocado y hay un error.
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
              onCheckedChange={(checked) => setFieldValue('acceptTerms', checked)} // Actualiza el valor del checkbox.
              onTermsPress={handleTermsPress} // Abre la alerta de términos.
            />
            {/* Muestra error si el checkbox ha sido tocado y no está marcado. */}
            {touched.acceptTerms && errors.acceptTerms && (
              <Text style={styles.errorText}>{errors.acceptTerms}</Text>
            )}
          </View>

          {/* Botón de Registro */}
          <RegisterButton
            onPress={() => handleSubmit()} // Asigna la función de envío.
            loading={loading} // Pasa el estado de carga.
            disabled={!values.acceptTerms} // Deshabilita si los términos no han sido aceptados.
          />

          {/* Enlace para volver a Iniciar Sesión (condicional). */}
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

// Estilos definidos con StyleSheet para mantener la consistencia visual.
const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    color: '#FBBF24', // Color amarillo para errores.
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
