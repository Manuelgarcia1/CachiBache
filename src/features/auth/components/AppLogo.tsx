import { Stack } from "@tamagui/core";
import { Image } from "expo-image";

export function AppLogo() {
  return (
    <Stack space="$4" alignItems="center" marginBottom="$6">
      <Stack width={290} height={290}>
        <Image
          source={require("../../../../assets/images/icon.png")}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      </Stack>
    </Stack>
  );
}
