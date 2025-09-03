import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface RegisterButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  title = 'Crear Cuenta',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <Text style={styles.buttonText}>
          Creando cuenta...
        </Text>
      ) : (
        <Text style={styles.buttonText}>
          {title}
        </Text>
      )}
      {loading && (
        <ActivityIndicator 
          size="small" 
          color="white" 
          style={styles.spinner}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 16,
    width: '100%',
    maxWidth: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    borderColor: '#9ca3af',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginLeft: 8,
  },
});
