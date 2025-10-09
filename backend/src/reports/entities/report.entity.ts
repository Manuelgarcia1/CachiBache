import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Importar User
import { ReportStatus } from './report-status.enum';
import { ReportSeverity } from './report-severity.enum';
import { Photo } from './photo.entity';
import { ReportHistory } from './report-history.entity';


@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'point',
    // Convierte el objeto {x, y} a un string '(x,y)' para la BD
    transformer: {
      from: (value) => value,
      to: (value: { x: number; y: number }) => `${value.x},${value.y}`,
    },
  })
  location: string; // La BD lo ve como 'point', TypeORM lo maneja como string

  @Column()
  address: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDIENTE })
  status: ReportStatus;

  @Column({ type: 'enum', enum: ReportSeverity })
  severity: ReportSeverity;

  // --- Relaciones ---

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id' }) // Especifica el nombre de la columna FK
  user: User;

  @OneToMany(() => Photo, (photo) => photo.report)
  photos: Photo[];

  @OneToMany(() => ReportHistory, (history) => history.report)
  history: ReportHistory[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}