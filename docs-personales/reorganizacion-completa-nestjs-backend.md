# Reorganización Completa del Backend NestJS - Proyecto CachiBache

**Fecha de creación:** 10 de octubre de 2025
**Proyecto:** CachiBache Backend (NestJS + TypeORM + PostgreSQL)
**Alcance:** Reestructuración completa de la arquitectura del proyecto

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [El Problema que Resolvemos](#el-problema-que-resolvemos)
3. [Estructura: Antes vs Después](#estructura-antes-vs-después)
4. [Cambios de Archivos Detallados](#cambios-de-archivos-detallados)
5. [Archivos Nuevos Creados](#archivos-nuevos-creados)
6. [Modificaciones en Archivos Existentes](#modificaciones-en-archivos-existentes)
7. [Beneficios de la Nueva Estructura](#beneficios-de-la-nueva-estructura)
8. [Ejemplos Prácticos: Imports Antes y Después](#ejemplos-prácticos-imports-antes-y-después)
9. [Guía de Navegación](#guía-de-navegación)
10. [Principios Arquitectónicos Aplicados](#principios-arquitectónicos-aplicados)

---

## Introducción

Esta reorganización representa una **evolución arquitectónica completa** del backend del proyecto CachiBache, transformando una estructura plana (archivos en la raíz de cada módulo) en una **arquitectura escalable y mantenible** basada en los principios SOLID y las mejores prácticas de NestJS.

### Objetivos de la Reorganización

- **Escalabilidad**: Facilitar el crecimiento del proyecto sin generar caos estructural
- **Mantenibilidad**: Hacer el código más fácil de entender, modificar y depurar
- **Separación de responsabilidades**: Cada archivo y carpeta tiene un propósito claro
- **Desacoplamiento**: Reducir las dependencias entre módulos
- **Reusabilidad**: Crear servicios compartidos accesibles desde toda la aplicación

---

## El Problema que Resolvemos

### Problemas de la Estructura Anterior

#### 1. Estructura Plana No Escalable

```
auth/
├── auth.service.ts
├── auth.controller.ts
├── auth.module.ts
├── jwt.strategy.ts
├── jwt-auth.guard.ts
├── get-user.decorator.ts
├── dto/
│   ├── login-user.dto.ts
│   └── register-user.dto.ts
```

**Problemas:**
- Todos los archivos mezclados en la raíz del módulo
- Difícil identificar el tipo de archivo a simple vista
- No hay agrupación lógica por tipo de responsabilidad
- A medida que crece el módulo, se vuelve inmanejable (imagina 20+ archivos en la raíz)

#### 2. Lógica de Negocio en Entidades

```typescript
// ❌ ANTES: user.entity.ts
@Entity('users')
export class User {
  // ... campos ...

  // Método en la entidad (rompe SRP - Single Responsibility Principle)
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Otro método en la entidad (lógica de negocio mezclada con modelo)
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
```

**Problemas:**
- Las entidades deben ser **solo modelos de datos** (representar la estructura de la BD)
- Mezclar lógica de negocio en entidades viola el principio de responsabilidad única
- Dificulta el testing (necesitas instanciar la entidad completa para probar la lógica)
- Acoplamiento alto: cambiar bcrypt requiere modificar la entidad

#### 3. Acoplamiento entre Módulos

```typescript
// ❌ ANTES: users.service.ts
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UsersService {
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    // UsersService depende de un DTO de Auth
  }
}
```

**Problemas:**
- `UsersModule` depende de `AuthModule` para un simple DTO
- Dependencia circular potencial
- El módulo de usuarios no puede usarse sin el de autenticación
- Dificulta la reutilización: si quiero crear usuarios desde otro contexto (admin, scripts), tengo que importar DTOs de auth

#### 4. Duplicación de Lógica

```typescript
// auth.service.ts
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// users.service.ts
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);

// reset-password.service.ts (futuro)
const salt = await bcrypt.genSalt(10);
// ... mismo código repetido
```

**Problemas:**
- Código duplicado en múltiples lugares
- Difícil de mantener: cambiar el algoritmo requiere modificar N archivos
- Propenso a inconsistencias

---

## Estructura: Antes vs Después

### Estructura ANTES (Plana)

```
backend/src/
├── auth/
│   ├── auth.service.ts              # 🔴 Todos mezclados en raíz
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── get-user.decorator.ts
│   └── dto/
│       ├── login-user.dto.ts
│       └── register-user.dto.ts
│
├── users/
│   ├── users.service.ts             # 🔴 Todos mezclados en raíz
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── entities/
│       ├── user.entity.ts           # 🔴 Contiene lógica de negocio
│       └── user-role.enum.ts
│
├── reports/
│   ├── reports.service.ts           # 🔴 Todos mezclados en raíz
│   ├── reports.controller.ts
│   ├── reports.module.ts
│   ├── entities/
│   └── dto/
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

### Estructura DESPUÉS (Organizada)

```
backend/src/
├── common/                          # ✅ NUEVO - Servicios compartidos
│   ├── services/
│   │   └── encryption.service.ts   # ✅ Lógica de encriptación centralizada
│   ├── decorators/                  # ✅ Preparado para decoradores globales
│   ├── filters/                     # ✅ Preparado para exception filters
│   ├── guards/                      # ✅ Preparado para guards globales
│   ├── interceptors/                # ✅ Preparado para interceptors
│   ├── interfaces/                  # ✅ Preparado para interfaces compartidas
│   ├── utils/                       # ✅ Preparado para utilidades
│   └── common.module.ts             # ✅ Módulo global
│
├── config/                          # ✅ NUEVO - Configuraciones
│   └── database/                    # ✅ Preparado para config de BD
│
├── auth/
│   ├── services/
│   │   └── auth.service.ts         # ✅ Servicios de autenticación
│   ├── controllers/
│   │   └── auth.controller.ts      # ✅ Controladores de auth
│   ├── strategies/
│   │   └── jwt.strategy.ts         # ✅ Estrategias de Passport
│   ├── guards/
│   │   └── jwt-auth.guard.ts       # ✅ Guards de autenticación
│   ├── decorators/
│   │   └── get-user.decorator.ts   # ✅ Decoradores personalizados
│   ├── dto/
│   │   ├── login-user.dto.ts
│   │   └── register-user.dto.ts
│   └── auth.module.ts
│
├── users/
│   ├── services/
│   │   └── users.service.ts        # ✅ Servicios de usuarios
│   ├── controllers/
│   │   └── users.controller.ts     # ✅ Controladores de usuarios
│   ├── entities/
│   │   ├── user.entity.ts          # ✅ Solo modelo (sin lógica)
│   │   └── user-role.enum.ts
│   ├── dto/
│   │   └── create-user.dto.ts      # ✅ NUEVO - DTO propio desacoplado
│   └── users.module.ts
│
├── reports/
│   ├── services/
│   │   └── reports.service.ts      # ✅ Servicios de reportes
│   ├── controllers/
│   │   └── reports.controller.ts   # ✅ Controladores de reportes
│   ├── entities/
│   │   ├── report.entity.ts
│   │   ├── photo.entity.ts
│   │   ├── report-history.entity.ts
│   │   ├── report-status.enum.ts
│   │   └── report-severity.enum.ts
│   ├── dto/
│   │   └── create-report.dto.ts
│   └── reports.module.ts
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

### Comparación Visual Rápida

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Organización** | Plana (todos en raíz) | Jerárquica (por tipo) |
| **Escalabilidad** | Baja (caótica al crecer) | Alta (clara agrupación) |
| **Servicios compartidos** | No existían | Módulo `common/` |
| **Lógica de negocio** | En entidades | En servicios |
| **Acoplamiento** | Alto (auth ↔ users) | Bajo (DTOs propios) |
| **Navegación** | Difícil (muchos archivos) | Fácil (buscar por tipo) |

---

## Cambios de Archivos Detallados

### Resumen de Cambios

- **Archivos movidos:** 9
- **Archivos nuevos:** 3
- **Archivos modificados:** 14+
- **Carpetas nuevas:** 17

### Archivos Movidos con Justificación

#### Módulo Auth

| Archivo Original | Nueva Ubicación | Razón del Cambio |
|------------------|-----------------|------------------|
| `auth/auth.service.ts` | `auth/services/auth.service.ts` | Agrupar todos los servicios del módulo en una carpeta dedicada. Facilita encontrar lógica de negocio. |
| `auth/auth.controller.ts` | `auth/controllers/auth.controller.ts` | Separar controladores (capa HTTP) de servicios (lógica). Mejor organización en módulos grandes. |
| `auth/jwt.strategy.ts` | `auth/strategies/jwt.strategy.ts` | Estrategias de Passport en carpeta propia. Permite múltiples estrategias (Google, Facebook, etc.) organizadas. |
| `auth/jwt-auth.guard.ts` | `auth/guards/jwt-auth.guard.ts` | Guards de autenticación centralizados. Facilita agregar más guards (roles, permisos, etc.). |
| `auth/get-user.decorator.ts` | `auth/decorators/get-user.decorator.ts` | Decoradores personalizados en carpeta específica. Escalable para más decoradores. |

#### Módulo Users

| Archivo Original | Nueva Ubicación | Razón del Cambio |
|------------------|-----------------|------------------|
| `users/users.service.ts` | `users/services/users.service.ts` | Agrupar servicios. Preparado para más servicios (UserProfileService, UserSettingsService, etc.). |
| `users/users.controller.ts` | `users/controllers/users.controller.ts` | Separar controladores. Facilita agregar UserAdminController, UserProfileController, etc. |

#### Módulo Reports

| Archivo Original | Nueva Ubicación | Razón del Cambio |
|------------------|-----------------|------------------|
| `reports/reports.service.ts` | `reports/services/reports.service.ts` | Agrupar servicios. Escalable para ReportAnalyticsService, ReportNotificationService, etc. |
| `reports/reports.controller.ts` | `reports/controllers/reports.controller.ts` | Separar controladores. Permite ReportAdminController, ReportPublicController, etc. |

### Patrón de Organización Aplicado

Cada módulo ahora sigue esta estructura estándar:

```
nombre-modulo/
├── services/       # Lógica de negocio
├── controllers/    # Capa HTTP (endpoints)
├── strategies/     # Estrategias de Passport (si aplica)
├── guards/         # Guards de autorización/autenticación (si aplica)
├── decorators/     # Decoradores personalizados (si aplica)
├── entities/       # Modelos de datos (TypeORM)
├── dto/            # Data Transfer Objects
└── nombre-modulo.module.ts
```

**Ventajas:**
- **Predecibilidad**: Todos los módulos se estructuran igual
- **Escalabilidad**: Fácil agregar más archivos sin generar desorden
- **Onboarding**: Nuevos desarrolladores entienden la estructura rápidamente
- **Búsqueda**: "¿Dónde está la lógica de X?" → "En `services/`"

---

## Archivos Nuevos Creados

### 1. `common/services/encryption.service.ts`

**Ubicación:** `backend/src/common/services/encryption.service.ts`

**Propósito:** Centralizar toda la lógica de encriptación de contraseñas en un servicio reutilizable.

**Código Completo:**

```typescript
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  /**
   * Hash a plain text password using bcrypt
   * @param password - Plain text password to hash
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param plainPassword - Plain text password to verify
   * @param hashedPassword - Hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
```

**Por qué era necesario:**

1. **Eliminar duplicación**: Antes, el código de hashing estaba en `user.entity.ts` y potencialmente duplicado en otros lugares
2. **Responsabilidad única**: Un servicio dedicado únicamente a encriptación
3. **Testeable**: Fácil de probar en aislamiento con mocks
4. **Reusable**: Cualquier módulo puede usarlo (auth, users, reset-password, etc.)
5. **Mantenible**: Cambiar el algoritmo de bcrypt a argon2 solo requiere modificar este archivo

**Ejemplo de uso:**

```typescript
// En cualquier servicio
constructor(private readonly encryptionService: EncryptionService) {}

async createUser(password: string) {
  const hashedPassword = await this.encryptionService.hashPassword(password);
  // ...
}

async validatePassword(plain: string, hashed: string) {
  const isValid = await this.encryptionService.comparePasswords(plain, hashed);
  // ...
}
```

---

### 2. `common/common.module.ts`

**Ubicación:** `backend/src/common/common.module.ts`

**Propósito:** Crear un módulo global que provee servicios compartidos a toda la aplicación.

**Código Completo:**

```typescript
import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';

@Global() // Hace que este módulo sea global, disponible en toda la aplicación
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService], // Exporta para que otros módulos puedan usarlo
})
export class CommonModule {}
```

**Por qué era necesario:**

1. **Evitar imports repetidos**: Sin `@Global()`, cada módulo que necesite `EncryptionService` tendría que importar `CommonModule`
2. **Servicios compartidos centralizados**: Un único lugar para servicios que se usan en toda la app
3. **Configuración única**: Se importa una sola vez en `AppModule`
4. **Escalabilidad**: Fácil agregar más servicios compartidos (EmailService, SmsService, FileUploadService, etc.)

**Cómo funciona:**

```typescript
// En app.module.ts
@Module({
  imports: [
    CommonModule, // Se importa una sola vez
    AuthModule,
    UsersModule,
    // ...
  ],
})
export class AppModule {}

// En cualquier servicio de cualquier módulo
@Injectable()
export class AuthService {
  constructor(
    // EncryptionService está disponible sin importar CommonModule
    private readonly encryptionService: EncryptionService
  ) {}
}
```

**Decorador `@Global()` explicado:**

- Sin `@Global()`: Cada módulo debe importar explícitamente `CommonModule`
- Con `@Global()`: Se importa una vez en `AppModule` y está disponible en toda la app
- Es ideal para servicios utilitarios que se usan en múltiples módulos

---

### 3. `users/dto/create-user.dto.ts`

**Ubicación:** `backend/src/users/dto/create-user.dto.ts`

**Propósito:** Desacoplar el módulo de usuarios del módulo de autenticación creando un DTO propio.

**Código Completo:**

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  termsAccepted?: boolean;
}
```

**Por qué era necesario:**

#### Problema Anterior

```typescript
// ❌ ANTES: users.service.ts
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UsersService {
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    // UsersService depende de AuthModule
  }
}
```

**Problemas:**
- `UsersModule` acoplado a `AuthModule`
- `UsersService` solo puede crear usuarios con el DTO de registro
- No puedo crear usuarios desde otros contextos (panel admin, scripts, etc.)
- Dependencia circular potencial

#### Solución Actual

```typescript
// ✅ DESPUÉS: users.service.ts
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    // UsersService independiente, solo depende de su propio DTO
  }
}
```

**Beneficios:**
- `UsersModule` es independiente y reutilizable
- Puedo crear usuarios desde cualquier contexto
- `RegisterUserDto` (de auth) puede extender o mapear a `CreateUserDto`
- Separación clara: Auth maneja el registro, Users maneja CRUD

**Relación entre DTOs:**

```typescript
// auth/dto/register-user.dto.ts
export class RegisterUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string; // Obligatorio en registro

  @IsBoolean()
  termsAccepted: boolean; // Obligatorio en registro
}

// En auth.service.ts
async register(registerUserDto: RegisterUserDto) {
  // Mapea RegisterUserDto a CreateUserDto
  const createUserDto: CreateUserDto = {
    ...registerUserDto,
  };

  const newUser = await this.usersService.create(createUserDto);
  // ...
}
```

**Diferencias clave:**
- `RegisterUserDto`: Específico para el endpoint de registro (password obligatorio, etc.)
- `CreateUserDto`: Genérico para crear usuarios (password opcional para Google Auth)

---

## Modificaciones en Archivos Existentes

### 1. `users/entities/user.entity.ts` - Removida Lógica de Negocio

**Cambio:** Se eliminaron los métodos `hashPassword()` y `validatePassword()`.

#### Código ANTES

```typescript
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password?: string;

  // ❌ Lógica de negocio en la entidad
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // ❌ Más lógica de negocio en la entidad
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
```

#### Código DESPUÉS

```typescript
// Sin imports de bcrypt
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude() // Excluir password de las respuestas JSON
  @Column()
  password?: string;

  // ✅ Solo campos, sin métodos de lógica de negocio
  // La entidad es solo un modelo de datos
}
```

#### ¿Por qué este cambio?

**Principio de Responsabilidad Única (SRP)**

- **Antes**: La entidad User tenía 2 responsabilidades
  1. Representar la estructura de datos (campos de BD)
  2. Manejar lógica de encriptación de passwords

- **Después**: La entidad User tiene 1 responsabilidad
  1. Solo representar la estructura de datos

**Ventajas del cambio:**

1. **Testabilidad**
   ```typescript
   // ❌ ANTES: Difícil de testear
   const user = new User();
   user.password = 'test123';
   await user.hashPassword(); // Necesitas instanciar User completo

   // ✅ DESPUÉS: Fácil de testear
   const result = await encryptionService.hashPassword('test123');
   expect(result).toBeDefined();
   ```

2. **Mantenibilidad**
   - Cambiar de bcrypt a argon2: solo modificas `EncryptionService`
   - Antes: modificar la entidad (riesgoso, afecta muchos lugares)

3. **Reutilización**
   - El servicio de encriptación puede usarse para otras cosas (tokens, API keys, etc.)
   - Antes: la lógica estaba "encerrada" en la entidad User

4. **Separación de capas**
   - Entidades = Capa de datos (modelos)
   - Servicios = Capa de negocio (lógica)

---

### 2. `auth/services/auth.service.ts` - Ahora Usa EncryptionService

**Cambio:** Se inyecta `EncryptionService` para validar contraseñas.

#### Código ANTES

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // ❌ No había servicio de encriptación
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findOneByEmail(email);

    // ❌ Llamada al método de la entidad
    if (user && user.password && (await user.validatePassword(password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}
```

#### Código DESPUÉS

```typescript
import { EncryptionService } from '../../common/services/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService, // ✅ Inyectado
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findOneByEmail(email);

    // ✅ Llamada al servicio de encriptación
    if (
      user &&
      user.password &&
      (await this.encryptionService.comparePasswords(password, user.password))
    ) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}
```

#### Beneficios

1. **Desacoplamiento**: `AuthService` no depende de la implementación interna de `User`
2. **Consistencia**: Toda la app usa el mismo método para comparar passwords
3. **Testing**: Fácil mockear `EncryptionService` en tests

---

### 3. `users/services/users.service.ts` - Usa CreateUserDto y EncryptionService

**Cambio:** Cambió el DTO de entrada y delega el hashing al `EncryptionService`.

#### Código ANTES

```typescript
import { RegisterUserDto } from '../../auth/dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // ❌ No había servicio de encriptación
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = this.userRepository.create(registerUserDto);

    // ❌ Lógica de hashing llamando a la entidad
    if (newUser.password) {
      await newUser.hashPassword();
    }

    return this.userRepository.save(newUser);
  }
}
```

#### Código DESPUÉS

```typescript
import { CreateUserDto } from '../dto/create-user.dto'; // ✅ DTO propio
import { EncryptionService } from '../../common/services/encryption.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService, // ✅ Inyectado
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // ✅ Hash password usando el servicio antes de crear la entidad
    if (createUserDto.password) {
      createUserDto.password =
        await this.encryptionService.hashPassword(createUserDto.password);
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }
}
```

#### Beneficios

1. **Desacoplamiento de Auth**: Ya no depende de `RegisterUserDto`
2. **Lógica centralizada**: El hashing siempre pasa por `EncryptionService`
3. **Flexibilidad**: Ahora puedo crear usuarios desde cualquier contexto

---

### 4. `reports/services/reports.service.ts` - Limpieza de Código

**Cambio:** Removidos `console.log` de debug.

```typescript
// ❌ ANTES
console.log('Creating report with data:', createReportDto);

// ✅ DESPUÉS
// Sin console.log (usar logger apropiado en producción)
```

**Por qué:**
- Los `console.log` no deben estar en producción
- Usar el `Logger` de NestJS para logs apropiados
- Mejor trazabilidad y control de logs

---

### 5. Módulos (*.module.ts) - Actualización de Imports

Todos los módulos actualizaron sus imports para reflejar las nuevas rutas.

#### auth.module.ts

```typescript
// ❌ ANTES
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// ✅ DESPUÉS
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommonModule } from '../common/common.module'; // ✅ NUEVO

@Module({
  imports: [
    UsersModule,
    CommonModule, // ✅ Para usar EncryptionService
    PassportModule,
    JwtModule,
  ],
  // ...
})
```

#### users.module.ts

```typescript
// ❌ ANTES
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// ✅ DESPUÉS
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { CommonModule } from '../common/common.module'; // ✅ NUEVO

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule, // ✅ Para usar EncryptionService
  ],
  // ...
})
```

#### app.module.ts

```typescript
// ✅ NUEVO: Importar CommonModule
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ /* ... */ }),
    CommonModule, // ✅ Módulo global con servicios compartidos
    AuthModule,
    UsersModule,
    ReportsModule,
  ],
  // ...
})
```

---

## Beneficios de la Nueva Estructura

### 1. Escalabilidad

#### Antes
```
auth/
├── auth.service.ts
├── auth.controller.ts
├── oauth.service.ts              # ¿Nuevo servicio? Raíz desordenada
├── two-factor.service.ts         # Más archivos en raíz
├── jwt.strategy.ts
├── google.strategy.ts            # Se mezcla con todo
├── facebook.strategy.ts
├── jwt-auth.guard.ts
├── roles.guard.ts                # Difícil distinguir qué es qué
├── permissions.guard.ts
├── auth.module.ts
└── dto/
```

#### Después
```
auth/
├── services/
│   ├── auth.service.ts           # ✅ Todos los servicios agrupados
│   ├── oauth.service.ts
│   └── two-factor.service.ts
├── strategies/
│   ├── jwt.strategy.ts           # ✅ Todas las estrategias agrupadas
│   ├── google.strategy.ts
│   └── facebook.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts         # ✅ Todos los guards agrupados
│   ├── roles.guard.ts
│   └── permissions.guard.ts
├── controllers/
│   └── auth.controller.ts
├── dto/
└── auth.module.ts
```

**Ventaja:** Con 20+ archivos, la estructura organizada sigue siendo navegable.

---

### 2. Mantenibilidad

#### Búsqueda Intuitiva

```
Pregunta: "¿Dónde está la lógica de autenticación?"
Respuesta: auth/services/auth.service.ts

Pregunta: "¿Dónde están los guards de permisos?"
Respuesta: auth/guards/

Pregunta: "¿Dónde agrego una nueva estrategia de login?"
Respuesta: auth/strategies/
```

**Antes:** Tenías que buscar entre todos los archivos en la raíz.
**Después:** La carpeta te indica el tipo de archivo.

---

### 3. Separación de Responsabilidades (SOLID)

#### Single Responsibility Principle (SRP)

**Antes:**
```typescript
@Entity('users')
export class User {
  // Responsabilidad 1: Modelo de datos
  @Column()
  email: string;

  // Responsabilidad 2: Lógica de encriptación
  async hashPassword() { /* ... */ }

  // Responsabilidad 3: Validación de negocio
  async validatePassword() { /* ... */ }
}
```

**Después:**
```typescript
// user.entity.ts - Solo modelo
@Entity('users')
export class User {
  @Column()
  email: string;
}

// encryption.service.ts - Solo encriptación
@Injectable()
export class EncryptionService {
  hashPassword() { /* ... */ }
  comparePasswords() { /* ... */ }
}

// auth.service.ts - Solo lógica de autenticación
@Injectable()
export class AuthService {
  validateUser() { /* ... */ }
}
```

**Cada clase tiene una única razón para cambiar.**

---

### 4. Desacoplamiento de Módulos

#### Antes: Acoplamiento Alto

```
┌─────────────┐
│ AuthModule  │
│  └─ RegisterUserDto
└─────────────┘
       ↑
       │ depende de
       │
┌─────────────┐
│ UsersModule │
│  └─ UsersService.create(RegisterUserDto)
└─────────────┘
```

**Problema:** Users depende de Auth. No puedo usar Users sin Auth.

#### Después: Desacoplamiento

```
┌─────────────┐
│ AuthModule  │
│  └─ RegisterUserDto ──┐
└─────────────┘         │ mapea a
       ↓                ↓
┌─────────────┐    ┌────────────────┐
│ UsersModule │    │ CreateUserDto  │
│  └─ UsersService.create(CreateUserDto)
└─────────────┘    └────────────────┘
```

**Solución:** Users tiene su propio DTO. Auth mapea su DTO al de Users.

---

### 5. Reusabilidad

#### Servicios Compartidos

```typescript
// Antes: Lógica duplicada
// auth.service.ts
const hashedPassword = await bcrypt.hash(password, 10);

// users.service.ts
const hashedPassword = await bcrypt.hash(password, 10);

// reset-password.service.ts
const hashedPassword = await bcrypt.hash(password, 10);
```

```typescript
// Después: Servicio reutilizable
// En cualquier parte
const hashedPassword = await this.encryptionService.hashPassword(password);
```

**Ventaja:** Un cambio en un lugar (DRY - Don't Repeat Yourself).

---

## Ejemplos Prácticos: Imports Antes y Después

### Ejemplo 1: auth.controller.ts

#### ANTES

```typescript
// auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; // ❌ Raíz del módulo
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.validateUser(loginUserDto);
  }
}
```

#### DESPUÉS

```typescript
// auth/controllers/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service'; // ✅ Carpeta services/
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.validateUser(loginUserDto);
  }
}
```

**Cambio:** `./auth.service` → `../services/auth.service`

---

### Ejemplo 2: users.service.ts

#### ANTES

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // ❌ Ruta relativa corta
import { RegisterUserDto } from '../auth/dto/register-user.dto'; // ❌ Depende de auth

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = this.userRepository.create(registerUserDto);
    await newUser.hashPassword(); // ❌ Lógica en entidad
    return this.userRepository.save(newUser);
  }
}
```

#### DESPUÉS

```typescript
// users/services/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // ✅ Desde services/
import { CreateUserDto } from '../dto/create-user.dto'; // ✅ DTO propio
import { EncryptionService } from '../../common/services/encryption.service'; // ✅ Servicio compartido

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService, // ✅ Inyectado
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // ✅ Lógica en servicio
    if (createUserDto.password) {
      createUserDto.password =
        await this.encryptionService.hashPassword(createUserDto.password);
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }
}
```

**Cambios clave:**
1. `./entities/user.entity` → `../entities/user.entity`
2. `../auth/dto/register-user.dto` → `../dto/create-user.dto`
3. Agregado import de `EncryptionService`
4. Lógica de hashing movida del entity al service

---

### Ejemplo 3: auth.module.ts

#### ANTES

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service'; // ❌ Raíz
import { AuthController } from './auth.controller'; // ❌ Raíz
import { JwtStrategy } from './jwt.strategy'; // ❌ Raíz
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({ /* ... */ }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

#### DESPUÉS

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service'; // ✅ Carpeta services/
import { AuthController } from './controllers/auth.controller'; // ✅ Carpeta controllers/
import { JwtStrategy } from './strategies/jwt.strategy'; // ✅ Carpeta strategies/
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module'; // ✅ NUEVO
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    CommonModule, // ✅ Para EncryptionService
    PassportModule,
    JwtModule.registerAsync({ /* ... */ }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

**Cambios:**
1. Todos los imports ahora apuntan a subcarpetas
2. Agregado `CommonModule` a los imports

---

## Guía de Navegación

### ¿Dónde Encuentro Cada Tipo de Archivo?

| Quiero encontrar... | Ubicación | Ejemplo |
|---------------------|-----------|---------|
| **Lógica de negocio** | `{modulo}/services/` | `auth/services/auth.service.ts` |
| **Endpoints HTTP** | `{modulo}/controllers/` | `users/controllers/users.controller.ts` |
| **Modelos de datos** | `{modulo}/entities/` | `users/entities/user.entity.ts` |
| **Validación de entrada** | `{modulo}/dto/` | `auth/dto/login-user.dto.ts` |
| **Estrategias de Passport** | `{modulo}/strategies/` | `auth/strategies/jwt.strategy.ts` |
| **Guards de autorización** | `{modulo}/guards/` | `auth/guards/jwt-auth.guard.ts` |
| **Decoradores personalizados** | `{modulo}/decorators/` | `auth/decorators/get-user.decorator.ts` |
| **Servicios compartidos** | `common/services/` | `common/services/encryption.service.ts` |
| **Configuraciones** | `config/` | `config/database/` |

---

### Flujo de Navegación por Casos de Uso

#### Caso 1: "Quiero cambiar cómo se hashean las contraseñas"

1. Ir a: `common/services/encryption.service.ts`
2. Modificar `hashPassword()` y `comparePasswords()`
3. Todos los módulos usan automáticamente el nuevo algoritmo

#### Caso 2: "Quiero agregar un nuevo endpoint de usuarios"

1. Ir a: `users/controllers/users.controller.ts`
2. Agregar el nuevo método con decoradores `@Get()`, `@Post()`, etc.
3. Si necesitas lógica nueva, agregarla en `users/services/users.service.ts`

#### Caso 3: "Quiero agregar autenticación con Facebook"

1. Crear: `auth/strategies/facebook.strategy.ts`
2. Registrar en: `auth/auth.module.ts` (providers array)
3. Usar en: `auth/controllers/auth.controller.ts`

#### Caso 4: "Quiero agregar un guard de roles"

1. Crear: `auth/guards/roles.guard.ts`
2. Usar en controladores con `@UseGuards(RolesGuard)`
3. Potencialmente crear decorador en `auth/decorators/roles.decorator.ts`

---

### Mapa Mental de la Estructura

```
Backend
│
├─ common/           → Código compartido (usa desde cualquier módulo)
│  ├─ services/      → Utilidades (encryption, email, sms, etc.)
│  ├─ guards/        → Guards globales (throttle, etc.)
│  └─ decorators/    → Decoradores globales
│
├─ config/           → Configuraciones (database, jwt, aws, etc.)
│
└─ {módulos}/        → Funcionalidades de negocio (auth, users, reports)
   ├─ services/      → Lógica de negocio específica del módulo
   ├─ controllers/   → Endpoints HTTP del módulo
   ├─ strategies/    → Estrategias de autenticación (solo en auth)
   ├─ guards/        → Guards específicos del módulo
   ├─ decorators/    → Decoradores específicos del módulo
   ├─ entities/      → Modelos de datos (tablas de BD)
   └─ dto/           → Validación de entrada/salida
```

---

## Principios Arquitectónicos Aplicados

### 1. SOLID

#### S - Single Responsibility Principle

**Cada clase tiene una única responsabilidad:**

- `User` (entity) → Solo representar datos
- `EncryptionService` → Solo encriptar
- `AuthService` → Solo autenticar
- `UsersService` → Solo CRUD de usuarios

#### O - Open/Closed Principle

**Abierto a extensión, cerrado a modificación:**

```typescript
// Puedo extender funcionalidad sin modificar código existente
@Injectable()
export class Argon2EncryptionService extends EncryptionService {
  // Override con nueva implementación
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
```

#### L - Liskov Substitution Principle

**Los servicios son intercambiables:**

```typescript
// Puedo sustituir EncryptionService por cualquier implementación
constructor(
  private readonly encryptionService: EncryptionService // Puede ser Bcrypt, Argon2, etc.
) {}
```

#### I - Interface Segregation Principle

**Interfaces pequeñas y específicas:**

```typescript
// No fuerzo a implementar métodos innecesarios
interface IEncryptionService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(plain: string, hashed: string): Promise<boolean>;
}
```

#### D - Dependency Inversion Principle

**Depender de abstracciones, no de implementaciones:**

```typescript
// AuthService depende de la abstracción (EncryptionService)
// No depende de bcrypt directamente
constructor(
  private readonly encryptionService: EncryptionService // Abstracción
) {}
```

---

### 2. DRY (Don't Repeat Yourself)

**Antes:** Código de hashing duplicado en múltiples archivos.
**Después:** Un único `EncryptionService` usado por todos.

---

### 3. Separation of Concerns

**Capas claramente separadas:**

```
┌─────────────────────────────────┐
│  Capa HTTP (Controllers)        │ ← Maneja requests/responses
├─────────────────────────────────┤
│  Capa de Negocio (Services)     │ ← Lógica de la aplicación
├─────────────────────────────────┤
│  Capa de Datos (Entities/Repos) │ ← Acceso a base de datos
└─────────────────────────────────┘
```

Cada capa en su propia carpeta:
- `controllers/` → Capa HTTP
- `services/` → Capa de negocio
- `entities/` → Capa de datos

---

### 4. Modularidad

**Módulos independientes y reutilizables:**

- `AuthModule` → Puede usarse en otra app
- `UsersModule` → Independiente, sin dependencias de Auth
- `CommonModule` → Utilidades compartidas

---

### 5. Convention Over Configuration

**Estructura predecible:**

Todos los módulos siguen la misma convención:
```
nombre-modulo/
├── services/
├── controllers/
├── entities/
├── dto/
└── nombre-modulo.module.ts
```

Cualquier desarrollador sabe dónde buscar cada cosa.

---

## Resumen Ejecutivo

### Cambios Realizados

| Categoría | Cantidad | Detalles |
|-----------|----------|----------|
| Carpetas creadas | 17 | `common/`, subcarpetas en módulos |
| Archivos movidos | 9 | Servicios, controladores, guards, strategies |
| Archivos nuevos | 3 | `EncryptionService`, `CommonModule`, `CreateUserDto` |
| Archivos modificados | 14+ | Entidades, servicios, módulos |

---

### Beneficios Clave

1. **Escalabilidad** → Fácil agregar nuevos archivos sin desorden
2. **Mantenibilidad** → Código organizado por tipo y responsabilidad
3. **Testabilidad** → Servicios aislados fáciles de testear
4. **Desacoplamiento** → Módulos independientes y reutilizables
5. **Reusabilidad** → Servicios compartidos en `CommonModule`
6. **Consistencia** → Todos los módulos siguen la misma estructura

---

### Próximos Pasos Recomendados

1. **Agregar Logger Service**
   - Crear `common/services/logger.service.ts`
   - Reemplazar `console.log` con logger apropiado

2. **Implementar Exception Filters**
   - Crear `common/filters/http-exception.filter.ts`
   - Manejo centralizado de errores

3. **Agregar Interceptors**
   - `common/interceptors/transform.interceptor.ts` (transformar responses)
   - `common/interceptors/logging.interceptor.ts` (log de requests)

4. **Configuración de Database**
   - Mover config de TypeORM a `config/database/typeorm.config.ts`

5. **Testing**
   - Crear tests unitarios para `EncryptionService`
   - Tests de integración para `AuthService`

6. **Documentación**
   - Agregar Swagger/OpenAPI para documentar endpoints
   - Comments JSDoc en servicios

---

### Conclusión

Esta reorganización transforma el proyecto de una **estructura plana y acoplada** a una **arquitectura modular, escalable y mantenible** que sigue las mejores prácticas de NestJS y los principios SOLID.

El código ahora es:
- Más fácil de entender
- Más fácil de modificar
- Más fácil de testear
- Más fácil de escalar
- Más profesional y production-ready

Esta base sólida permitirá al equipo desarrollar nuevas funcionalidades de manera eficiente y sin generar deuda técnica.

---

**Tags:** #nestjs #arquitectura #refactoring #solid #clean-code #backend #typescript
