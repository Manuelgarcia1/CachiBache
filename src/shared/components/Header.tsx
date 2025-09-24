// Ubicación: src/shared/components/Header.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
// CAMBIO: Ya no importamos 'router' aquí, la pantalla se encargará de la lógica.

// 1. Definimos las props que el componente recibirá
interface HeaderProps {
  onPress: () => void;
}

export function Header({ onPress }: HeaderProps) {
  return (
    <LinearGradient
      colors={['#094b7eff', '#5eb0ef']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* 2. El botón ahora usa la función que le pasamos por props */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Feather name="arrow-left" size={24} color="white" />
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 20, // Mantenemos el padding para iOS
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});