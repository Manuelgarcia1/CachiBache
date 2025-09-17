import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, Text, YStack } from 'tamagui';
import { EmptyState } from './EmptyState';
import { ReportList } from './ReportList';

interface Report {
  title: string;
  status: string;
  date: string;
  location: string;
}

interface MyReportsScreenProps {
  reports: Report[];
}

export function MyReportsScreen({ reports }: MyReportsScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <YStack flex={1} backgroundColor="#094b7e">
      {/* Header */}
      <YStack padding="$4" paddingTop={insets.top + 30} backgroundColor="#094b7e">
        <Text fontSize={28} fontWeight="700" color="#fff" textAlign="center">
          Mis reportes
        </Text>
      </YStack>
      {/* Listado con scroll y estilos */}
      <ScrollView
        flex={1}
        backgroundColor="#f8fafc"
        padding="$4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 16 }}
      >
        {reports.length > 0 ? (
          <ReportList reports={reports} />
        ) : (
          <EmptyState />
        )}
      </ScrollView>
    </YStack>
  );
}