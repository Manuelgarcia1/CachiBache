import { Stack } from "@tamagui/core";
import { Image } from "react-native";

export function AppLogo() {
  return (
    <Stack space="$4" alignItems="center" marginBottom="$8">
      <Image
        source={require("../../../../assets/images/icon.png")}
        width={290}
        height={290}
        resizeMode="cover"
      />
    </Stack>
  );
}
