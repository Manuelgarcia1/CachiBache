import { FormField } from '@sharedcomponents/index';
import { forgotPasswordSchema } from '@sharedvalidation/schemas';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
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
        <YStack width="100%" maxWidth={400} paddingHorizontal="$4" space="$4">
          <YStack space="$3" alignItems="center">
            <Text
              fontSize="$8"
              fontWeight="bold"
              textAlign="center"
              color="#ffffff"
            >
              Recuperar Contraseña
            </Text>

            <Text
              fontSize="$5"
              color="#ffffff"
              opacity={0.9}
              textAlign="center"
              paddingHorizontal="$2"
              lineHeight={22}
            >
              Ingresa tu email y te enviaremos un código para restablecerla
            </Text>
          </YStack>

          <YStack space="$4">
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
          </YStack>
        </YStack>
      )}
    </Formik>
  );
};