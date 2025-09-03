import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '../src/features/forgot-password/components/ForgotPasswordScreen';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  
  return (
    <ForgotPasswordScreen 
      onPasswordResetSent={() => router.replace('/')} // Redirige a la pantalla de inicio
      onBackToLogin={() => router.back()}
    />
  );
}