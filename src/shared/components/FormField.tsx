// Ubicación: src/shared/components/FormField.tsx

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'; // Componentes de React Native para UI.

// Define las propiedades que el componente FormField puede recibir, extendiendo las de TextInput.
interface FormFieldProps extends TextInputProps {
  label: string; // Etiqueta del campo de formulario.
  error?: string; // Mensaje de error a mostrar, si existe.
}

// Componente funcional genérico para un campo de formulario.
export function FormField({
  label, // La etiqueta del campo.
  error, // El mensaje de error.
  ...textInputProps // Todas las demás propiedades de TextInput se pasan directamente.
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]} // Aplica estilos base y de error condicionalmente.
        placeholderTextColor="#9CA3AF" // Color del texto del placeholder.
        {...textInputProps} // Pasa todas las props restantes al TextInput (value, onChangeText, etc.).
      />
      {/* Muestra el mensaje de error si existe. */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Estilos definidos con StyleSheet para el componente FormField.
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12, // Bordes más redondeados.
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827', // Texto oscuro.
    borderWidth: 2,
    borderColor: 'transparent', // Sin borde por defecto.
  },
  inputError: {
    borderColor: '#EF4444', // Borde rojo para indicar un error.
  },
  errorText: {
    fontSize: 14,
    color: '#FBBF24', // Amarillo para errores.
    marginTop: 4,
  },
});
