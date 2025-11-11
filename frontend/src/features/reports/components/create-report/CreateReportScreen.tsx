import { useEffect } from 'react';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Button, ScrollView, YStack } from 'tamagui';
import { router } from 'expo-router';
import { useReportForm } from '@features/reports/hooks/useReportForm';
import { useLocationPermissions } from '@features/reports/hooks/useLocationPermissions';
import { Header } from '@sharedcomponents/index';
import { ReportFormSection } from '@features/reports/components/create-report/ReportFormSection';
import { LocationMapSection } from '@features/reports/components/create-report/LocationMapSection';

export function CreateReportScreen() {
  const insets = useSafeAreaInsets();
  const {
    reportData,
    mapRegion,
    isSubmitting,
    updateAddress,
    updateSeverity,
    updateDescription,
    updateImage,
    updateLocation,
    updateMapRegion,
    handleMapPress,
    submitReport,
  } = useReportForm();

  const { getCurrentLocation, isGettingLocation } = useLocationPermissions();

  const handleGetCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (result.location && result.region) {
      updateLocation(result.location);
      updateMapRegion(result.region);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Obtener ubicación automáticamente al montar el componente
  useEffect(() => {
    handleGetCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <YStack flex={1}>
        <Header onPress={handleBack} />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          <ReportFormSection
            address={reportData.address}
            severity={reportData.severity}
            description={reportData.description}
            imageUri={reportData.image}
            onAddressChange={updateAddress}
            onSeverityChange={updateSeverity}
            onDescriptionChange={updateDescription}
            onImageSelected={updateImage}
          />

          <LocationMapSection
            location={reportData.location}
            mapRegion={mapRegion}
            onMapPress={handleMapPress}
            onGetCurrentLocation={handleGetCurrentLocation}
            isGettingLocation={isGettingLocation}
          />

          <Button
            onPress={submitReport}
            backgroundColor="#22c55e"
            color="#fff"
            size="$5"
            borderRadius={12}
            disabled={isSubmitting}
            opacity={isSubmitting ? 0.7 : 1}
            marginBottom={insets.bottom + 20}
          >
            {isSubmitting ? 'Enviando reporte...' : 'Enviar reporte'}
          </Button>
        </YStack>
      </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}