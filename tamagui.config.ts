// Ubicación: tamagui.config.ts
import { createTamagui } from '@tamagui/core'; // Importa createTamagui
import { config } from '@tamagui/config/v3'; // Importa la configuración base

// Crea y exporta la configuración procesada
const tamaguiConfig = createTamagui(config);

// Esto es necesario para que TypeScript conozca los tipos de tu configuración
export type AppConfig = typeof tamaguiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;