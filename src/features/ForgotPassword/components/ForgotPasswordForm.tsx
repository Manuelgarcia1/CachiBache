import { FormField } from '@sharedcomponents/index';
import { forgotPasswordSchema } from '@sharedvalidation/schemas';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
// CAMBIO: Usamos YStack para un mejor control del layout
import { YStack, Text } from 'tamagui'; 
import { ForgotPasswordButton } from './ForgotPasswordButton';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

interface ForgotPasswordValues {
  email: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const initialValues: ForgotPasswordValues = {
    email: '',
  };

  const handleSubmit = (
    values: ForgotPasswordValues,
    { setSubmitting }: FormikHelpers<ForgotPasswordValues>
  ) => {
    onSubmit(values.email);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        // --- CAMBIOS DE ESTILO AQUÍ ---
        <YStack width="100%" maxWidth={400} paddingHorizontal="$2" space="$5">
          {/* Títulos y textos mejorados */}
          <YStack space="$2" alignItems="center">
            <Text
              fontSize="$8" // Más grande y consistente
              fontWeight="bold"
              textAlign="center"
              color="white"
            >
              Recuperar Contraseña
            </Text>
            
            <Text
              fontSize="$4"
              color="white" // Mejor contraste
              opacity={0.8}
              textAlign="center"
              paddingHorizontal="$4"
            >
              Ingresa tu email y te enviaremos un enlace para restablecerla
            </Text>
          </YStack>

          {/* El FormField usará automáticamente los nuevos estilos de StyleSheet */}
          <FormField
            label="Email"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit()}
          />

          <ForgotPasswordButton
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={!values.email || !!errors.email}
          />
          
          {/* ELIMINADO: El enlace de texto de "Inicia sesión" se quita de aquí */}
        </YStack>
      )}
    </Formik>
  );
};