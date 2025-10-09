import { Feather } from '@expo/vector-icons';
import { YStack } from 'tamagui';

export function CustomMarker() {
  return (
    <YStack
      backgroundColor="#ef4444"
      width={30}
      height={30}
      borderRadius={15}
      alignItems="center"
      justifyContent="center"
    >
      <Feather name="alert-triangle" size={16} color="#fff" />
    </YStack>
  );
}