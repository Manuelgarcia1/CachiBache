import { AppLogo } from "@features/auth";
import { Stack, Text, Circle } from "tamagui";
import { useEffect, useState } from "react";

export function ReauthLoadingScreen() {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      flex={1}
      backgroundColor="#094b7eff"
      justifyContent="center"
      alignItems="center"
      space="$6"
    >
      <AppLogo size={260} />

      <Stack alignItems="center" space="$4">
        {/* Dots elegantes */}
        <Stack flexDirection="row" space="$3" alignItems="center">
          {[0, 1, 2].map((index) => (
            <Circle
              key={index}
              size={12}
              backgroundColor={activeDot === index ? "$white1" : "rgba(255,255,255,0.3)"}
              animation="bouncy"
              scale={activeDot === index ? 1.3 : 1}
            />
          ))}
        </Stack>

        <Text
          color="$white1"
          fontSize="$6"
          textAlign="center"
          fontWeight="600"
          letterSpacing={0.5}
        >
          Usuario autenticado{"\n"}Redirigiendo...
        </Text>
      </Stack>
    </Stack>
  );
}
