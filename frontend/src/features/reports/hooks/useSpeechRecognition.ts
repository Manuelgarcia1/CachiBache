import { useState, useEffect, useCallback } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Alert } from "react-native";

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isAvailable: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  requestPermissions: () => Promise<boolean>;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // Verificar disponibilidad del reconocimiento de voz
  useEffect(() => {
    const checkAvailability = () => {
      try {
        // Intentar verificar disponibilidad con el método si existe
        if (
          typeof (ExpoSpeechRecognitionModule as any).isRecognitionAvailable ===
          "function"
        ) {
          const available = (
            ExpoSpeechRecognitionModule as any
          ).isRecognitionAvailable();
          setIsAvailable(available);
        } else {
          // Si no existe el método, asumir que está disponible y manejarlo en runtime
          setIsAvailable(true);
        }
      } catch (err) {
        console.error("Error checking speech recognition availability:", err);
        // Asumir disponible y manejar errores cuando se intente usar
        setIsAvailable(true);
      }
    };

    checkAvailability();
  }, []);

  // Escuchar eventos de reconocimiento de voz
  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcribedText = event.results
      .map((result) => result.transcript)
      .join(" ");
    setTranscript(transcribedText);
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsListening(false);
    let errorMessage = "Error al reconocer voz";

    switch (event.error) {
      case "no-speech":
        errorMessage =
          "No se detectó voz. Intenta hablar más cerca del micrófono.";
        break;
      case "audio-capture":
        errorMessage = "Error con el audio. Verifica tu micrófono.";
        break;
      case "not-allowed":
        errorMessage = "Permiso de micrófono denegado.";
        break;
      case "network":
        errorMessage = "Error de red. Verifica tu conexión a internet.";
        break;
      case "aborted":
        errorMessage = "Reconocimiento cancelado.";
        break;
      case "language-not-supported":
        errorMessage = "Idioma no soportado.";
        break;
      case "bad-grammar":
        errorMessage = "Error de configuración.";
        break;
      default:
        errorMessage = `Error: ${event.error}`;
    }

    setError(errorMessage);
    console.error("Speech recognition error:", event.error, event.message);
  });

  // Solicitar permisos
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (!result.granted) {
        Alert.alert(
          "Permiso Necesario",
          "Para usar la función de dictado por voz, necesitamos acceso al micrófono. Ve a configuración para habilitarlo.",
          [{ text: "Entendido" }]
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error requesting permissions:", err);
      setError("Error al solicitar permisos");
      return false;
    }
  }, []);

  // Iniciar reconocimiento
  const startListening = useCallback(async () => {
    try {
      setError(null);
      setTranscript("");

      // Verificar permisos primero
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }

      // Verificar disponibilidad
      if (!isAvailable) {
        setError(
          "El reconocimiento de voz no está disponible en este dispositivo"
        );
        Alert.alert(
          "No Disponible",
          "El reconocimiento de voz no está disponible en este dispositivo.",
          [{ text: "Entendido" }]
        );
        return;
      }

      // Iniciar reconocimiento con configuración en español
      ExpoSpeechRecognitionModule.start({
        lang: "es-MX", // Español de México, puedes usar 'es-ES' para España
        interimResults: true, // Mostrar resultados mientras habla
        maxAlternatives: 1,
        continuous: false, // No continuo, se detiene automáticamente
        requiresOnDeviceRecognition: false, // Permitir reconocimiento en la nube
        addsPunctuation: true, // Agregar puntuación automáticamente
        contextualStrings: ["bache", "avenida", "calle", "esquina", "profundo"], // Palabras contextuales
      });
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setError("Error al iniciar el reconocimiento de voz");
      setIsListening(false);
    }
  }, [isAvailable, requestPermissions]);

  // Detener reconocimiento
  const stopListening = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (err) {
      console.error("Error stopping speech recognition:", err);
    }
  }, []);

  // Resetear transcripción
  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isAvailable,
    startListening,
    stopListening,
    resetTranscript,
    requestPermissions,
  };
};
