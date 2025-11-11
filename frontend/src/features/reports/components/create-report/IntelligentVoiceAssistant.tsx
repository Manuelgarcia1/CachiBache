import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { useSpeechRecognition } from '@features/reports/hooks/useSpeechRecognition';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';

interface IntelligentVoiceAssistantProps {
  onTranscriptComplete: (text: string) => void;
  initialValue?: string;
}

type AssistantState = 'idle' | 'listening' | 'result' | 'error';

export const IntelligentVoiceAssistant: React.FC<IntelligentVoiceAssistantProps> = ({
  onTranscriptComplete,
  initialValue = '',
}) => {
  const {
    isListening,
    transcript,
    error,
    isAvailable,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [state, setState] = useState<AssistantState>('idle');
  const [finalTranscript, setFinalTranscript] = useState(initialValue);

  // Animación de onda sonora
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      setState('listening');
      // Iniciar animaciones de onda
      scale1.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1,
        false
      );
      scale2.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
      scale3.value = withRepeat(
        withSequence(
          withTiming(1.6, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      // Resetear animaciones
      scale1.value = withTiming(1, { duration: 200 });
      scale2.value = withTiming(1, { duration: 200 });
      scale3.value = withTiming(1, { duration: 200 });

      if (transcript && !error) {
        setState('result');
        setFinalTranscript(transcript);
      } else if (error) {
        setState('error');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript, error]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));

  const handleStartListening = async () => {
    resetTranscript();
    setFinalTranscript('');
    await startListening();
  };

  const handleAcceptTranscript = () => {
    onTranscriptComplete(finalTranscript);
    setState('idle');
  };

  const handleRetry = () => {
    resetTranscript();
    setFinalTranscript('');
    setState('idle');
  };

  const handleCancel = () => {
    stopListening();
    resetTranscript();
    setState('idle');
  };

  // Estado: Inicio - Sugerencia para usar voz
  if (state === 'idle') {
    return (
      <Card elevate size="$4" bordered padding="$4" backgroundColor="$blue1">
        <YStack gap="$3">
          <XStack alignItems="center" gap="$2">
            <Feather name="mic" size={20} color="#3b82f6" />
            <Text fontSize="$5" fontWeight="600" color="$blue10">
              ¿Prefieres dictarlo?
            </Text>
          </XStack>

          <Text fontSize="$3" color="$gray11" lineHeight={20}>
            Toca el micrófono y cuéntame sobre el bache. Puedes mencionar:
          </Text>

          <YStack gap="$2" paddingLeft="$3">
            <Text fontSize="$3" color="$gray10">
              • Qué tan grande es
            </Text>
            <Text fontSize="$3" color="$gray10">
              • Dónde está exactamente
            </Text>
            <Text fontSize="$3" color="$gray10">
              • Qué tan peligroso es
            </Text>
          </YStack>

          <Button
            size="$4"
            themeInverse
            onPress={handleStartListening}
            disabled={!isAvailable}
            marginTop="$2"
          >
            <XStack alignItems="center" gap="$2">
              <Feather name="mic" size={18} color="white" />
              <Text color="white" fontWeight="600">
                {isAvailable ? 'Empezar a dictar' : 'No disponible'}
              </Text>
            </XStack>
          </Button>

          {!isAvailable && (
            <Text fontSize="$2" color="$red10" textAlign="center">
              El reconocimiento de voz no está disponible en este dispositivo
            </Text>
          )}
        </YStack>
      </Card>
    );
  }

  // Estado: Escuchando
  if (state === 'listening') {
    return (
      <Card elevate size="$4" bordered padding="$4" backgroundColor="$green1">
        <YStack gap="$4" alignItems="center">
          <XStack alignItems="center" gap="$2">
            <Text fontSize="$6" fontWeight="700" color="$green10">
              Escuchando...
            </Text>
          </XStack>

          {/* Animación de onda sonora */}
          <XStack gap="$2" alignItems="center" justifyContent="center" height={60}>
            <Animated.View style={[animatedStyle1]}>
              <YStack
                width={12}
                height={40}
                backgroundColor="$green9"
                borderRadius={6}
              />
            </Animated.View>
            <Animated.View style={[animatedStyle2]}>
              <YStack
                width={12}
                height={50}
                backgroundColor="$green10"
                borderRadius={6}
              />
            </Animated.View>
            <Animated.View style={[animatedStyle3]}>
              <YStack
                width={12}
                height={35}
                backgroundColor="$green8"
                borderRadius={6}
              />
            </Animated.View>
            <Animated.View style={[animatedStyle1]}>
              <YStack
                width={12}
                height={45}
                backgroundColor="$green9"
                borderRadius={6}
              />
            </Animated.View>
          </XStack>

          {/* Transcripción en tiempo real */}
          {transcript && (
            <Card bordered padding="$3" backgroundColor="$background" width="100%">
              <Text fontSize="$4" color="$gray12" lineHeight={22}>
                &quot;{transcript}&quot;
              </Text>
            </Card>
          )}

          <XStack gap="$3" width="100%" marginTop="$2">
            <Button
              flex={1}
              size="$4"
              variant="outlined"
              onPress={handleCancel}
            >
              <XStack alignItems="center" gap="$2">
                <Feather name="x" size={18} />
                <Text fontWeight="600">Cancelar</Text>
              </XStack>
            </Button>
            <Button
              flex={1}
              size="$4"
              theme="green"
              onPress={stopListening}
            >
              <Text color="white" fontWeight="600">Detener</Text>
            </Button>
          </XStack>
        </YStack>
      </Card>
    );
  }

  // Estado: Resultado con transcripción
  if (state === 'result') {
    return (
      <Card elevate size="$4" bordered padding="$4" backgroundColor="$purple1">
        <YStack gap="$3">
          <XStack alignItems="center" gap="$2">
            <Feather name="check" size={20} color="#8b5cf6" />
            <Text fontSize="$5" fontWeight="600" color="$purple10">
              He entendido esto:
            </Text>
          </XStack>

          <Card bordered padding="$3" backgroundColor="$background">
            <Text fontSize="$4" color="$gray12" lineHeight={22}>
              &quot;{finalTranscript}&quot;
            </Text>
          </Card>

          <Text fontSize="$2" color="$gray10" textAlign="center">
            Puedes aceptar este texto o volverlo a intentar
          </Text>

          <XStack gap="$3" marginTop="$2">
            <Button
              flex={1}
              size="$4"
              variant="outlined"
              onPress={handleRetry}
            >
              <XStack alignItems="center" gap="$2">
                <Feather name="rotate-ccw" size={18} />
                <Text fontWeight="600">Reintentar</Text>
              </XStack>
            </Button>
            <Button
              flex={1}
              size="$4"
              themeInverse
              onPress={handleAcceptTranscript}
            >
              <XStack alignItems="center" gap="$2">
                <Feather name="check" size={18} color="white" />
                <Text color="white" fontWeight="600">Usar este texto</Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      </Card>
    );
  }

  // Estado: Error
  if (state === 'error') {
    return (
      <Card elevate size="$4" bordered padding="$4" backgroundColor="$red1">
        <YStack gap="$3">
          <XStack alignItems="center" gap="$2">
            <Feather name="x" size={20} color="#ef4444" />
            <Text fontSize="$5" fontWeight="600" color="$red10">
              Ups, algo salió mal
            </Text>
          </XStack>

          <Text fontSize="$4" color="$gray12" lineHeight={22}>
            {error || 'Error desconocido al reconocer voz'}
          </Text>

          <Button
            size="$4"
            theme="red"
            onPress={handleRetry}
            marginTop="$2"
          >
            <XStack alignItems="center" gap="$2">
              <Feather name="rotate-ccw" size={18} color="white" />
              <Text color="white" fontWeight="600">Intentar de nuevo</Text>
            </XStack>
          </Button>
        </YStack>
      </Card>
    );
  }

  return null;
};
