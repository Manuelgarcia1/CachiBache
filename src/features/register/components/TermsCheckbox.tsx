import React from "react";
import { Checkbox, Stack, Text, XStack } from "tamagui";

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
    <XStack
      alignItems="flex-start"
      space="$3"
      paddingHorizontal="$2"
      marginVertical="$3"
    >
      <Checkbox
        size="$4"
        checked={checked}
        onCheckedChange={onCheckedChange}
        borderRadius="$2"
        marginTop="$1"
      >
        <Checkbox.Indicator>
          <Text color="$background" fontSize="$2" fontWeight="bold">
            ✓
          </Text>
        </Checkbox.Indicator>
      </Checkbox>

      <Stack flex={1}>
        <XStack flexWrap="wrap" alignItems="center">
          <Text fontSize="$3" color="$gray11">
            Acepto los 
          </Text>
          <Text
            fontSize="$3"
            color="$blue10"
            textDecorationLine="underline"
            onPress={onTermsPress}
          >
            términos y condiciones
          </Text>
          <Text fontSize="$3" color="$gray11">
            {" "}y la 
          </Text>
          <Text
            fontSize="$3"
            color="$blue10"
            textDecorationLine="underline"
            onPress={onTermsPress}
          >
            política de privacidad
          </Text>
        </XStack>
      </Stack>
    </XStack>
  );
}
