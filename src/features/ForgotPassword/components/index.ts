// Ubicación: src/features/ForgotPassword/components/index.ts

// Este archivo `index.ts` actúa como un "barrel file" para los componentes de la funcionalidad de "Olvidé mi Contraseña".
// Su propósito es agrupar y reexportar todos los componentes de esta carpeta,
// facilitando las importaciones desde otros archivos.
// Por ejemplo, en lugar de importar cada componente individualmente, se puede hacer:
// `import { ForgotPasswordButton, ForgotPasswordForm, ForgotPasswordScreen } from './components';`
// o, si el `index.ts` padre reexporta este, `import { ForgotPasswordScreen } from '@features/ForgotPassword';`

export { ForgotPasswordButton } from "./ForgotPasswordButton"; // Reexporta el botón de recuperación de contraseña.
export { ForgotPasswordForm } from "./ForgotPasswordForm"; // Reexporta el formulario de recuperación de contraseña.
export { ForgotPasswordScreen } from "./ForgotPasswordScreen"; // Reexporta la pantalla principal de recuperación de contraseña.

