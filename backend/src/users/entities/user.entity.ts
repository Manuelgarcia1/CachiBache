import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Report } from '@reports/entities/report.entity';
import { ReportHistory } from '@reports/entities/report-history.entity';
import { Exclude } from 'class-transformer'; //Importar Exclude para seguridad

@Entity('users') // Le dice a TypeORM que esta clase es una entidad que mapea a la tabla 'users'
@Index('IDX_USER_EMAIL_LOWER', { synchronize: false }) // Índice case-insensitive (se crea manualmente)
export class User {
  @PrimaryGeneratedColumn('uuid') // Define la columna 'id' como clave primaria autogenerada de tipo UUID
  id: string;

  @Column() // Define una columna estándar
  fullName: string;

  @Column({ unique: true }) // El email debe ser único en la tabla
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  // ✨ --- NUEVO CAMPO: TÉRMINOS Y CONDICIONES --- ✨
  @Column({ name: 'terms_accepted', default: false })
  termsAccepted: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({
    type: 'enum', // Define la columna como de tipo enum
    enum: UserRole,
    default: UserRole.CIUDADANO, // Establece un valor por defecto
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' }) // Columna que se llena automáticamente al crear
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }) // Columna que se actualiza automáticamente al modificar
  updatedAt: Date;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => ReportHistory, (history) => history.updatedBy)
  reportHistoryUpdates: ReportHistory[];

  // ✨ --- HOOKS AUTOMÁTICOS PARA NORMALIZAR EMAIL --- ✨
  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}

// Tipo para representar un usuario sin la propiedad password ni métodos internos (para respuestas seguras)
export type UserWithoutPassword = Omit<User, 'password' | 'normalizeEmail'>;
