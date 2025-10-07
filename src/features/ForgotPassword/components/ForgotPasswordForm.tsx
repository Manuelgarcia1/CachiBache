// Ubicación: src/features/ForgotPassword/components/ForgotPasswordForm.tsx

import { FormField } from '@sharedcomponents/index'; // Importa el componente genérico de campo de formulario.
import { forgotPasswordSchema } from '@sharedvalidation/schemas'; // Importa el esquema de validación para el formulario.
import { Formik, FormikHelpers } from 'formik'; // Herramientas de Formik para la gestión de formularios.
import React from 'react';
import { Text, YStack } from 'tamagui'; // Componentes de UI de Tamagui para el layout.
import { ForgotPasswordButton } from './ForgotPasswordButton'; // Importa el botón de recuperación de contraseña.

// Define las propiedades que el componente ForgotPasswordForm puede recibir.
interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void; // Función que se ejecuta al enviar el formulario.
  loading?: boolean; // Indica si el formulario está en estado de carga.
}

// Define la estructura de los valores del formulario.
interface ForgotPasswordValues {
  email: string; // Campo para el email del usuario.
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit, // Función para manejar el envío del email.
  loading = false, // Estado de carga del formulario.
}) => {
  // Valores iniciales del formulario.
  const initialValues: ForgotPasswordValues = {
    email: '',
  };

  // Función que se ejecuta al enviar el formulario.
  const handleSubmit = (
    values: ForgotPasswordValues,
    { setSubmitting }: FormikHelpers<ForgotPasswordValues>
  ) => {
    onSubmit(values.email); // Llama a la función onSubmit pasada por props.
    setSubmitting(false); // Indica que el envío ha terminado.
  };

  return (
    // Componente Formik para la gestión del formulario.
    <Formik
      initialValues={initialValues} // Valores iniciales.
      validationSchema={forgotPasswordSchema} // Esquema de validación de Yup.
      onSubmit={handleSubmit} // Función a ejecutar al enviar.
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        // Contenedor principal del formulario con estilos de Tamagui.
        <YStack width="100%" maxWidth={400} paddingHorizontal="$2" space="$5">
          {/* Sección de títulos y textos descriptivos. */}
          <YStack space="$2" alignItems="center">
            <Text
              fontSize="$8" // Tamaño de fuente.
              fontWeight="bold"
              textAlign="center"
              color="white"
            >
              Recuperar Contraseña
            </Text>
            
            <Text
              fontSize="$4"
              color="white" // Color del texto.
              opacity={0.8}
              textAlign="center"
              paddingHorizontal="$4"
            >
              Ingresa tu email y te enviaremos un enlace para restablecerla
            </Text>
          </YStack>

          {/* Campo de formulario para el email. */}
          <FormField
            label="Email"
            placeholder="tu@email.com"
            value={values.email}
            onChangeText={handleChange('email')} // Maneja el cambio de texto.
            onBlur={handleBlur('email')} // Maneja el evento de desenfoque.
            error={touched.email ? errors.email : undefined} // Muestra error si el campo ha sido tocado y hay un error.
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit()} // Envía el formulario al presionar "done".
          />

          {/* Botón para enviar el formulario de recuperación de contraseña. */}
          <ForgotPasswordButton
            onPress={() => handleSubmit()} // Asigna la función de envío.
            loading={loading} // Pasa el estado de carga.
            disabled={!values.email || !!errors.email} // Deshabilita si el email está vacío o tiene errores.
          />
          
          {/* ELIMINADO: El enlace de texto de "Inicia sesión" se quita de aquí */}
        </YStack>
      )}
    </Formik>
  );
};
