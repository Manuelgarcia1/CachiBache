import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Button, Text, XStack, YStack } from 'tamagui';

export function ReportHeader() {
  const insets = useSafeAreaInsets();

  return (
    <YStack
      padding="$4"
      paddingTop={insets.top + 20}
      backgroundColor="#094b7e"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
    >
      <XStack alignItems="center" gap="$3">
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          icon={<Feather name="arrow-left" size={24} color="#fff" />}
          onPress={() => router.back()}
        />
        <Text fontSize={22} fontWeight="700" color="#fff" flex={1}>
          Reportar Bache
        </Text>
      </XStack>
    </YStack>
  );
}