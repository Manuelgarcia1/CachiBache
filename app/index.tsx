import { useRouter } from 'expo-router';
import { WelcomeScreen } from '../src/features/auth'; // Asegúrate que WelcomeScreen ya no contenga la lógica de estado para mostrar Register/Forgot

export default function Index() {
  const router = useRouter();

  const handleShowRegister = () => {
    router.push('/register'); // Navega a la ruta /register
  };

  const handleShowForgotPassword = () => {
    router.push('/forgot-password'); // Navega a la ruta /forgot-password
  };

  // Pasar las funciones de navegación como props a LoginButtons
  return (
    <WelcomeScreen
      onShowRegister={handleShowRegister}
      onShowForgotPassword={handleShowForgotPassword}
    />
  );
}