import { apiService } from "./api.service";
import axios, { AxiosError, isAxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native"; // Importa Alert para depuración

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

interface UploadResponse {
  secure_url: string;
  public_id: string;
}

async function uploadImage(
  localUri: string,
  folder: string
): Promise<UploadResponse> {
  // 1. Validar que tenemos la URI local
  if (!localUri) {
    console.error(
      "Cloudinary Service: Se llamó a uploadImage sin una URI local."
    );
    throw new Error("No se proporcionó ninguna imagen para subir.");
  }

  const public_id = uuidv4();
  console.log(`[Cloudinary] Paso 1: Generado public_id: ${public_id}`);

  // --- 👇 PASO CRÍTICO 1: OBTENER LA FIRMA 👇 ---
  let signatureData;
  try {
    console.log("[Cloudinary] Paso 2: Solicitando firma al backend...");
    const paramsToSign = { public_id, folder };
    signatureData = await apiService.post<{
      signature: string;
      timestamp: number;
      api_key: string;
    }>("/cloudinary/signature", paramsToSign);
    console.log("[Cloudinary] ✅ Firma recibida del backend.");
  } catch (error) {
    console.error(
      "🔴 [Cloudinary] ERROR AL OBTENER LA FIRMA:",
      JSON.stringify(error, null, 2)
    );
    Alert.alert(
      "Error de Conexión",
      "No se pudo comunicar con el servidor para autorizar la subida de la imagen."
    );
    throw new Error("Fallo al obtener la firma del backend.");
  }

  // Desestructuramos después de confirmar que la petición fue exitosa
  const { signature, timestamp, api_key } = signatureData;

  // 2. Preparar el FormData
  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    type: `image/${localUri.split(".").pop()}`,
    name: localUri.split("/").pop(),
  } as any);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", public_id);

  // --- 👇 PASO CRÍTICO 2: SUBIR A CLOUDINARY 👇 ---
  try {
    console.log(
      "[Cloudinary] Paso 3: Subiendo imagen directamente a Cloudinary..."
    );
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("[Cloudinary] ✅ Imagen subida exitosamente a Cloudinary.");

    const { secure_url, public_id: returned_public_id } = response.data;
    return { secure_url, public_id: returned_public_id };
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("🔴 [Cloudinary] ERROR DETALLADO DE AXIOS AL SUBIR:", {
        message: axiosError.message,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
      });
    } else {
      console.error("🔴 [Cloudinary] ERROR GENÉRICO AL SUBIR:", error);
    }

    Alert.alert(
      "Error de Subida",
      "No se pudo subir la imagen a la nube. Revisa la consola para más detalles."
    );
    throw new Error("No se pudo subir la imagen.");
  }
}

export const cloudinaryService = {
  uploadImage,
};
