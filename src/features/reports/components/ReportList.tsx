import { YStack } from 'tamagui';
import { ReportItem } from './ReportItem';

interface Report {
  title: string;
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
          title={report.title}
          date={report.date}
          status={report.status}
          location={report.location}
        />
      ))}
    </YStack>
  );
}