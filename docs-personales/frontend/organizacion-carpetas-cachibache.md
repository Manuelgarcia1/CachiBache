# Organización de Carpetas - CachiBache

**Fecha de creación:** 07 de octubre, 2025
**Tecnologías:** Expo Router, React Native, TypeScript

---

## 1. Estructura General del Proyecto

CachiBache utiliza **Expo Router** con una arquitectura moderna basada en el sistema de archivos (file-based routing). La organización se divide en dos grandes secciones:

```
CachiBache/
├── app/                    # Rutas y navegación (Expo Router)
│   ├── _layout.tsx         # Layout raíz con providers
│   ├── index.tsx           # Pantalla inicial / Welcome
│   ├── (auth)/             # Route Group: Autenticación
│   └── (app)/              # Route Group: App principal
│
└── src/                    # Lógica de negocio y componentes
    ├── features/           # Funcionalidades por dominio
    └── shared/             # Código compartido
```

### Separación de responsabilidades:
- **`app/`**: Define la estructura de rutas y navegación
- **`src/`**: Contiene toda la lógica, componentes y servicios

---

## 2. Route Groups: Organización de Rutas

Los **Route Groups** son carpetas especiales entre paréntesis `(nombre)` que agrupan rutas relacionadas **sin afectar la URL**. Permiten organizar lógicamente la navegación.

### ¿Por qué usar Route Groups?

En lugar de tener todas las pantallas al mismo nivel:
```
❌ Sin organización:
app/
├── login.tsx
├── register.tsx
├── forgot-password.tsx
├── home.tsx
├── reports.tsx
├── profile.tsx
```

Agrupamos rutas relacionadas:
```
✅ Con Route Groups:
app/
├── (auth)/              # Pantallas de autenticación
│   ├── _layout.tsx      # Stack navigator
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
│
└── (app)/               # Pantallas principales
    ├── _layout.tsx      # Tabs navigator
    ├── home.tsx
    ├── reports.tsx
    ├── profile.tsx
    └── create-report.tsx
```

### Route Groups en CachiBache:

#### **(auth)** - Grupo de Autenticación
- **Propósito:** Pantallas de inicio de sesión y registro
- **Navegación:** Stack Navigator (sin tabs)
- **Rutas:** `/login`, `/register`, `/forgot-password`
- **Características:** Sin header visible, flujo secuencial

#### **(app)** - Grupo de Aplicación Principal
- **Propósito:** Funcionalidad principal para usuarios autenticados
- **Navegación:** Tabs Navigator (barra inferior)
- **Rutas:** `/home`, `/reports`, `/profile`, `/create-report`
- **Protección:** Requiere autenticación (validación en `_layout.tsx`)
- **Características especiales:**
  - Modo invitado: muestra solo home + banner de registro
  - Tabs personalizados con iconos Feather
  - `create-report` oculto de tabs (acceso programático)

---

## 3. Carpeta `src/features/` - Arquitectura por Dominio

Cada **feature** agrupa todo lo relacionado con una funcionalidad específica, siguiendo el principio de **colocation** (código relacionado vive junto).

### Estructura de una feature típica:

```
src/features/
└── reports/
    ├── components/           # Componentes UI
    │   ├── create-report/    # Subfeature
    │   └── my-reports/       # Subfeature
    ├── hooks/                # Custom hooks
    ├── types/                # TypeScript types
    └── index.ts              # Barrel export
```

### Features implementadas:

#### **`auth/`** - Autenticación
- Componente: `LoginScreen`
- Maneja inicio de sesión con credenciales

#### **`welcome/`** - Pantalla de Bienvenida
- Componentes: `WelcomeScreen`, `AppLogo`, `LoginButtons`, `GuestOption`
- Primera pantalla que ve el usuario no autenticado

#### **`register/`** - Registro de Usuarios
- Componentes: `RegisterScreen`, `RegisterForm`, `RegisterButton`, `TermsCheckbox`
- Formulario completo de registro con validaciones

#### **`ForgotPassword/`** - Recuperación de Contraseña
- Componentes: `ForgotPasswordScreen`, `ForgotPasswordForm`, `ForgotPasswordButton`
- Flujo para restablecer contraseña

