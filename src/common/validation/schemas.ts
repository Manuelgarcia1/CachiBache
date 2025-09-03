import * as yup from 'yup';

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
});

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('El nombre completo es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'El teléfono solo debe contener números')
    .min(8, 'El teléfono debe tener al menos 8 dígitos'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
    .required('Debes aceptar los términos y condiciones'),
});
