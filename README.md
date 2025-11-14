# Cachi-Bache

<p align="center">
  <strong>Sistema de Reporte y Gestión de Baches Urbanos</strong>
</p>

<p align="center">
  Plataforma móvil ciudadana para la detección, reporte y seguimiento de baches en la vía pública, con panel administrativo para gestión y priorización de reparaciones.
</p>

## 🛠️ Stack Técnico

### Frontend
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tamagui](https://img.shields.io/badge/Tamagui-4630EB?style=for-the-badge&logo=react&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-6C47FF?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Formik](https://img.shields.io/badge/Formik-172B4D?style=for-the-badge&logo=formik&logoColor=white)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FEAC32?style=for-the-badge&logo=typeorm&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)

### Cloud & Services
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Google Auth](https://img.shields.io/badge/Google_Auth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=mail.ru&logoColor=white)

### Tools
![PNPM](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![EAS](https://img.shields.io/badge/EAS-000020?style=for-the-badge&logo=expo&logoColor=white)

## Tabla de Contenidos

- [Stack Técnico](#️-stack-técnico)
- [Sobre el Proyecto](#sobre-el-proyecto)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico Detallado](#stack-tecnológico-1)
- [Arquitectura](#arquitectura)
- [Configuración de Servicios](#configuración-de-servicios)
- [Deployment](#deployment)
- [Equipo](#equipo)
- [Licencia](#licencia)

## Sobre el Proyecto

**Cachi-Bache** es una aplicación móvil desarrollada con **React Native** y **Expo** que permite a los ciudadanos reportar baches en tiempo real con geolocalización y evidencia fotográfica. El backend está construido con **NestJS** y **PostgreSQL**, proporcionando una API REST robusta y segura. El sistema incluye un panel administrativo para la gestión y priorización de reportes.

### Objetivos

- Facilitar la participación ciudadana en el mantenimiento urbano
- Optimizar la gestión administrativa de reportes
- Brindar transparencia mediante seguimiento en tiempo real
- Utilizar datos geolocalizados para mejorar la toma de decisiones

## Funcionalidades

### 👥 Para Usuarios Ciudadanos

**📍 Reporte de Baches**
- Captura fotográfica
- Geolocalización automática por GPS
- Descripción mediante texto o voz

**🔍 Seguimiento de Reportes**

Estados del reporte:
1. **Pendiente**: Reporte recién creado
2. **En reparación**: Trabajo en proceso
3. **Resuelto**: Bache reparado
4. **Descartado**: Reporte descartado

**🔔 Notificaciones**
- Alertas push al cambiar el estado del reporte
- Notificación de reparación completada
- Actualizaciones en tiempo real

**🗺️ Mapa Interactivo**
- Visualización de baches reportados
- Filtros por estado
- Detalle completo al seleccionar un marcador

**👤 Perfil de Usuario**
- Historial de reportes
- Estadísticas de participación
- Gestión de foto de perfil (Cloudinary)

**🔐 Autenticación**
- Login con email/contraseña o Google
- Sesiones persistentes de hasta 30 días
- Almacenamiento seguro (JWT + Refresh Tokens)

### 👨‍💼 Para Administradores

**📊 Panel de Administración**
- Dashboard con métricas clave
- Navegación por tabs

**🗂️ Gestión de Reportes**
- Vista de todos los reportes
- Actualización de estados
- Filtros y búsqueda
- Asignación de prioridades

**📄 Reportes PDF**
- Generación de reportes estadísticos
- Información detallada por bache
- Exportación para análisis

---

## Stack Tecnológico

### 📱 Frontend (Mobile)
- **Framework**: React Native 0.81.5 + Expo 54
- **Routing**: Expo Router 6 (file-based routing)
- **UI Library**: Tamagui 1.132.23
- **Mapas**: React Native Maps
- **Gestión de Estado**: React Context API
- **Validación**: Formik + Yup
- **HTTP Client**: Axios con interceptores
- **Autenticación**: Expo SecureStore
- **Notificaciones**: Expo Notifications
- **Reconocimiento de Voz**: Expo Speech Recognition
- **Imágenes**: Expo Image Picker + Cloudinary

### 🔧 Backend (API)
- **Framework**: NestJS 11 (Node.js + TypeScript)
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM 0.3.27
- **Autenticación**: Passport JWT + Google OAuth
- **Generación PDF**: PDFMake
- **Upload de Imágenes**: Cloudinary SDK
- **Emails**: Resend
- **Seguridad**: Rate Limiting (Throttler), bcrypt
- **Notificaciones**: Expo Server SDK

### ☁️ DevOps & Deployment
- **Backend Hosting**: Railway
- **Database**: PostgreSQL en Railway
- **Frontend Build**: EAS (Expo Application Services)
- **Distribución**: APK binaria para Android
- **Control de Versiones**: Git + GitHub

---

## Arquitectura

### Estructura del Proyecto

```
CachiBache/
├── frontend/                    # Aplicación móvil React Native
│   ├── app/                    # Rutas (Expo Router file-based)
│   │   ├── (app)/             # Rutas autenticadas
│   │   ├── (admin)/           # Panel admin
│   │   └── (auth)/            # Login/Register
│   ├── src/
│   │   ├── features/          # Módulos por funcionalidad
│   │   │   ├── admin/        # Panel administrativo
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── home/         # Mapa y dashboard
│   │   │   ├── profile/      # Perfil de usuario
│   │   │   └── reports/      # Gestión de reportes
│   │   └── shared/           # Código compartido
│   │       ├── components/   # Componentes reutilizables
│   │       ├── config/       # Configuración
│   │       ├── contexts/     # Context API (Auth, Theme)
│   │       ├── hooks/        # Custom hooks
│   │       ├── services/     # API calls
│   │       ├── types/        # TypeScript types
│   │       ├── utils/        # Utilidades
│   │       └── validation/   # Schemas de validación
│   └── assets/               # Imágenes, iconos
│
└── backend/                    # API REST con NestJS
    └── src/
        ├── auth/              # Autenticación JWT + OAuth
        │   ├── controllers/   # Auth endpoints
        │   ├── services/      # Auth service + Refresh tokens
        │   ├── strategies/    # JWT + Google strategies
        │   ├── guards/        # Auth guards
        │   ├── decorators/    # Custom decorators
        │   ├── dto/           # Data transfer objects
        │   └── entities/      # RefreshToken entity
        ├── users/             # Gestión de usuarios
        ├── reports/           # Reportes de baches
        ├── notifications/     # Push notifications (Expo)
        ├── cloudinary/        # Upload de imágenes
        ├── admin/             # Panel administrativo
        ├── common/            # Shared resources
        └── config/            # Configuración de la app
```

### Autenticación

Sistema de autenticación basado en **JWT con Refresh Tokens**:

- **Access Token**: Válido por 1 hora
- **Refresh Token**: Válido por 30 días, almacenado en base de datos
- **Renovación automática**: Los tokens se renuevan sin intervención del usuario

## Configuración de Servicios

### Firebase Cloud Messaging (FCM V1)

Servicio de Firebase para envío de notificaciones push a dispositivos Android. Requiere dos archivos de configuración:

**1. Service Account Key** (para el servidor)
- Credenciales del backend para enviar notificaciones
- Archivo JSON descargado desde Firebase Console → Service Accounts
- Subido a Expo Dashboard → Credentials → Android → FCM V1
- Permite al backend autenticarse con Firebase para enviar push notifications

**2. google-services.json** (para la app)
- Archivo de configuración de Firebase para la aplicación móvil Android
- Descargado desde Firebase Console → Project Settings → General
- Configurado como variable de entorno en EAS: `GOOGLE_SERVICES_JSON`
- Permite a la app Android conectarse al proyecto Firebase y recibir notificaciones

### Google Authentication (OAuth 2.0)

Configuración para login con Google:

| Configuración | Valor |
|--------------|-------|
| **Google Cloud Project** | Configurado con credenciales OAuth 2.0 |
| **Web Client ID** | Configurado en Google Cloud Console |
| **Authorized Redirect URIs** | Configurados para desarrollo y producción |
| **Scopes** | `email`, `profile` |

### EAS Build - Variables de Entorno

Variables configuradas en Expo Application Services:

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `EXPO_PUBLIC_API_URL` | String | URL del backend en Railway para comunicación con la API |
| `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` | String | Nombre del cloud de Cloudinary para subir imágenes de reportes |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | String | API Key de Google Maps para visualizar el mapa de baches |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | String | Client ID para autenticación con Google OAuth 2.0 |
| `GOOGLE_SERVICES_JSON` | File | Archivo de configuración de Firebase necesario para notificaciones push en Android |

**Comando para configurar variables:**
```bash
# Variables de texto
eas env:create --name NOMBRE_VARIABLE --value "valor"

# Variables de archivo (como google-services.json)
eas env:create --name GOOGLE_SERVICES_JSON --type file
```

---

## Deployment

### 🚂 Backend - Railway

El backend está deployado en **Railway**:

- Deploy automático al hacer push a GitHub
- Base de datos PostgreSQL
- Variables de entorno seguras
- SSL/HTTPS
- Logs en tiempo real

**Variables de entorno:**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=***
JWT_REFRESH_SECRET=***
CLOUDINARY_CLOUD_NAME=***
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
GOOGLE_CLIENT_ID=***
RESEND_API_KEY=***
```

### 📦 Frontend - EAS Build

La aplicación móvil se compila con **EAS (Expo Application Services)**:

- APK binaria para Android
- Optimizada para producción
- Firmada con keystore
- Distribución directa o Google Play Store

**Build de producción:**
```bash
eas build --platform android --profile production
```

**Configuración (`eas.json`):**
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## Equipo

- [@Diego Lalanda](https://github.com/DiegoLalanda)
- [@Fernanda Elola](https://github.com/FernandaElola)
- [@Enrique Pierotti Castillo](https://github.com/pierotticastillo)
- [@Manuel Alejandro García](https://github.com/Manuelgarcia1)

---

## Licencia

Proyecto académico - Universidad Nacional de Entre Ríos (UNER)
Facultad de Ciencias de la Administración (FCAD)

---

<p align="center">
  Desarrollado por el equipo Cachi-Bache
</p>
