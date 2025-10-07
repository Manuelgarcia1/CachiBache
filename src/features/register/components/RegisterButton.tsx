// Ubicación: src/features/register/components/RegisterButton.tsx

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

// Define las propiedades que el componente RegisterButton puede recibir.
interface RegisterButtonProps {
  onPress: () => void; // Función que se ejecuta al presionar el botón.
  disabled?: boolean; // Indica si el botón debe estar deshabilitado.
  loading?: boolean; // Indica si el botón está en estado de carga.
  title?: string; // Texto a mostrar en el botón.
}

// Componente funcional para el botón de "Crear Cuenta" en el registro.
export function RegisterButton({
  onPress,
  disabled = false,
  loading = false,
  title = 'Crear Cuenta',
}: RegisterButtonProps) {
  // Determina si el botón debe estar deshabilitado (ya sea por `disabled` o `loading`).
  const isDisabled = disabled || loading;

  return (
    // Componente TouchableOpacity para hacer el botón clickeable.
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]} // Aplica estilos base y de deshabilitado.
      onPress={onPress} // Asigna la función onPress.
      disabled={isDisabled} // Deshabilita el botón si `isDisabled` es true.
    >
      {/* Muestra un ActivityIndicator si está cargando, de lo contrario muestra el texto. */}
      {loading ? (
        <ActivityIndicator size="small" color="#111827" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Estilos definidos con StyleSheet para el botón.
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FACC15', // Amarillo principal.
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.6, // Reduce la opacidad cuando está deshabilitado.
  },
  buttonText: {
    color: '#111827', // Texto oscuro.
    fontSize: 16,
    fontWeight: 'bold',
  },
});
