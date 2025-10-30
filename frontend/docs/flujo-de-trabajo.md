# 📚 00 - Flujo de Trabajo Git para Desarrollo Colaborativo

Este documento detalla el flujo de trabajo profesional que seguimos en este proyecto de encuestas anónimas. Está diseñado para facilitar la colaboración entre los integrantes del equipo y asegurar un desarrollo limpio, ordenado y con control de versiones eficiente.

---

## 🧭 Estructura de Ramas

| Rama          | Propósito                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `main`        | Versión **estable y lista para entrega o deploy**. Nunca se trabaja directo aquí.                            |
| `develop`     | Rama de integración. Aquí se mergean los cambios de todos los desarrolladores.                               |
| `feature/...` | Ramas personales o por funcionalidad. Se parte de `develop` y se trabaja aislado hasta que esté listo el PR. |

---

## 🔧 Reglas de Trabajo

1. ❌ **No trabajar directo en `main` ni en `develop`**.
2. ✅ Siempre crear una rama `feature/` para trabajar en una funcionalidad o documento.
3. ✅ Usar mensajes de commit claros y en presente: `"✨ Agregar endpoint de encuestas"`.
4. ✅ Hacer Pull Request (PR) hacia `develop`, nunca directo a `main`.
5. ✅ Todo PR debe ser revisado por al menos 1 miembro del equipo antes de hacer merge.
6. ✅ Nunca subir `node_modules/` ni archivos `.env`.

---

## 👥 Cómo trabajar paso a paso

### 1. Clonar el repositorio

````bash
git clone https://github.com/usuario/cachi-bache.git
cd cachi-bache

### 2. Cambiar a `develop`

```bash
git checkout develop
git pull origin develop
````

### 3. Crear tu rama `feature/`

```bash
git checkout -b feature/dev-tu-nombre-funcionalidad
git push -u origin feature/dev-tu-nombre-funcionalidad
```

### 4. Trabajar en la estructura real del proyecto

📂 NO crees carpetas personales. Trabajá directamente en las carpetas reales:

```bash
src/screens/Reportes/
src/screens/Dashboard/
src/screens/Notificaciones/
src/services/api/
src/context/
```

### 5. Subir tus cambios

```bash
git add .
git commit -m "Descripción clara del cambio"
git push origin feature/dev-tu-nombre-funcionalidad
```

### 6. Crear un Pull Request (PR)

- Desde GitHub: click en “Compare & pull request”.
- Asegurate de que diga:
  - `base: develop`
  - `compare: feature/dev-tu-nombre-funcionalidad`
- Agregá descripción de qué hiciste.
- Enviá el PR.

### 7. Revisión del equipo

- Otro dev debe revisar tu código.
- Una vez aprobado, se hace merge a `develop`.

---

## 🚀 ¿Cuándo se mergea `develop` a `main`?

- Cuando todas las funcionalidades están completas y testeadas.
- El equipo valida que `develop` está estable.
- Se hace un Pull Request desde `develop` a `main`.
- Esto marca una **versión lista para producción o entrega**.

---

## 🧩 Estructura final de ramas esperada

```
main
│
└── develop
    ├── feature/dev-Manuel-reportes-baches
    ├── feature/dev-Enrique-geolocalizacion
    ├── feature/dev-Diego-dashboard
    ├── feature/dev-Diego-notificaciones
```

---

## ✅ Buenas Prácticas

- Escribir commits descriptivos y limpios.
- Avisar cuando se empieza a trabajar en un nuevo feature.
- Usar el template de PR para documentar los cambios.
- No dejar ramas viejas colgadas (borrarlas luego del merge).

---

## 🔁 ¿Cuándo crear una nueva rama?

Cada vez que vayas a implementar una **nueva funcionalidad**, trabajar en un **módulo diferente** o hacer una mejora importante, **debés pararte sobre la rama `develop` y crear una nueva rama `feature/...`** desde ahí.

### 📌 Ejemplo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/dev-nombre-modulo-nuevo
```

Esto garantiza que trabajás con la última versión integrada del sistema y evitás conflictos con otros desarrolladores.

> **Nunca desarrolles directamente sobre `develop` o `main`.** Usá tu rama `feature/` y luego hacé Pull Request hacia `develop`. Cuando todo esté probado y aprobado, se mergeará a `main` para entrega final.
