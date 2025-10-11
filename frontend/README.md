# 🚗 Cachi-Bache – App de Reporte de Baches Urbanos

Aplicación móvil desarrollada con **React Native** y **Expo** cuyo objetivo es empoderar a los ciudadanos para participar activamente en la mejora de su entorno urbano, facilitando la detección y reparación de baches en la vía pública.

## 🚀 Configuración inicial

### Variables de entorno

1. Copia el archivo `.env.example` y renómbralo a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Obtén una Google Maps API Key:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita "Maps SDK for Android" en tu proyecto
   - Crea una API Key en Credentials
   - Copia la API Key en el archivo `.env`

3. El archivo `.env` no debe subirse a GitHub (ya está en `.gitignore`)

## 🔁 Flujo de trabajo

- [Flujo de trabajo](./docs/flujo-de-trabajo.md)

## 👥 Collaborators

- 👤 [@Diego Lalanda](https://github.com/DiegoLalanda)
- 👤 [@Fernanda Elola](https://github.com/FernandaElola)
- 👤 [@Enrique Pierotti Castillo](https://github.com/pierotticastillo)
- 👤 [@Manuel Alejandro García](https://github.com/Manuelgarcia1)

## 📌 Objetivo General

- Empoderar a los ciudadanos para participar en la mejora de su entorno.
- Mejorar la eficiencia del sistema de reparaciones urbanas.
- Usar datos reales para tomar decisiones más inteligentes sobre mantenimiento urbano.

## 🎯 Objetivos Específicos

### 📍 Reporte de baches con geolocalización

Los vecinos pueden subir:

- Fotos del bache.
- Ubicación mediante GPS.
- Comentarios adicionales.

### ⚡ Sistema de priorización automática

Un algoritmo ordena los baches según:

- Cantidad de reportes.
- Tránsito estimado.
- Nivel de peligrosidad.

### 📊 Dashboard público y transparente

- Muestra obras en curso.
- Baches reportados.
- Estado actual y fecha estimada de reparación.

### 🔎 Seguimiento de reclamos

Cada usuario puede ver el progreso de los reportes que hizo:

1. **Pendiente**
2. **Asignado**
3. **En reparación**
4. **Finalizado**

### ⏱️ Plazos definidos

- Reparaciones temporales: **menos de 24 horas**.
- Reparación definitiva: **dentro de los 10 días**.

### 🔔 Notificaciones

El usuario recibe alertas push cuando su reclamo cambia de estado.
