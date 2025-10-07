// Ubicación: src/features/register/index.ts

// Este archivo `index.ts` sirve como un punto de entrada (barrel file) para el módulo de registro.
// Su propósito es reexportar todos los componentes definidos en la carpeta `./components`.
// Esto permite que otros módulos importen componentes de registro de manera más limpia,
// por ejemplo, `import { RegisterScreen } from '@features/register';`
// en lugar de `import { RegisterScreen } from '@features/register/components/RegisterScreen';`.
export * from './components';

