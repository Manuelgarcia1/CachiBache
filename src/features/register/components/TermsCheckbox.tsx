import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onTermsPress: () => void;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onCheckedChange,
  onTermsPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={() => onCheckedChange(!checked)}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Acepto los{' '}
          <TouchableOpacity onPress={onTermsPress}>
            <Text style={styles.link}>términos y condiciones</Text>
          </TouchableOpacity>
          {' '}y la{' '}
          <TouchableOpacity onPress={onTermsPress}>
            <Text style={styles.link}>política de privacidad</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
});
