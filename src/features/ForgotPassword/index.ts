// Ubicación: src/features/ForgotPassword/index.ts

// Este archivo `index.ts` sirve como un punto de entrada (barrel file) para el módulo ForgotPassword.
// Su propósito es reexportar todos los componentes definidos en la carpeta `./components`.
// Esto permite que otros módulos importen componentes de ForgotPassword de manera más limpia,
// por ejemplo, `import { ForgotPasswordScreen } from '@features/ForgotPassword';`
// en lugar de `import { ForgotPasswordScreen } from '@features/ForgotPassword/components/ForgotPasswordScreen';`.
export * from './components';

