import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Report } from '../../reports/entities/report.entity';
import { ReportHistory } from '../../reports/entities/report-history.entity';
import * as bcrypt from 'bcrypt'; // Importar bcrypt
import { Exclude } from 'class-transformer'; //Importar Exclude para seguridad

@Entity('users') // Le dice a TypeORM que esta clase es una entidad que mapea a la tabla 'users'
export class User {
    @PrimaryGeneratedColumn('uuid') // Define la columna 'id' como clave primaria autogenerada de tipo UUID
    id: string;

    @Column() // Define una columna estándar
    fullName: string;

    @Column({ unique: true }) // El email debe ser único en la tabla
    email: string;

    @Exclude() // Excluir este campo de cualquier respuesta JSON
    @Column()
    password?: string;

    @Column({ name: 'google_id', nullable: true }) // Mapea a la columna 'google_id' y permite valores nulos
    googleId?: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl?: string;

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
    
    //Hook que se ejecuta antes de insertar el usuario en la BD
    @BeforeInsert()
    async hashPassword() {
        // Solo hashear si la contraseña existe (para no romper el login con Google)
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
}