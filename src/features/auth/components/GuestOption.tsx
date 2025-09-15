import { router } from "expo-router";
import { Stack, Text } from "tamagui";

export function GuestOption() {
  return (
    <Stack marginTop="$6">
      <Text
        color="$blue3"
        fontSize="$4"
        textDecorationLine="underline"
        onPress={() => router.push("/(tabs)" as any)}
      >
        Ingresar como Invitado
      </Text>
    </Stack>
  );
}
