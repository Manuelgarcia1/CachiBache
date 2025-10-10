# Sistema de Reporte de Baches - CachiBache

## Visión General

El sistema de reporte de baches permite a los usuarios autenticados crear reportes con título, descripción, foto y ubicación geográfica exacta. El flujo completo involucra validación de usuario, navegación, formularios interactivos, selección de ubicación en mapa y captura de imágenes.

---

## Flujo Completo del Sistema

### 1. Inicio del Reporte (HomeScreen → ReportButton)

**Archivo:** `src/features/home/components/ReportButton.tsx`

El proceso inicia cuando el usuario presiona el botón "Reportar Bache" en la pantalla principal.

**Validaciones:**
- Si el usuario es invitado (`isGuest`), se muestra un Alert con tres opciones:
  - Cancelar
  - Iniciar sesión ("Ya tengo una cuenta")
  - Crear cuenta nueva
- Si el usuario está autenticado, se procede con el reporte

**Navegación:**
```typescript
router.push('/(app)/create-report');
```

---

### 2. Pantalla de Creación (CreateReportScreen)

**Archivo:** `src/features/reports/components/create-report/CreateReportScreen.tsx`

Esta es la pantalla principal que orquesta todo el formulario de reporte.

**Estructura:**
- Header con botón de retroceso
- ScrollView conteniendo tres secciones principales:
  1. ReportFormSection (formulario)
  2. LocationMapSection (mapa)
  3. Botón de envío

**Hooks utilizados:**
- `useReportForm()` - Gestión del estado del formulario
- `useLocationPermissions()` - Permisos y ubicación GPS
- `useSafeAreaInsets()` - Espaciado seguro en dispositivos

---

### 3. Sección de Formulario (ReportFormSection)

**Archivo:** `src/features/reports/components/create-report/ReportFormSection.tsx`

Contiene los campos principales del reporte:

**Campos:**
- **Título** (obligatorio): Input de texto simple
- **Descripción** (obligatorio): Input multilínea (4 líneas, altura 100px)
- **Foto** (opcional): Botón que abre ImagePickerButton

**Props recibidas:**
```typescript
{
  title, description, imageUri,
  onTitleChange, onDescriptionChange, onImageSelected
}
```

---

### 4. Captura de Imágenes (ImagePickerButton)

**Archivo:** `src/features/reports/components/create-report/ImagePickerButton.tsx`

**Hook:** `useImagePicker.ts`

**Cuándo se activa:**
- El hook se inicializa cuando el componente ImagePickerButton se monta
- Se ejecuta cuando el usuario presiona el botón "Agregar foto" o "Cambiar foto"
- Llama a `showImagePickerOptions(onImageSelected)` que muestra el Alert

**Flujo de selección de imagen:**

1. Usuario presiona "Agregar foto"
2. Se ejecuta `showImagePickerOptions()`
3. Se muestra un Alert con opciones:
   - Cancelar
   - **Tomar foto** → Ejecuta `takePhoto()` → Solicita permisos de cámara
   - **Elegir de galería** → Ejecuta `pickImageFromGallery()` → Solicita permisos de galería

**Características:**
- Compresión de calidad: 0.8
- Aspect ratio: 4:3
- Permite edición antes de confirmar
- Muestra preview de la imagen seleccionada (120px de altura)

**Gestión de permisos:**
```typescript
// Para cámara
await ImagePicker.requestCameraPermissionsAsync();

// Para galería
await ImagePicker.requestMediaLibraryPermissionsAsync();
```

---

### 5. Selección de Ubicación (LocationMapSection)

**Archivo:** `src/features/reports/components/create-report/LocationMapSection.tsx`

**Hook:** `useLocationPermissions.ts`

**Cuándo se activa:**
- El hook se inicializa cuando CreateReportScreen se monta
- Se ejecuta cuando el usuario presiona el botón "Mi ubicación"
- Llama a `handleGetCurrentLocation()` que invoca `getCurrentLocation()` del hook

**Componentes:**
- MapView de React Native Maps
- Botón "Mi ubicación" con ícono de pin
- Marker personalizado (CustomMarker)
- Texto con dirección/coordenadas

**Dos formas de seleccionar ubicación:**

#### A) Ubicación Actual (GPS)
1. Usuario presiona "Mi ubicación"
2. Se ejecuta `handleGetCurrentLocation()` → `getCurrentLocation()`
3. Se solicitan permisos de ubicación en primer plano
4. Se obtiene coordenadas con precisión balanceada
5. Se actualiza el mapa con zoom cercano (latitudeDelta: 0.005)

#### B) Selección Manual
1. Usuario toca cualquier punto del mapa
2. Evento `onPress` captura coordenadas
3. Se actualiza el marcador en esa posición
4. Se muestra coordenadas como dirección temporal

**Configuración del mapa:**
```typescript
{
  showsUserLocation: true,      // Muestra punto azul del usuario
  showsMyLocationButton: false, // Usamos botón personalizado
  height: 200                   // Altura fija del mapa
}
```

