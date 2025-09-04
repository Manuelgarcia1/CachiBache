import React from 'react';
import { Stack, Text } from 'tamagui';
import { Formik, FormikHelpers } from 'formik';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { FormField } from '../../../shared/components';
import { forgotPasswordSchema } from '../../../shared/validation/schemas';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
}

interface ForgotPasswordValues {
  email: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  onBackToLogin,
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
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <Stack space="$4" width="100%" maxWidth={400} padding="$4" marginBottom="$8">
          <Stack space="$3" alignItems="center">
            <Text
              fontSize="$7"
              fontWeight="600"
              textAlign="center"
              color="white"
            >
              Recuperar Contraseña
            </Text>
            
            <Text
              fontSize="$4"
              color="$blue3"
              textAlign="center"
              lineHeight="$1"
              paddingHorizontal="$4"
            >
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </Text>
          </Stack>

          <FormField
            label="Email"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={(text: string) => setFieldValue('email', text)}
            onBlur={handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit()}
            blurOnSubmit={true}
          />

          <ForgotPasswordButton
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={!values.email.trim()}
          />

          {onBackToLogin && (
            <Text
              fontSize="$4"
              color="white"
              textAlign="center"
              marginTop="$4"
            >
              ¿Recordaste tu contraseña?{' '}
              <Text
                color="$yellow8"
                fontWeight="600"
                onPress={onBackToLogin}
                textDecorationLine="underline"
              >
                Inicia sesión
              </Text>
            </Text>
          )}
        </Stack>
      )}
    </Formik>
  );
};
