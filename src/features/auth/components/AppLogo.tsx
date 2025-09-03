import { Stack } from "tamagui";
import { Image } from "expo-image";

interface AppLogoProps {
  size?: number;
}

export function AppLogo({ size = 290 }: AppLogoProps) {
  return (
    <Stack space="$4" alignItems="center" marginBottom="$6">
      <Stack width={size} height={size}>
        <Image
          source={require("../../../../assets/images/icon.png")}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      </Stack>
    </Stack>
  );
}
