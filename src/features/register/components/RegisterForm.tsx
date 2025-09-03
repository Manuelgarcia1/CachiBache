import React, { useState, useRef } from 'react';
import { 
  Alert, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  TextInput, 
  NativeSyntheticEvent, 
  TextInputFocusEventData 
} from 'react-native';
import { FormField } from './FormField';
import { RegisterButton } from './RegisterButton';
import { TermsCheckbox } from './TermsCheckbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
  scrollViewRef?: React.RefObject<KeyboardAwareScrollView>;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  onBackToLogin,
  scrollViewRef,
}) => {
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

  const inputRefs = useRef<{[key: string]: TextInput | null}>({});

  const scrollToInput = (reactNode: any) => {
    if (!scrollViewRef?.current || !reactNode) return;
    
    // Usar requestAnimationFrame para asegurar que el layout esté listo
    requestAnimationFrame(() => {
      // Usar measure para obtener la posición exacta del elemento
      reactNode.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        // Calcular la posición a la que debemos desplazarnos
        const scrollToY = Math.max(0, pageY - 100); // 100px de margen superior
        
        // Usar scrollToPosition para un desplazamiento más preciso
        scrollViewRef.current?.scrollToPosition(0, scrollToY, true);
      });
    });
  };
  
  // Función para manejar la referencia de los inputs
  const setInputRef = (name: string) => (ref: TextInput | null) => {
    if (ref) {
      inputRefs.current[name] = ref;
    }
  };
  
  // Función para manejar el foco en un campo
  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>, nextField?: string) => {
    // Desplazar al campo actual
    const target = event.target as any; // Necesario para el tipado de measure
    
    // Usar measure para obtener la posición del elemento
    target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      if (scrollViewRef?.current) {
        // Desplazar a la posición del campo con un pequeño offset
        scrollViewRef.current.scrollToPosition(0, pageY - 100, true);
      }
    });
    
    // Configurar el botón de siguiente
    if (nextField && inputRefs.current[nextField]) {
      // Configurar el botón de siguiente para que enfoque el siguiente campo
      const currentInput = event.currentTarget;
      currentInput.setNativeProps({
        returnKeyType: 'next',
        blurOnSubmit: false,
        onSubmitEditing: () => {
          // Enfocar el siguiente campo
          const nextInput = inputRefs.current[nextField];
          if (nextInput) {
            nextInput.focus();
            // Usar un pequeño retraso para asegurar que el teclado se haya actualizado
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
      // Últ campo: cambiar a 'done'
      event.currentTarget.setNativeProps({
        returnKeyType: 'done',
        blurOnSubmit: true
      });
    }
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
    <View style={styles.container}>
      <Text style={styles.title}>
        Crear Cuenta
      </Text>
      
      <FormField
        label="Nombre Completo"
        placeholder="Ingresa tu nombre completo"
        value={formData.fullName}
        onChangeText={(text) => updateField('fullName', text)}
        error={errors.fullName}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.current.email?.focus()}
        inputRef={setInputRef('fullName')}
        onFocus={(event) => handleFocus(event, 'email')}
      />

      <FormField
        label="Email"
        placeholder="tu@email.com"
        value={formData.email}
        onChangeText={(text) => updateField('email', text)}
        error={errors.email}
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.current.password?.focus()}
        inputRef={setInputRef('email')}
        onFocus={(event) => handleFocus(event, 'password')}
      />

      <FormField
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        value={formData.password}
        onChangeText={(text) => updateField('password', text)}
        error={errors.password}
        secureTextEntry
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.current.confirmPassword?.focus()}
        inputRef={setInputRef('password')}
        onFocus={(event) => handleFocus(event, 'confirmPassword')}
      />

      <FormField
        label="Confirmar Contraseña"
        placeholder="Repite tu contraseña"
        value={formData.confirmPassword}
        onChangeText={(text) => updateField('confirmPassword', text)}
        error={errors.confirmPassword}
        secureTextEntry
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.current.phone?.focus()}
        inputRef={setInputRef('confirmPassword')}
        onFocus={(event) => handleFocus(event, 'phone')}
      />

      <FormField
        label="Teléfono"
        placeholder="+54 9 11 1234-5678"
        value={formData.phone}
        onChangeText={(text) => updateField('phone', text)}
        error={errors.phone}
        keyboardType="phone-pad"
        returnKeyType="done"
        inputRef={setInputRef('phone')}
        onFocus={(event) => handleFocus(event)}
      />

      <TermsCheckbox
        checked={formData.acceptTerms}
        onCheckedChange={(checked) => updateField('acceptTerms', checked)}
        onTermsPress={handleTermsPress}
      />

      {errors.acceptTerms && (
        <Text style={styles.errorText}>
          {errors.acceptTerms}
        </Text>
      )}

      <RegisterButton
        onPress={handleSubmit}
        loading={loading}
        disabled={!formData.acceptTerms}
      />

      {onBackToLogin && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackToLogin}
        >
          <Text style={styles.backButtonText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      )}
    </View>
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
