import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Report } from './report.entity';
import { User } from '@users/entities/user.entity';
import { ReportStatus } from './report-status.enum';

@Entity('report_history')
export class ReportHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReportStatus })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relación: Quién hizo el cambio de estado
  @ManyToOne(() => User, (user) => user.reportHistoryUpdates)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy: User;

  // Relación: A qué reporte pertenece este historial
  @ManyToOne(() => Report, (report) => report.history)
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
