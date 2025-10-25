import { YStack } from 'tamagui';
import { ReportItem } from './ReportItem';
import { ReportFromBackend } from '@/src/shared/types/report.types'; 

interface ReportListProps {
  reports: ReportFromBackend[]; // Usamos el tipo completo
}
export function ReportList({ reports }: ReportListProps) {
  return (
    <YStack gap="$4">
      {reports.map((report) => (
        <ReportItem
          key={report.id}
          id={report.id}
          address={report.address}
          date={report.updatedAt} // Usamos updatedAt para la fecha del último cambio
          status={report.status}
          severity={report.severity}
          photoUrl={report.photos?.[0]?.url} 
          location={report.location}
        />
      ))}
    </YStack>
  );
}