---

### 6. Gestión del Estado (useReportForm)

**Archivo:** `src/features/reports/hooks/useReportForm.ts`

Este hook centraliza toda la lógica del formulario.

**Cuándo se activa:**
- Se inicializa automáticamente cuando CreateReportScreen se monta
- Se ejecuta continuamente mientras el usuario interactúa con el formulario
- Métodos específicos se llaman en respuesta a eventos:
  - `updateTitle()` / `updateDescription()` → Cuando el usuario escribe
  - `updateImage()` → Cuando se selecciona una foto
  - `handleMapPress()` → Cuando se toca el mapa
  - `submitReport()` → Cuando se presiona "Enviar reporte"

**Estado gestionado:**
```typescript
{
  reportData: {
    title: string,
    description: string,
    location: { latitude, longitude, address },
    image?: string
  },
  mapRegion: { latitude, longitude, latitudeDelta, longitudeDelta },
  isSubmitting: boolean
}
```

**Región inicial:**
- Buenos Aires, Argentina (-34.6037, -58.3816)
- Delta: 0.01 (vista amplia inicial)

**Métodos principales:**
- `updateTitle()`, `updateDescription()`, `updateImage()` - Actualizan campos
- `updateLocation()`, `updateMapRegion()` - Actualizan mapa
- `handleMapPress()` - Captura clicks en el mapa
- `validateForm()` - Valida título y descripción no vacíos
- `submitReport()` - Envía el reporte

---

### 7. Envío del Reporte (Submit)

**Flujo de envío:**

1. Usuario presiona "Enviar reporte"
2. Se ejecuta `validateForm()`:
   - Verifica que título no esté vacío
   - Verifica que descripción no esté vacía
   - Si falla, muestra Alert "Campos requeridos"
3. Si validación pasa:
   - Se cambia estado a `isSubmitting = true`
   - Botón muestra "Enviando reporte..." y se deshabilita
   - Simulación de envío (setTimeout 2 segundos)
   - Se muestra Alert de éxito
   - Se navega de vuelta (`router.back()`)

**Nota:** Actualmente el envío es simulado. En producción se conectaría a una API backend.

---

## Stack Tecnológico

### Tecnologías Principales
- **React Native** - Framework de la app
- **Expo** - Plataforma de desarrollo
- **Expo Router** - Sistema de navegación basado en archivos
- **Tamagui** - Librería de componentes UI (Button, Input, YStack, XStack)

### Librerías Específicas
- **React Native Maps** - Visualización de mapas y marcadores
- **Expo Location** - Geolocalización y permisos de ubicación
- **Expo Image Picker** - Captura de fotos y acceso a galería
- **@expo/vector-icons** (Feather) - Íconos

### Patrones de Código
- **Custom Hooks** - Separación de lógica de negocio
- **Component Composition** - Componentes pequeños y reutilizables
- **TypeScript** - Tipado estricto con interfaces

---

## Componentes y Responsabilidades

| Componente | Responsabilidad |
|------------|----------------|
| `ReportButton` | Trigger inicial, validación de usuario autenticado |
| `CreateReportScreen` | Orquestador principal, integra todas las secciones |
| `ReportFormSection` | Formulario (título, descripción, imagen) |
| `LocationMapSection` | Mapa interactivo y selección de ubicación |
| `ImagePickerButton` | Captura/selección de fotos |
| `CustomMarker` | Marcador personalizado en el mapa |
| `useReportForm` | Estado y lógica del formulario |
| `useLocationPermissions` | Permisos y obtención de GPS |
| `useImagePicker` | Permisos y selección de imágenes |

---

## Diagrama de Flujo

```
[Usuario presiona "Reportar Bache"]
            ↓
    [¿Es usuario autenticado?]
       /              \
     NO               SÍ
      ↓                ↓
  [Alert:          [Navega a
   Crear            create-report]
   cuenta]              ↓
                   [CreateReportScreen]
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   [Formulario]      [Mapa]         [Imagen]
   - Título          - GPS           - Cámara
   - Descripción     - Click         - Galería
        └────────────────┼────────────────┘
                         ↓
                  [Validar campos]
                         ↓
                  [Enviar reporte]
                         ↓
                [Alert: Éxito + router.back()]
```

---

## Puntos Clave para Exposición

1. **Validación temprana** - Se verifica que el usuario esté autenticado antes de permitir reportar
2. **Experiencia de usuario fluida** - Estados de carga, botones deshabilitados, feedback visual
3. **Permisos bien gestionados** - Se solicitan solo cuando son necesarios, con mensajes claros
4. **Separación de responsabilidades** - Cada componente y hook tiene una tarea específica
5. **Ubicación flexible** - El usuario puede usar GPS o seleccionar manualmente en el mapa
6. **Validación antes de envío** - No se permite enviar reportes incompletos
7. **Feedback constante** - Alerts, textos de confirmación, estados visuales
