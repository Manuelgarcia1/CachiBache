import React, { useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormField } from './FormField';
import { RegisterButton } from './RegisterButton';
import { TermsCheckbox } from './TermsCheckbox';
import { registerSchema } from '../../../common/validation/schemas';

export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
  loading?: boolean;
  onBackToLogin?: () => void;
  scrollViewRef?: React.RefObject<KeyboardAwareScrollView>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  onBackToLogin,
  scrollViewRef,
}) => {
  const inputRefs = useRef<{[key: string]: any}>({});

  const initialValues: RegisterFormValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  };

  const handleTermsPress = () => {
    // Aquí puedes navegar a la pantalla de términos
    Alert.alert('Términos y Condiciones', 'Aquí irían los términos y condiciones de la aplicación.');
  };

  const scrollToInput = (reactNode: any) => {
    if (!scrollViewRef?.current || !reactNode) return;
    
    requestAnimationFrame(() => {
      reactNode.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const scrollToY = Math.max(0, pageY - 100);
        scrollViewRef.current?.scrollToPosition(0, scrollToY, true);
      });
    });
  };

  const handleFieldFocus = (event: any, nextField?: string) => {
    const target = event.target;
    
    target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      if (scrollViewRef?.current) {
        scrollViewRef.current.scrollToPosition(0, pageY - 100, true);
      }
    });
    
    if (nextField && inputRefs.current[nextField]) {
      const currentInput = event.currentTarget;
      currentInput.setNativeProps({
        returnKeyType: 'next',
        blurOnSubmit: false,
        onSubmitEditing: () => {
          const nextInput = inputRefs.current[nextField];
          if (nextInput) {
            nextInput.focus();
            setTimeout(() => {
              nextInput.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                if (scrollViewRef?.current) {
                  scrollViewRef.current.scrollToPosition(0, pageY - 100, true);
                }
              });
            }, 50);
          }
        }
      });
    } else {
      event.currentTarget.setNativeProps({
        returnKeyType: 'done',
        blurOnSubmit: true
      });
    }
  };

  const setInputRef = (name: string) => (ref: any) => {
    if (ref) {
      inputRefs.current[name] = ref;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await onSubmit(values);
          // No necesitamos resetear el formulario aquí ya que la navegación
          // se manejará en el onPress del botón Aceptar de la alerta
        } catch (error) {
          // El error ya se maneja en el componente padre
        }
      }}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {({ 
        handleChange, 
        handleBlur, 
        handleSubmit, 
        values, 
        errors, 
        touched,
        setFieldValue,
        setFieldTouched
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>
            Crear Cuenta
          </Text>
          
          <FormField
            label="Nombre Completo"
            placeholder="Ingresa tu nombre completo"
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            onBlur={() => setFieldTouched('fullName')}
            error={touched.fullName && errors.fullName ? errors.fullName : ''}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.current.email?.focus()}
            inputRef={setInputRef('fullName')}
            onFocus={(event: any) => handleFieldFocus(event, 'email')}
          />

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
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.current.password?.focus()}
            inputRef={setInputRef('email')}
            onFocus={(event: any) => handleFieldFocus(event, 'password')}
          />

          <FormField
            label="Contraseña"
            placeholder="Crea una contraseña segura"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={() => setFieldTouched('password')}
            error={touched.password && errors.password ? errors.password : ''}
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.current.confirmPassword?.focus()}
            inputRef={setInputRef('password')}
            onFocus={(event: any) => handleFieldFocus(event, 'confirmPassword')}
          />

          <FormField
            label="Confirmar Contraseña"
            placeholder="Vuelve a escribir tu contraseña"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={() => setFieldTouched('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => inputRefs.current.phone?.focus()}
            inputRef={setInputRef('confirmPassword')}
            onFocus={(event: any) => handleFieldFocus(event, 'phone')}
          />

          <FormField
            label="Teléfono"
            placeholder="Ingresa tu número de teléfono"
            value={values.phone}
            onChangeText={handleChange('phone')}
            onBlur={() => setFieldTouched('phone')}
            error={touched.phone && errors.phone ? errors.phone : ''}
            keyboardType="phone-pad"
            returnKeyType="done"
            inputRef={setInputRef('phone')}
            onFocus={(event: any) => handleFieldFocus(event)}
          />

          <TermsCheckbox
            value={values.acceptTerms}
            onValueChange={(value) => setFieldValue('acceptTerms', value)}
            error={touched.acceptTerms && !!errors.acceptTerms}
            onTermsPress={handleTermsPress}
          />
          {touched.acceptTerms && errors.acceptTerms && (
            <Text style={styles.errorText}>{errors.acceptTerms}</Text>
          )}

          <RegisterButton
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={Object.keys(errors).length > 0 && Object.keys(touched).length > 0}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
  },
  termsLink: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#4b5563',
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: '600',
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
