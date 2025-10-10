import { FontAwesome } from '@expo/vector-icons';
import { Text, YStack } from 'tamagui';

export function EmptyState() {
  return (
    <YStack alignItems="center" justifyContent="center" flex={1} padding="$6">
      <FontAwesome name="exclamation-circle" size={48} color="#ccc" />
      <Text fontSize="$6" color="$gray10" marginTop="$4">
        No tienes reportes aún.
      </Text>
    </YStack>
  );
}