import { YStack } from 'tamagui';
import { ReportItem } from './ReportItem';

interface Report {
  address: string;
  date: string;
  status: string;
  location: string;
}

interface ReportListProps {
  reports: Report[];
}

export function ReportList({ reports }: ReportListProps) {
  return (
    <YStack>
      {reports.map((report, idx) => (
        <ReportItem
          key={idx}
          address={report.address}
          date={report.date}
          status={report.status}
          location={report.location}
        />
      ))}
    </YStack>
  );
}