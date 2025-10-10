# Flujo de Autenticación - CachiBache

> Documento técnico sobre el sistema de autenticación con AuthContext y expo-router
>
> Fecha: 07/10/2025

---

## 1. Introducción

**AuthContext** es el corazón del sistema de autenticación en CachiBache. Es un contexto de React que:

- Gestiona el estado global de autenticación (token, usuario, loading)
- Proporciona métodos para login/logout
- Almacena tokens de forma segura en SecureStore
- Detecta automáticamente usuarios invitados (prefijo `guest-`)
- Verifica sesiones guardadas al iniciar la app

**Archivos clave:**
- `src/shared/contexts/AuthContext.tsx` - Lógica del contexto
- `app/index.tsx` - Punto de entrada y navegación automática
- `app/(app)/_layout.tsx` - Protección de rutas y UI según tipo de usuario

---

## 2. Flujo Completo de Autenticación con Google

### Diagrama ASCII del Flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUJO GOOGLE LOGIN                            │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ Usuario presiona "Ingresar con Google"
   │
   └─→ LoginButtons.tsx → handleGoogleLogin()
       │
       ├─ Genera token mock: `google-${Date.now()}`
       └─ Llama a: login(mockToken, { name: 'Usuario Google' })

2️⃣ AuthContext.login() ejecuta:
   │
   ├─ setToken(newToken)           → Guarda en SecureStore
   ├─ setTokenState(newToken)      → Actualiza estado local
   ├─ setUser(userData)            → Guarda datos de usuario
   └─ setIsGuest(false)            → No es invitado

3️⃣ app/index.tsx detecta cambio automáticamente
   │
   └─→ useEffect([token, isLoading]) se ejecuta
       │
       └─ Condición: if (!isLoading && token)
          │
          └─ router.replace("/(app)/home") ✅

4️⃣ Navegación completada
   └─→ Usuario ahora está en Home (autenticado)
```

### Código Relevante

**LoginButtons.tsx:**
```tsx
const handleGoogleLogin = async () => {
  const mockToken = `google-${Date.now()}`;
  await login(mockToken, { name: 'Usuario Google' });
  // ⚠️ NO hay navegación manual aquí
  // La navegación es automática desde app/index.tsx
};
```

**app/index.tsx:**
```tsx
export default function Index() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/(app)/home"); // 🎯 Navegación automática
    }
  }, [token, isLoading]);

  if (isLoading) return token ? <ReauthLoadingScreen /> : null;
  if (token) return null;

  return <WelcomeScreen />;
}
```

---

## 3. Flujo de Autenticación con Email

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUJO EMAIL LOGIN                            │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ Usuario presiona "Ingresar con Correo"
   │
   └─→ router.navigate('/(auth)/login')   → Navega a LoginScreen

2️⃣ Usuario llena formulario y presiona "Ingresar"
   │
   └─→ LoginScreen.tsx → handleEmailLogin()
       │
       ├─ Valida email y password
       ├─ Genera token: `email-${Date.now()}`
       ├─ Llama a: login(mockToken, { email, name })
       │
       └─ Navegación MANUAL:
          ├─ router.dismissAll()         → Cierra modales/stacks
          └─ router.replace("/(app)/home") → Reemplaza con Home

3️⃣ Usuario llega a Home
```

### Diferencia clave con Google

| Método      | Navegación           | Motivo                                    |
|-------------|----------------------|-------------------------------------------|
| Google      | Automática desde `app/index.tsx` | No hay pantalla intermedia |
| Email       | Manual desde `LoginScreen.tsx`  | Necesita cerrar stack de auth con `dismissAll()` |

**LoginScreen.tsx:**
```tsx
const handleEmailLogin = async () => {
  const mockToken = `email-${Date.now()}`;
  await login(mockToken, { email, name: email.split("@")[0] });

  // 🎯 Navegación MANUAL (no automática)
  router.dismissAll();       // Cierra todas las pantallas de auth
  router.replace("/(app)/home");
};
```

---

## 4. Flujo de Ingreso como Invitado

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUJO GUEST LOGIN                             │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ Usuario presiona "Continuar como invitado"
   │
   └─→ Genera token: `guest-${Date.now()}`

2️⃣ AuthContext.login() detecta prefijo "guest-"
   │
   └─→ setIsGuest(true) ✅

3️⃣ app/(app)/_layout.tsx renderiza UI especial
   │
   ├─ Sin tabs de navegación
   ├─ Solo acceso a Home
   └─ Banner inferior: "Navegando como invitado"
```

### Código Relevante

**AuthContext.tsx:**
```tsx
const login = async (newToken: string, userData?: User) => {
  await setToken(newToken);
  setTokenState(newToken);

  // 🎯 Detección automática de invitado
  if (newToken.startsWith("guest-")) {
    setIsGuest(true);
  } else {
    setIsGuest(false);
  }
};
```

**app/(app)/_layout.tsx:**
```tsx
export default function AppLayout() {
  const { isGuest, logout } = useAuth();

  // 🎯 UI diferente para invitados
  if (isGuest) {
    return (
      <YStack flex={1}>
        <Tabs screenOptions={{ tabBarStyle: { display: "none" } }}>
          <Tabs.Screen name="home" />
        </Tabs>

        {/* Banner de registro */}
        <YStack backgroundColor="#094b7eff" height={120}>
          <Text>Navegando como invitado</Text>
          <Button onPress={() => {
            logout();
            router.replace("/");
          }}>
            Iniciar Sesión
          </Button>
        </YStack>
      </YStack>
    );
  }

  // UI completa para usuarios registrados
  return <Tabs>{/* ... */}</Tabs>;
}
```

---

## 5. Flujo de Re-autenticación (Usuario ya autenticado)

Este flujo ocurre cuando el usuario abre la app y ya tiene una sesión guardada.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE RE-AUTENTICACIÓN                         │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ App inicia → AuthContext monta
   │
   └─→ useEffect() ejecuta checkAuthStatus()

2️⃣ checkAuthStatus() lee SecureStore
   │
   ├─ const storedToken = await getToken();
   │
   ├─ SI hay token:
   │  ├─ setTokenState(storedToken)
   │  ├─ await SplashScreen.hideAsync()
   │  └─ await new Promise(resolve => setTimeout(resolve, 1500))
   │
   └─ SI NO hay token:
      └─ console.log("No hay sesión activa")

3️⃣ app/index.tsx detecta token
   │
   ├─ if (isLoading && token):
   │  └─→ return <ReauthLoadingScreen />  // 🔄 Pantalla de carga
   │
   └─ useEffect([token, isLoading]):
      └─→ router.replace("/(app)/home")  // ✅ Navegación automática

4️⃣ Usuario llega a Home sin pasar por WelcomeScreen
```

