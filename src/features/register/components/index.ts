// Ubicación: src/features/register/components/index.ts

// Este archivo `index.ts` actúa como un "barrel file" para los componentes de la funcionalidad de registro.
// Su propósito es agrupar y reexportar todos los componentes y tipos definidos en esta carpeta,
// facilitando las importaciones desde otros archivos.
// Por ejemplo, en lugar de importar cada componente individualmente, se puede hacer:
// `import { RegisterButton, RegisterForm, RegisterScreen, TermsCheckbox } from './components';`
// o, si el `index.ts` padre reexporta este, `import { RegisterScreen } from '@features/register';`

export { RegisterButton } from "./RegisterButton"; // Reexporta el botón de registro.
export { RegisterForm, type RegisterFormData } from "./RegisterForm"; // Reexporta el formulario de registro y su tipo de datos.
export { RegisterScreen } from "./RegisterScreen"; // Reexporta la pantalla principal de registro.
export { TermsCheckbox } from "./TermsCheckbox"; // Reexporta el componente de checkbox para términos y condiciones.