#### **`home/`** - Mapa Principal
- Componentes: `HomeScreen`, `MapViewPlaceholder`, `StatusLegend`, `ReportButton`
- Vista de mapa con reportes georreferenciados

#### **`reports/`** - Gestión de Reportes
- **Subfeatures organizadas:**
  - `create-report/`: Crear nuevos reportes (formulario + mapa + fotos)
  - `my-reports/`: Lista de reportes del usuario
- **Hooks personalizados:** `useReportForm`, `useLocationPermissions`, `useImagePicker`
- **Types:** Definiciones TypeScript de modelos de datos

#### **`profile/`** - Perfil de Usuario
- Componentes: `ProfileScreen`, `ProfileHeader`, `ProfileStats`, `ProfileDashboard`
- Información y estadísticas del usuario

---

## 4. Carpeta `src/shared/` - Código Compartido

Recursos utilizados por múltiples features:

```
src/shared/
├── components/           # Componentes reutilizables
│   ├── FormField.tsx     # Input genérico para formularios
│   ├── Header.tsx        # Header común
│   └── ReauthLoadingScreen.tsx
│
├── contexts/             # Context API
│   └── AuthContext.tsx   # Estado global de autenticación
│
├── utils/                # Utilidades
│   └── secure-store.ts   # Almacenamiento seguro (tokens)
│
└── validation/           # Validaciones
    └── schemas.ts        # Esquemas de validación (Zod/Yup)
```

### Principios de `shared/`:
- **Solo incluir código usado por 2+ features**
- **Evitar dependencias entre shared y features** (unidireccional)
- **Mantener componentes genéricos y configurables**

---

## 5. Flujo de Navegación

### Jerarquía de layouts:

```
app/_layout.tsx (Root)
  ├── Providers: SafeArea, Tamagui, Auth
  └── Stack Navigator
       ├── index.tsx (Welcome)
       ├── (auth)/_layout.tsx
       │    └── Stack: login, register, forgot-password
       └── (app)/_layout.tsx
            └── Tabs: home, reports, profile
```

### Lógica de navegación:

1. **`app/index.tsx`** verifica autenticación:
   - ✅ Con token → Redirige a `/(app)/home`
   - ❌ Sin token → Muestra `WelcomeScreen`

2. **`app/(app)/_layout.tsx`** protege rutas:
   - Valida token antes de renderizar
   - Modo invitado: solo home + banner
   - Usuario registrado: tabs completos

3. **`app/(auth)/_layout.tsx`** gestiona flujo de login:
   - Sin protección (acceso libre)
   - Stack para navegación secuencial

---

## 6. Resumen de Carpetas Principales

| Carpeta | Propósito | Ejemplo |
|---------|-----------|---------|
| `app/` | Rutas y navegación | `app/(app)/home.tsx` |
| `app/(auth)/` | Pantallas de login/registro | `login.tsx`, `register.tsx` |
| `app/(app)/` | Pantallas autenticadas | `home.tsx`, `reports.tsx` |
| `src/features/` | Lógica por funcionalidad | `features/reports/` |
| `src/shared/` | Código reutilizable | `shared/components/` |
| `assets/` | Imágenes y recursos | `assets/images/` |
| `docs/` | Documentación del proyecto | `README.md` |

---

## 7. Ventajas de Esta Arquitectura

1. **Escalabilidad:** Fácil agregar nuevas features sin afectar las existentes
2. **Mantenibilidad:** Código relacionado vive junto (colocation)
3. **Claridad:** Separación explícita entre rutas y lógica
4. **Reutilización:** Componentes shared accesibles desde cualquier feature
5. **Type Safety:** TypeScript con types organizados por dominio
6. **Developer Experience:** Navegación basada en archivos (convención sobre configuración)

---

## Conclusión

La arquitectura de CachiBache combina:
- **Expo Router** con Route Groups para navegación organizada
- **Feature-based structure** para lógica de negocio escalable
- **Shared utilities** para código común reutilizable

Esta organización permite que el equipo trabaje en features independientes sin conflictos, facilitando el desarrollo colaborativo y el mantenimiento a largo plazo.