### Código Relevante

**AuthContext.tsx:**
```tsx
const checkAuthStatus = async () => {
  try {
    const storedToken = await getToken();

    if (storedToken) {
      console.log("✅ Usuario ya autenticado encontrado");
      await SplashScreen.hideAsync();
      setTokenState(storedToken);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay suave
    }
  } catch (error) {
    console.error("❌ Error verificando autenticación:", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  checkAuthStatus(); // Se ejecuta al montar el componente
}, []);
```

**ReauthLoadingScreen.tsx:**
```tsx
export function ReauthLoadingScreen() {
  return (
    <Stack flex={1} backgroundColor="#094b7eff">
      <AppLogo size={260} />
      <Text>Usuario autenticado{"\n"}Redirigiendo...</Text>
      {/* Animación de dots */}
    </Stack>
  );
}
```

---

## 6. Métodos de Navegación de expo-router

### router.replace()
**Reemplaza** la ruta actual en el historial (no permite volver atrás).

```tsx
// Usado en: Login exitoso
router.replace("/(app)/home");
```

### router.dismissAll()
**Cierra** todas las pantallas modales o stacks activos.

```tsx
// Usado en: Login con email (antes de replace)
router.dismissAll();
router.replace("/(app)/home");
```

### router.navigate()
**Navega** a una nueva pantalla SIN reemplazar (permite volver atrás).

```tsx
// Usado en: Ir a pantalla de login
router.navigate('/(auth)/login');
```

### router.back()
**Vuelve** a la pantalla anterior en el stack.

```tsx
// Usado en: Botón de "Volver" en headers
router.back();
```

---

## 7. Resumen de Archivos Clave

### AuthContext.tsx
- Define estados: `token`, `user`, `isLoading`, `isGuest`
- Métodos: `login()`, `logout()`, `checkAuthStatus()`
- Guarda/lee tokens de SecureStore
- Detecta usuarios invitados automáticamente

### app/index.tsx
- Punto de entrada de la app
- Detecta cambios en `token` con `useEffect`
- Navega automáticamente a `/(app)/home` si hay token
- Muestra `<ReauthLoadingScreen />` durante re-autenticación
- Muestra `<WelcomeScreen />` si no hay sesión

### LoginButtons.tsx
- Botones de WelcomeScreen
- Login con Google: navegación automática
- Navegación a otras pantallas: `/login`, `/register`, `/forgot-password`

### LoginScreen.tsx
- Formulario de email/password
- Login manual con `dismissAll()` + `replace()`
- Genera token con prefijo `email-`

### app/(app)/_layout.tsx
- Layout de sección autenticada
- Protege rutas privadas (redirect si no hay token)
- UI diferente para invitados vs registrados
- Tabs completos solo para usuarios registrados

### ReauthLoadingScreen.tsx
- Pantalla de carga durante re-autenticación
- Logo + animación de dots
- Mensaje: "Usuario autenticado - Redirigiendo..."

---

## 8. Diagrama Completo del Sistema

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE AUTENTICACIÓN                          │
└──────────────────────────────────────────────────────────────────────┘

                      APP INICIA
                          │
                          ▼
              ┌───────────────────────┐
              │  AuthContext monta    │
              │  checkAuthStatus()    │
              └───────────────────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
           HAY TOKEN          NO HAY TOKEN
                │                   │
                ▼                   ▼
     ┌────────────────┐    ┌──────────────┐
     │ ReauthLoading  │    │ WelcomeScreen│
     └────────────────┘    └──────────────┘
                │                   │
                │            ┌──────┴────────┐
                │            ▼               ▼
                │      Google Login    Email Login
                │            │               │
                │            ▼               ▼
                │      Navegación      LoginScreen
                │      automática           │
                │                           ▼
                │                    dismissAll()
                │                    + replace()
                │                           │
                └───────────┬───────────────┘
                            ▼
                   ┌─────────────────┐
                   │  /(app)/home    │
                   │  [AUTENTICADO]  │
                   └─────────────────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
              Usuario Normal    Usuario Invitado
              (tabs completos)  (solo home + banner)
```

---

## Conclusión

El flujo de autenticación de CachiBache se basa en:

1. **AuthContext** como fuente única de verdad
2. **SecureStore** para persistencia segura de tokens
3. **app/index.tsx** como orquestador de navegación automática
4. **Detección automática** de tipo de usuario (invitado vs registrado)
5. **Protección de rutas** en `app/(app)/_layout.tsx`
6. **Re-autenticación transparente** al iniciar la app

La arquitectura permite una experiencia fluida donde el usuario no necesita volver a iniciar sesión cada vez que abre la app.
