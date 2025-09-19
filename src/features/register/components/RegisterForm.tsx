import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Alert } from 'react-native';
import { Stack, Text } from 'tamagui';
import { FormField } from '@sharedcomponents/index';
import { registerSchema } from '@sharedvalidation/schemas';
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
  const handleTermsPress = () => {
    Alert.alert('Términos y Condiciones', 'Aquí irían los términos y condiciones de la aplicación.');
  };

  const initialValues: RegisterFormData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  };

  const handleSubmit = (values: RegisterFormData, { setSubmitting }: FormikHelpers<RegisterFormData>) => {
    Alert.alert('Formulario enviado', '¡Gracias por registrarte!');
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <Stack width="100%" space="$4" marginBottom="$8">
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
            value={values.fullName}
            onChangeText={(text: string) => setFieldValue('fullName', text)}
            onBlur={handleBlur('fullName')}
            error={touched.fullName ? errors.fullName : undefined}
            autoCapitalize="words"
          />

          <FormField
            label="Email"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={(text: string) => setFieldValue('email', text)}
            onBlur={handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            keyboardType="email-address"
          />

          <FormField
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={values.password}
            onChangeText={(text: string) => setFieldValue('password', text)}
            onBlur={handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            secureTextEntry
          />

          <FormField
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={values.confirmPassword}
            onChangeText={(text: string) => setFieldValue('confirmPassword', text)}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            secureTextEntry
          />

          <FormField
            label="Teléfono"
            placeholder="+54 9 11 1234-5678"
            value={values.phone}
            onChangeText={(text: string) => setFieldValue('phone', text)}
            onBlur={handleBlur('phone')}
            error={touched.phone ? errors.phone : undefined}
            keyboardType="phone-pad"
          />

          <Stack>
            <TermsCheckbox
              checked={values.acceptTerms}
              onCheckedChange={(checked) => setFieldValue('acceptTerms', checked, true)}
              onTermsPress={handleTermsPress}
            />
            {touched.acceptTerms && errors.acceptTerms && (
              <Text color="$red10" fontSize="$2" marginTop="$1">
                {errors.acceptTerms}
              </Text>
            )}
          </Stack>

          <RegisterButton
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={!values.acceptTerms}
          />

          {onBackToLogin && (
            <Text
              color="$blue10"
              fontSize="$3"
              textAlign="center"
              marginTop="$2"
              onPress={onBackToLogin}
              textDecorationLine="underline"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          )}
        </Stack>
      )}
    </Formik>
  );
}
