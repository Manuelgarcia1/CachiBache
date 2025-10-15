# Animaciones de Markers en el Mapa - CachiBache

## 📋 Índice
1. [Visión General](#visión-general)
2. [Conceptos de React Native Reanimated](#conceptos-de-react-native-reanimated)
3. [SelectionMarker - Bounce al cambiar posición](#selectionmarker---bounce-al-cambiar-posición)
4. [ReportMarker - Pulse continuo](#reportmarker---pulse-continuo)
5. [Consumidores y Flujo de Datos](#consumidores-y-flujo-de-datos)
6. [Diagrama de Arquitectura](#diagrama-de-arquitectura)

---

## Visión General

El sistema de animaciones de markers implementa **feedback visual interactivo** para mejorar la experiencia de usuario en dos contextos:

1. **Crear reporte** (`SelectionMarker`) - Bounce al seleccionar ubicación del bache
2. **Ver reportes** (`ReportMarker`) - Pulse continuo en reportes pendientes para llamar la atención

### Ubicación de archivos

```
src/
└── shared/
    └── components/
        └── map/
            ├── SelectionMarker.tsx    # Marker con bounce (create-report)
            ├── ReportMarker.tsx       # Marker con pulse (home)
            └── index.ts               # Exports
```

### Tecnología

- **Librería**: `react-native-reanimated` v4.1.0
- **Patrón**: Componentes compartidos reutilizables
- **Performance**: Animaciones en UI thread (60 FPS)

---

## Conceptos de React Native Reanimated

### 1. `useSharedValue()`

**¿Qué es?**
- Valor animable que vive en el **UI thread** (no en JavaScript thread)
- Similar a `useState` pero optimizado para animaciones de alto rendimiento

**Ejemplo:**
```typescript
const scale = useSharedValue(1);
scale.value = 1.5; // Leer/escribir con .value
```

**Beneficio:** No bloquea el hilo principal de JavaScript, animaciones fluidas incluso con JS sobrecargado.

---

### 2. `useAnimatedStyle()`

**¿Qué es?**
- Hook que convierte valores compartidos en estilos CSS
- Se ejecuta en el UI thread
- Se actualiza automáticamente cuando cambian los shared values

**Ejemplo:**
```typescript
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  opacity: opacity.value
}));
```

**Uso:**
```tsx
<Animated.View style={animatedStyle}>
  {/* contenido */}
</Animated.View>
```

---

### 3. `withTiming()`

**¿Qué es?**
- Anima un valor de forma suave en un tiempo determinado
- Equivalente a `transition` en CSS

**Sintaxis:**
```typescript
withTiming(
  valorFinal,
  { duration: milisegundos, easing: Easing.ease }
)
```

**Ejemplo:**
```typescript
scale.value = withTiming(1.3, { duration: 150 });
// Anima scale de su valor actual a 1.3 en 150ms
```

---

### 4. `withSequence()`

**¿Qué es?**
- Ejecuta animaciones **una después de otra** (secuencial)
- Como una coreografía de movimientos

**Ejemplo:**
```typescript
scale.value = withSequence(
  withTiming(1.3, { duration: 150 }),  // 1. Se agranda
  withTiming(0.9, { duration: 150 }),  // 2. Se achica
  withTiming(1.1, { duration: 150 }),  // 3. Se agranda un poco
  withTiming(1, { duration: 150 })     // 4. Vuelve a normal
);
// Total: 600ms
```

---

### 5. `withRepeat()`

**¿Qué es?**
- Repite una animación múltiples veces o infinitamente

**Sintaxis:**
```typescript
withRepeat(
  animacion,
  repeticiones,  // -1 = infinito
  reverse        // true = ida y vuelta, false = siempre igual
)
```

**Ejemplo:**
```typescript
scale.value = withRepeat(
  withSequence(
    withTiming(1.15, { duration: 800 }),
    withTiming(1, { duration: 800 })
  ),
  -1,    // Infinito
  false  // No reverse
);
```

---

## SelectionMarker - Bounce al cambiar posición

### Archivo
`src/shared/components/map/SelectionMarker.tsx`

### Propósito
Marker rojo para **seleccionar la ubicación del bache** en el formulario de crear reporte. Hace bounce cada vez que el usuario mueve el marker.

### Código comentado

```typescript
import { useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface SelectionMarkerProps {
  /** Key única que cambia cuando se mueve el marker (ej: "lat-lng") */
  locationKey?: string;
}

export function SelectionMarker({ locationKey }: SelectionMarkerProps) {
  // 1. Valor compartido para el scale (tamaño)
  const scale = useSharedValue(1);

  // 2. Detecta cuando cambia la ubicación
  useEffect(() => {
    if (locationKey) {
      // 3. Ejecuta animación de bounce
      scale.value = withSequence(
        withTiming(1.3, { duration: 150 }),  // Agranda 30%
        withTiming(0.9, { duration: 150 }),  // Achica 10%
        withTiming(1.1, { duration: 150 }),  // Agranda 10%
        withTiming(1, { duration: 150 })     // Normal
      );
    }
  }, [locationKey, scale]);

  // 4. Convierte scale en estilo CSS
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 5. Renderiza marker con animación
  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor="#ef4444"  // Rojo
        width={30}
        height={30}
        borderRadius={15}
        alignItems="center"
        justifyContent="center"
        borderWidth={2}
        borderColor="#fff"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.3}
        shadowRadius={3}
      >
        <Feather name="alert-triangle" size={16} color="#fff" />
      </YStack>
    </Animated.View>
  );
}
```

### Animación visual

```
Tiempo: 0ms    150ms   300ms   450ms   600ms
Tamaño: 1   →  1.3  →  0.9  →  1.1  →   1
        ↑       ↑       ↑       ↑       ↑
      normal  grande  chico  mediano  normal

Duración total: 600ms (0.6 segundos)
Trigger: Cambio en locationKey
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `locationKey` | `string` (opcional) | String único que representa la ubicación. Cuando cambia, se ejecuta el bounce. Ejemplo: `"${lat}-${lng}"` |

### Consumidor

**Archivo:** `src/features/reports/components/create-report/LocationMapSection.tsx`

```typescript
<Marker
  coordinate={{
    latitude: location.latitude,
    longitude: location.longitude,
  }}
  title="Ubicación del bache"
  description={location.address}
>
  <SelectionMarker
    locationKey={`${location.latitude}-${location.longitude}`}
  />
</Marker>
```

**Flujo:**
1. Usuario toca el mapa
2. `onMapPress` actualiza `location.latitude` y `location.longitude`
3. `locationKey` cambia (nueva concatenación lat-lng)
4. `SelectionMarker` detecta cambio en `useEffect`
5. Ejecuta bounce

---

## ReportMarker - Pulse continuo

### Archivo
`src/shared/components/map/ReportMarker.tsx`

### Propósito
Marker para **mostrar reportes existentes** en el mapa del home. Los reportes pendientes (rojos) pulsan continuamente para llamar la atención. Los demás son estáticos.

### Código comentado

```typescript
import { useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

type ReportStatus = 'PENDIENTE' | 'EN REPARACION' | 'FINALIZADO';

interface ReportMarkerProps {
  status: ReportStatus;
}

// 1. Mapeo de colores según estado
function getMarkerColor(status: ReportStatus): string {
  switch (status) {
    case 'PENDIENTE':
      return '#EF4444';    // Rojo - Requiere atención
    case 'EN REPARACION':
      return '#F97316';    // Naranja - En proceso
    case 'FINALIZADO':
      return '#22C55E';    // Verde - Completado
    default:
      return '#6B7280';    // Gris - Por defecto
  }
}

export function ReportMarker({ status }: ReportMarkerProps) {
  const color = getMarkerColor(status);
  const scale = useSharedValue(1);
  const shouldPulse = status === 'PENDIENTE';

  // 2. Inicia animación según estado
  useEffect(() => {
    if (shouldPulse) {
      // 3. Pulse infinito para reportes pendientes
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,    // Repetir infinitamente
        false  // No hacer reverse (siempre la misma secuencia)
      );
    } else {
      // 4. Sin animación para otros estados
      scale.value = 1;
    }
  }, [shouldPulse, scale]);

  // 5. Estilo animado
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 6. Renderiza marker con color dinámico
  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor={color}  // Color según status
        width={32}
        height={32}
        borderRadius={16}
        alignItems="center"
        justifyContent="center"
        borderWidth={2}
        borderColor="#fff"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.3}
        shadowRadius={3}
      >
        <Feather name="alert-triangle" size={16} color="#fff" />
      </YStack>
    </Animated.View>
  );
}
```

### Animación visual por estado

#### Estado: PENDIENTE (Rojo)
```
Tiempo:  0ms    800ms   1600ms  2400ms  3200ms  ...
Tamaño:  1  →  1.15 →   1   →  1.15 →   1   →  (infinito)
         ↑      ↑       ↑      ↑       ↑
       normal  crece  normal  crece  normal

Duración ciclo: 1.6 segundos
Repeticiones: Infinitas
Color: Rojo (#EF4444)
```

#### Estado: EN REPARACION (Naranja)
```
Tamaño: 1 (estático, sin animación)
Color: Naranja (#F97316)
```

#### Estado: FINALIZADO (Verde)
```
Tamaño: 1 (estático, sin animación)
Color: Verde (#22C55E)
```

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `status` | `'PENDIENTE' \| 'EN REPARACION' \| 'FINALIZADO'` | Estado del reporte que determina color y si tiene animación |

### Consumidor

**Archivo:** `src/features/home/components/MapViewPlaceholder.tsx`

```typescript
// 1. Datos mock de reportes
const [mockReports, setMockReports] = useState<ReportData[]>([
  {
    id: '1',
    status: 'PENDIENTE',
    coordinate: { latitude: -34.6037, longitude: -58.3816 },
    title: 'Bache en calle principal'
  },
  {
    id: '2',
    status: 'EN REPARACION',
    coordinate: { latitude: -34.6040, longitude: -58.3820 },
    title: 'Bache en avenida'
  },
  {
    id: '3',
    status: 'FINALIZADO',
    coordinate: { latitude: -34.6035, longitude: -58.3810 },
    title: 'Bache reparado'
  }
]);

// 2. Renderizado en el mapa
<MapView>
  {mockReports.map((report) => (
    <Marker
      key={report.id}
      coordinate={report.coordinate}
      title={report.title}
      description={`Estado: ${report.status}`}
    >
      <ReportMarker status={report.status} />
    </Marker>
  ))}
</MapView>
```

**Resultado visual:**
- Marker id='1' → Rojo pulsando (PENDIENTE)
- Marker id='2' → Naranja estático (EN REPARACION)
- Marker id='3' → Verde estático (FINALIZADO)

---

## Consumidores y Flujo de Datos

### 1. SelectionMarker

#### Consumidor único
**Archivo:** `src/features/reports/components/create-report/LocationMapSection.tsx`

**Contexto de uso:**
- Formulario de crear reporte de bache
- Usuario selecciona ubicación en el mapa

**Flujo completo:**

```
1. Usuario entra a "Crear reporte"
   ↓
2. CreateReportScreen.tsx renderiza LocationMapSection
   ↓
3. LocationMapSection muestra MapView con SelectionMarker
   ↓
4. Ubicación inicial: Buenos Aires (default)
   locationKey: "-34.6037--58.3816"
   ↓
5. Usuario toca el mapa en otro punto
   ↓
6. onMapPress actualiza location en useReportForm
   ↓
7. location cambia → locationKey cambia
   ↓
8. SelectionMarker detecta cambio en useEffect
   ↓
9. Ejecuta bounce (1.3 → 0.9 → 1.1 → 1)
   ↓
10. Usuario ve feedback visual: "Ubicación actualizada"
```

**Código del consumidor:**

```typescript
// src/features/reports/components/create-report/LocationMapSection.tsx
export function LocationMapSection({
  location,
  mapRegion,
  onMapPress,
  onGetCurrentLocation,
  isGettingLocation = false,
}: LocationMapSectionProps) {
  return (
    <YStack>
      <MapView
        region={mapRegion}
        onPress={onMapPress}  // Detecta toques en el mapa
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        >
          {/* locationKey cambia cuando location cambia */}
          <SelectionMarker
            locationKey={`${location.latitude}-${location.longitude}`}
          />
        </Marker>
      </MapView>
    </YStack>
  );
}
```

**Trigger de animación:**
- Tocar el mapa → `onMapPress` → actualiza coordenadas
- Presionar "Mi ubicación" → GPS → actualiza coordenadas
- Cualquier cambio en `location.latitude` o `location.longitude`

---

### 2. ReportMarker

#### Consumidor único
**Archivo:** `src/features/home/components/MapViewPlaceholder.tsx`

**Contexto de uso:**
- Pantalla principal (home) de la app
- Muestra todos los reportes de baches en el mapa

**Flujo completo:**

```
1. Usuario abre la app
   ↓
2. HomeScreen.tsx renderiza MapViewPlaceholder
   ↓
3. MapViewPlaceholder solicita permisos de ubicación
   ↓
4. Obtiene ubicación GPS del usuario
   ↓
5. generateMockReportsNearLocation() crea 3 reportes
   alrededor de la ubicación actual
   ↓
6. mockReports contiene array con 3 reportes:
   [
     { id: '1', status: 'PENDIENTE', coordinate: {...} },
     { id: '2', status: 'EN REPARACION', coordinate: {...} },
     { id: '3', status: 'FINALIZADO', coordinate: {...} }
   ]
   ↓
7. .map() renderiza un Marker por cada reporte
   ↓
8. Cada Marker contiene un ReportMarker con su status
   ↓
9. ReportMarker evalúa status:
   - PENDIENTE → Inicia pulse infinito (rojo)
   - EN REPARACION → Estático (naranja)
   - FINALIZADO → Estático (verde)
   ↓
10. Usuario ve el mapa con 3 markers:
    - 1 rojo pulsando (llama atención)
    - 1 naranja estático
    - 1 verde estático
```

**Código del consumidor:**

```typescript
// src/features/home/components/MapViewPlaceholder.tsx

// Función que genera reportes alrededor de una ubicación
function generateMockReportsNearLocation(lat: number, lng: number): ReportData[] {
  return [
    {
      id: '1',
      title: 'Bache en calle principal',
      status: 'PENDIENTE',
      coordinate: { latitude: lat + 0.003, longitude: lng + 0.002 },
      location: 'Calle Principal 742',
    },
    {
      id: '2',
      title: 'Bache en avenida',
      status: 'EN REPARACION',
      coordinate: { latitude: lat - 0.002, longitude: lng + 0.003 },
      location: 'Avenida Central 123',
    },
    {
      id: '3',
      title: 'Bache reparado',
      status: 'FINALIZADO',
      coordinate: { latitude: lat + 0.001, longitude: lng - 0.002 },
      location: 'Boulevard Sur 456',
    },
  ];
}

export function MapViewPlaceholder() {
  const [mockReports, setMockReports] = useState<ReportData[]>(
    generateMockReportsNearLocation(INITIAL_REGION.latitude, INITIAL_REGION.longitude)
  );

  const getCurrentLocation = async () => {
    const location = await Location.getCurrentPositionAsync();

    // Regenera markers alrededor de la nueva ubicación
    setMockReports(
      generateMockReportsNearLocation(
        location.coords.latitude,
        location.coords.longitude
      )
    );
  };

  return (
    <MapView>
      {mockReports.map((report) => (
        <Marker
          key={report.id}
          coordinate={report.coordinate}
          title={report.title}
        >
          {/* ReportMarker decide color y animación según status */}
          <ReportMarker status={report.status} />
        </Marker>
      ))}
    </MapView>
  );
}
```

**Trigger de animación:**
- Automático al montar el componente
- Solo reportes con `status='PENDIENTE'` pulsan
- Pulso continúa hasta que el componente se desmonte

---

## Diagrama de Arquitectura

### Estructura de archivos y dependencias

```
src/
├── shared/
│   └── components/
│       ├── index.ts
│       │   └── export { SelectionMarker, ReportMarker } from './map'
│       └── map/
│           ├── index.ts
│           │   ├── export { SelectionMarker }
│           │   └── export { ReportMarker }
│           ├── SelectionMarker.tsx ←────┐
│           └── ReportMarker.tsx ←───┐   │
│                                     │   │
└── features/                         │   │
    ├── reports/                      │   │
    │   └── components/               │   │
    │       └── create-report/        │   │
    │           └── LocationMapSection.tsx ──┘
    │               (consume SelectionMarker)
    │
    └── home/
        └── components/
            └── MapViewPlaceholder.tsx ──────┘
                (consume ReportMarker)
```

### Flujo de datos - SelectionMarker

```
Usuario toca mapa
    ↓
onMapPress (LocationMapSection)
    ↓
updateLocation (useReportForm hook)
    ↓
location state actualizado
    ↓
LocationMapSection re-renderiza
    ↓
locationKey prop cambia: "lat-lng"
    ↓
SelectionMarker useEffect detecta cambio
    ↓
scale.value = withSequence(...)
    ↓
useAnimatedStyle actualiza transform
    ↓
Marker hace bounce visual
```

### Flujo de datos - ReportMarker

```
App inicia → HomeScreen → MapViewPlaceholder
    ↓
Solicita permisos GPS
    ↓
Obtiene ubicación actual
    ↓
generateMockReportsNearLocation(lat, lng)
    ↓
setMockReports([...]) con 3 reportes
    ↓
mockReports.map((report) => ...)
    ↓
Renderiza 3 <Marker> con <ReportMarker status={...} />
    ↓
Cada ReportMarker evalúa su status:
    ├─ PENDIENTE → scale.value = withRepeat(...) → Pulse infinito
    ├─ EN REPARACION → scale.value = 1 → Estático
    └─ FINALIZADO → scale.value = 1 → Estático
```

---

## Comparación lado a lado

| Aspecto | SelectionMarker | ReportMarker |
|---------|-----------------|--------------|
| **Archivo** | `SelectionMarker.tsx` | `ReportMarker.tsx` |
| **Consumidor** | `LocationMapSection.tsx` (create-report) | `MapViewPlaceholder.tsx` (home) |
| **Propósito** | Feedback al seleccionar ubicación | Mostrar reportes existentes |
| **Trigger** | Cambio en `locationKey` | Montaje del componente |
| **Condición** | Siempre se anima cuando cambia ubicación | Solo si `status === 'PENDIENTE'` |
| **Duración** | 600ms (una vez) | 1.6s por ciclo (infinito) |
| **Animación** | Bounce (1 → 1.3 → 0.9 → 1.1 → 1) | Pulse (1 → 1.15 → 1 → repetir) |
| **Color** | Rojo fijo `#ef4444` | Dinámico según status |
| **Props** | `locationKey: string` | `status: ReportStatus` |
| **Shared Values** | `scale` | `scale` |
| **Easing** | Default (linear) | `Easing.inOut(Easing.ease)` |
| **Repeticiones** | 1 vez | Infinitas (`-1`) |

---

## Decisiones de diseño

### ¿Por qué SelectionMarker solo anima al cambiar ubicación?

**Problema original:** Tenía animación de "drop" que se ejecutaba al cargar la pantalla.

**Problema detectado:**
- La animación no tenía sentido porque el marker ya estaba ahí
- Era molesto ver la caída cada vez que entrabas a crear reporte

**Solución:**
- Cambiar a bounce que se ejecuta **solo cuando el usuario interactúa**
- Usar `locationKey` como trigger para detectar cambios
- Resultado: Feedback claro de "ubicación actualizada"

---

### ¿Por qué solo los reportes PENDIENTES pulsan?

**Principio:** Jerarquía visual

- **PENDIENTE** → Requiere atención urgente → Pulse rojo llamativo
- **EN REPARACION** → Ya está en proceso → Naranja estático (informativo)
- **FINALIZADO** → Ya está resuelto → Verde estático (no requiere acción)

**Beneficio:** El usuario puede escanear el mapa rápidamente y ver qué reportes necesitan atención.

---

### ¿Por qué usar Shared Values y no useState?

**Performance:**
- `useState` → Ejecuta en JS thread → Re-renderiza componente → Puede causar lag
- `useSharedValue` → Ejecuta en UI thread → No re-renderiza → 60 FPS garantizados

**Ejemplo:**
```typescript
// ❌ Malo (lag con muchas animaciones)
const [scale, setScale] = useState(1);

// ✅ Bueno (fluido)
const scale = useSharedValue(1);
```

---

## Testing manual

### Probar SelectionMarker

1. Abrir app → Ir a "Crear reporte"
2. Tocar el mapa en diferentes puntos
3. **Resultado esperado:** Marker hace bounce cada vez que se mueve
4. Presionar "Mi ubicación"
5. **Resultado esperado:** Marker hace bounce al cambiar a tu ubicación GPS

---

### Probar ReportMarker

1. Abrir app → Ver pantalla home con mapa
2. Esperar a que se obtenga ubicación GPS
3. **Resultado esperado:**
   - Ver 3 markers alrededor de tu ubicación
   - 1 marker rojo debe estar pulsando (agrandándose y achicándose)
   - 1 marker naranja debe estar estático
   - 1 marker verde debe estar estático
4. Observar el marker rojo durante 5 segundos
5. **Resultado esperado:** Pulso continuo sin interrupciones

---

## Próximas mejoras potenciales

### 1. Agregar haptic feedback
```typescript
import * as Haptics from 'expo-haptics';

useEffect(() => {
  if (locationKey) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(...);
  }
}, [locationKey]);
```

### 2. Customizar animación según tipo de bache
```typescript
<ReportMarker
  status={report.status}
  severity="high"  // Nueva prop
/>
// severity="high" → Pulso más rápido
// severity="low" → Pulso más lento
```

### 3. Animación al hacer tap en marker
```typescript
const handlePress = () => {
  scale.value = withSequence(
    withTiming(0.8, { duration: 100 }),
    withTiming(1, { duration: 100 })
  );
  onPress();
};
```

---

## Referencias

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Repositorio de referencia](https://github.com/franco-ruisdias-uner/animacion-gestos)
- Documentación interna: `funcionamiento-reporte-baches.md`

---

## Resumen ejecutivo

**SelectionMarker:**
- ✅ Bounce al mover ubicación
- ✅ Feedback visual claro
- ✅ 600ms de duración
- ✅ Usado en create-report

**ReportMarker:**
- ✅ Pulse infinito para reportes pendientes
- ✅ Colores dinámicos por estado
- ✅ 1.6s por ciclo
- ✅ Usado en home

**Consumidores:**
- `LocationMapSection.tsx` → SelectionMarker
- `MapViewPlaceholder.tsx` → ReportMarker

**Tecnología:**
- React Native Reanimated v4.1.0
- Animaciones en UI thread (60 FPS)
- Shared values + Animated styles
