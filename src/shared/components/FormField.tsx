import React from 'react';
import { Input, Label, Stack, Text } from 'tamagui';

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: any) => void;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  error,
  autoCapitalize = 'none',
  keyboardType = 'default',
}: FormFieldProps) {
  return (
    <Stack space="$2" marginBottom="$4">
      <Label
        fontSize="$4"
        fontWeight="600"
        color="white"
      >
        {label}
      </Label>
      <Input
        size="$4"
        borderWidth={2}
        borderColor={error ? '$red8' : '$gray6'}
        backgroundColor="$gray2"
        borderRadius="$4"
        fontSize="$4"
        padding="$3"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        focusStyle={{
          borderColor: error ? '$red9' : '$blue8',
        }}
      />
      {error && (
        <Text
          fontSize="$3"
          color="$red10"
          marginTop="$1"
        >
          {error}
        </Text>
      )}
    </Stack>
  );
}