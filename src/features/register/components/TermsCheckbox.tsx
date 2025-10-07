// Ubicación: src/features/register/components/TermsCheckbox.tsx

import { Feather } from '@expo/vector-icons'; // Importa el ícono de "check" de Feather.
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define las propiedades que el componente TermsCheckbox puede recibir.
interface TermsCheckboxProps {
  checked: boolean; // Indica si el checkbox está marcado.
  onCheckedChange: (checked: boolean) => void; // Función que se ejecuta al cambiar el estado del checkbox.
  onTermsPress: () => void; // Función que se ejecuta al presionar los enlaces de términos.
}

// Componente funcional para el checkbox de términos y condiciones.
export function TermsCheckbox({
  checked,
  onCheckedChange,
  onTermsPress,
}: TermsCheckboxProps) {
  return (
    // Contenedor principal del checkbox, hecho clickeable con TouchableOpacity.
    <TouchableOpacity
      style={styles.container}
      onPress={() => onCheckedChange(!checked)} // Invierte el estado `checked` al presionar.
      activeOpacity={0.7}
    >
      {/* La caja visual del checkbox. */}
      <View style={[styles.box, checked && styles.boxChecked]}>
        {/* Muestra el ícono de "check" si el checkbox está marcado. */}
        {checked && <Feather name="check" size={18} color="#3b82f6" />}
      </View>

      {/* Contenedor para el texto de los términos y condiciones. */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Acepto los{' '}
          {/* Enlace clickeable para los términos y condiciones. */}
          <Text style={styles.linkText} onPress={onTermsPress}>
            términos y condiciones
          </Text>
          {' '}y la{' '}
          {/* Enlace clickeable para la política de privacidad. */}
          <Text style={styles.linkText} onPress={onTermsPress}>
            política de privacidad
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Estilos definidos con StyleSheet para el componente.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Alinea los elementos horizontalmente.
    alignItems: 'flex-start', // Alinea los elementos al inicio.
    marginVertical: 16,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    backgroundColor: 'white', // Fondo blanco cuando está seleccionado.
    borderColor: 'white',
  },
  textContainer: {
    flex: 1, // Permite que el texto se ajuste al espacio disponible.
  },
  text: {
    fontSize: 14,
    color: 'white',
  },
  linkText: {
    color: '#FACC15', // Amarillo para los enlaces.
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Subraya el texto para indicar que es un enlace.
  },
});
