import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ForgotPasswordButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export const ForgotPasswordButton: React.FC<ForgotPasswordButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  title = 'Enviar Enlace',
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
          Enviando...
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
    backgroundColor: '#059669',
    borderColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
