import { resetPasswordSchema } from '@/src/shared/validation/schemas';
import { Formik } from 'formik';
import React from 'react';
import { Button, Input, Stack, Text } from 'tamagui';

interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormData) => void;
  loading: boolean;
}

export function ResetPasswordForm({ onSubmit, loading }: ResetPasswordFormProps) {
  const initialValues: ResetPasswordFormData = {
    password: '',
    passwordConfirmation: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <Stack space="$4" width="100%" maxWidth={300}>
          <Stack space="$1">
            <Input
              placeholder="Nueva Contraseña"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              size="$4"
              backgroundColor="white"
              borderColor={touched.password && errors.password ? '$red8' : 'white'}
            />
            {touched.password && errors.password && (
              <Text color="$red8" fontSize="$2">{errors.password}</Text>
            )}
          </Stack>

          <Stack space="$1">
            <Input
              placeholder="Confirmar Nueva Contraseña"
              value={values.passwordConfirmation}
              onChangeText={handleChange('passwordConfirmation')}
              onBlur={handleBlur('passwordConfirmation')}
              secureTextEntry
              size="$4"
              backgroundColor="white"
              borderColor={touched.passwordConfirmation && errors.passwordConfirmation ? '$red8' : 'white'}
            />
            {touched.passwordConfirmation && errors.passwordConfirmation && (
              <Text color="$red8" fontSize="$2">{errors.passwordConfirmation}</Text>
            )}
          </Stack>

          <Button
            size="$4"
            backgroundColor="$yellow8"
            color="$gray12"
            fontWeight="600"
            borderRadius="$6"
            pressStyle={{ backgroundColor: '$yellow9' }}
            onPress={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
