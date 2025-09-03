import { useRouter } from 'expo-router';
import { RegisterScreen } from '../src/features/register/components/RegisterScreen';

export default function RegisterRoute() {
  const router = useRouter();
  
  return (
    <RegisterScreen 
      onRegisterSuccess={() => router.replace('/')} // Redirige a la pantalla de inicio
      onBackToLogin={() => router.back()}
    />
  );
}