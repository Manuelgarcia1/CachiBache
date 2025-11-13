import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('El nombre completo es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: yup
    .string()
    .email('El email no es válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
  phone: yup
    .string()
    .min(8, 'El teléfono debe tener al menos 8 caracteres')
    .max(20, 'El teléfono no puede tener más de 20 caracteres'),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
    .required('Debes aceptar los términos y condiciones')
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('El email no es válido')
    .required('El email es requerido')
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('El email no es válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
});
