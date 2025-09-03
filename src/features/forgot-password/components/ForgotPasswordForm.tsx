import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Formik } from 'formik';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { FormField } from './FormField';
import { forgotPasswordSchema } from '../../../common/validation/schemas';

interface ForgotPasswordFormValues {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  onBackToLogin,
}) => {
  const initialValues: ForgotPasswordFormValues = {
    email: '',
  };

  const handleFormSubmit = (values: ForgotPasswordFormValues) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleFormSubmit}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldTouched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>
            Recuperar Contraseña
          </Text>
          
          <Text style={styles.description}>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </Text>

          <FormField
            label="Email"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={() => setFieldTouched('email')}
            error={touched.email && errors.email ? errors.email : ''}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit()}
          />

          <ForgotPasswordButton
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={loading}
          />

          {onBackToLogin && (
            <Text style={styles.backText}>
              ¿Recordaste tu contraseña?{' '}
              <Text style={styles.backLink} onPress={onBackToLogin}>
                Inicia sesión
              </Text>
            </Text>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginTop: 24,
  },
  backLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
