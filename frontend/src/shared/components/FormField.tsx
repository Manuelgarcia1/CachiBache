// Ubicación: src/shared/components/FormField.tsx

import React from 'react';
// 1. Imports de React Native
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

// Extendemos las props de TextInput para máxima flexibilidad
interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({
  label,
  error,
  ...textInputProps // Pasamos el resto de las props al TextInput
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#9CA3AF" // Un gris suave para el placeholder
        {...textInputProps} // Aplicamos props como value, onChangeText, etc.
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// 2. Estilos definidos con StyleSheet
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
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 2,
    borderColor: 'transparent',
    height: 55,
  },
  inputError: {
    borderColor: '#EF4444', // Borde rojo para errores
  },
  errorText: {
    fontSize: 14,
    color: '#FBBF24', // Amarillo para errores, para no usar rojo sobre azul
    marginTop: 4,
  },
});