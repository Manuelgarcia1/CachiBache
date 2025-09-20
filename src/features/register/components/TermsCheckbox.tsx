// Ubicación: src/features/register/components/TermsCheckbox.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// 1. Importamos el ícono que usaremos
import { Feather } from '@expo/vector-icons';

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onTermsPress: () => void;
}

export function TermsCheckbox({
  checked,
  onCheckedChange,
  onTermsPress,
}: TermsCheckboxProps) {
  return (
    // Usamos TouchableOpacity para que toda el área sea clickeable
    <TouchableOpacity
      style={styles.container}
      onPress={() => onCheckedChange(!checked)}
      activeOpacity={0.7}
    >
      {/* La caja del checkbox */}
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Feather name="check" size={18} color="#3b82f6" />}
      </View>

      {/* El texto de los términos */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Acepto los{' '}
          <Text style={styles.linkText} onPress={onTermsPress}>
            términos y condiciones
          </Text>
          {' '}y la{' '}
          <Text style={styles.linkText} onPress={onTermsPress}>
            política de privacidad
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: 'white', // Fondo blanco cuando está seleccionado
    borderColor: 'white',
  },
  textContainer: {
    flex: 1, // Permite que el texto se ajuste
  },
  text: {
    fontSize: 14,
    color: 'white',
  },
  linkText: {
    color: '#FACC15', // Amarillo para los enlaces, como en la pantalla de inicio
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});