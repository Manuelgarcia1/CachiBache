// Ubicación: src/shared/validation/schemas.ts

import * as yup from 'yup'; // Importa la librería Yup para la validación de esquemas.

// Esquema de validación para el formulario de registro.
export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('El nombre completo es requerido') // Campo obligatorio.
    .min(3, 'El nombre debe tener al menos 3 caracteres'), // Longitud mínima.
  email: yup
    .string()
    .email('El email no es válido') // Valida formato de email.
    .required('El email es requerido'), // Campo obligatorio.
  password: yup
    .string()
    .required('La contraseña es requerida') // Campo obligatorio.
    .min(6, 'La contraseña debe tener al menos 6 caracteres'), // Longitud mínima.
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Las contraseñas no coinciden') // Debe coincidir con la contraseña.
    .required('Debes confirmar tu contraseña'), // Campo obligatorio.
  phone: yup
    .string()
    .required('El teléfono es requerido') // Campo obligatorio.
    .matches(/^[0-9]+$/, 'El teléfono solo debe contener números') // Solo números.
    .min(8, 'El teléfono debe tener al menos 8 dígitos'), // Longitud mínima.
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones') // Debe ser true.
    .required('Debes aceptar los términos y condiciones') // Campo obligatorio.
});

// Esquema de validación para el formulario de recuperación de contraseña.
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('El email no es válido') // Valida formato de email.
    .required('El email es requerido') // Campo obligatorio.
});
