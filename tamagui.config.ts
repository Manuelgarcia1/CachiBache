import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';

const tamaguiConfig = createTamagui(config);

export type AppConfig = typeof tamaguiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;