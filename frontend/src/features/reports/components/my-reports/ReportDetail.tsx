import { Feather } from '@expo/vector-icons';
import { Image, Separator, Text, XStack, YStack } from 'tamagui';
import MapView, { Marker, Region } from 'react-native-maps';
import { parseLocationFromBackend } from '@/src/shared/types/report.types';
import { Linking, TouchableOpacity } from 'react-native';

interface ReportDetailProps {
    severity: string;
    photoUrl?: string;
    location: any;
    date: string;
}

// Componente pequeño y reutilizable para mostrar un dato
const DetailRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <XStack alignItems="center" space="$3">
        <Feather name={icon} size={18} color="#64748b" />
        <Text fontSize="$4" color="$gray11">{label}:</Text>
        <Text fontSize="$4" fontWeight="600" color="$gray12">{value}</Text>
    </XStack>
);

export function ReportDetail({ severity, photoUrl, location, date }: ReportDetailProps) {
    // Parseamos la ubicación para obtener latitud y longitud
    const coordinate = parseLocationFromBackend(location);

    // Creamos una región para el mapa centrada en la coordenada del reporte
    const mapRegion: Region = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.002, // Un zoom cercano para ver el detalle
        longitudeDelta: 0.002,
    };

    // Función para abrir la ubicación en la app de mapas del teléfono
    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${coordinate.latitude},${coordinate.longitude}`;
        Linking.openURL(url);
    };

    return (
        <YStack space="$4" paddingTop="$4">
            <Separator borderColor="$gray4" />

            {/* Mostramos la imagen del reporte si existe */}
            {photoUrl ? (
                <YStack>
                    <Text fontSize="$3" fontWeight="bold" color="$gray11" marginBottom="$2">FOTO DEL REPORTE</Text>
                    <Image
                        source={{ uri: photoUrl }}
                        height={220}
                        borderRadius="$5"
                        resizeMode="cover"
                    />
                </YStack>
            ) : (
                <Text fontSize="$3" color="$gray9">No se adjuntó foto para este reporte.</Text>
            )}

            {/* MINI-MAPA */}
            <YStack space="$2">
                <Text fontSize="$3" fontWeight="bold" color="$gray11">UBICACIÓN</Text>
                <TouchableOpacity onPress={handleOpenMaps}>
                    <YStack height={150} borderRadius="$5" overflow="hidden" borderWidth={1} borderColor="$gray4">
                        <MapView
                            style={{ flex: 1 }}
                            region={mapRegion}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            pitchEnabled={false}
                            rotateEnabled={false}
                        >
                            <Marker coordinate={coordinate} />
                        </MapView>
                    </YStack>
                </TouchableOpacity>
            </YStack>

            {/* Fila de detalles adicionales */}
            <YStack space="$3">
                <DetailRow icon="bar-chart-2" label="Severidad" value={severity} />
                <DetailRow icon="calendar" label="Última Actualización" value={new Date(date).toLocaleString()} />
            </YStack>
        </YStack>
    );
}