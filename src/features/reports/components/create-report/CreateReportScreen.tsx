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
    updateTitle,
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <YStack flex={1}>
        <Header onPress={handleBack} />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          <ReportFormSection
            title={reportData.title}
            description={reportData.description}
            imageUri={reportData.image}
            onTitleChange={updateTitle}
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