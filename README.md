# Conference Admin

Una aplicación móvil de administración de conferencias desarrollada con React Native y Expo, que permite gestionar eventos, visualizar estadísticas y administrar reseñas de usuarios.

## 🚀 Características

### Gestión de Eventos
- **Lista de eventos** con filtros por estado (todos, activos, finalizados) [1](#1-0) 
- **Búsqueda en tiempo real** por título de evento
- **Creación de eventos** con formulario completo y subida de imágenes [2](#1-1) 
- **Detalles del evento** con información de ocupación y reseñas
- **Edición y eliminación** de eventos existentes

### Sistema de Reseñas
- **Visualización de calificaciones** con sistema de estrellas
- **Carrusel de reseñas** en la vista de detalles del evento
- **Pantalla dedicada** para ver todas las reseñas

### Dashboard de Estadísticas
- Visualización de métricas y análisis de eventos [3](#1-2) 

## 🛠️ Stack Tecnológico

- **Framework**: React Native con Expo SDK
- **Navegación**: React Navigation (Stack + Bottom Tabs)
- **Estado Global**: Zustand
- **Estilos**: NativeWind (Tailwind CSS para React Native)
- **HTTP Client**: Axios
- **Almacenamiento**: Firebase Storage
- **Gráficos**: React Native Chart Kit
- **Iconos**: Expo Vector Icons (Ionicons)

## 📱 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- Expo CLI
- Android Studio / Xcode (para desarrollo nativo)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/AntonyJDC/conference_admin.git
cd conference_admin

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto [4](#1-3) :
```env
API_URL=tu_url_del_backend
FIREBASE_API_KEY=tu_firebase_api_key
FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
FIREBASE_PROJECT_ID=tu_firebase_project_id
FIREBASE_STORAGE_BUCKET=tu_firebase_storage_bucket
```

## 🏗️ Arquitectura

La aplicación sigue una arquitectura por capas con separación clara de responsabilidades:

- **Capa de Presentación**: Pantallas y componentes React Native
- **Capa de Navegación**: React Navigation con navegación híbrida
- **Capa de Estado**: Zustand para estado global + useState local
- **Capa de Red**: Axios para comunicación con API REST
- **Servicios Externos**: Firebase Storage para imágenes

## 📂 Estructura del Proyecto

```
conference_admin/
├── app/
│   ├── events/
│   │   └── EventListScreen.tsx     # Pantalla principal de eventos
│   └── stats/
│       └── StatsScreen.tsx         # Dashboard de estadísticas
├── components/
│   ├── events/
│   │   ├── CreateEventPage.tsx     # Formulario de creación
│   │   ├── EventDetailScreen.tsx   # Detalles del evento
│   │   └── EventCard.tsx          # Tarjeta de evento
│   └── Reviews/
│       └── AllReviewsScreen.tsx    # Pantalla de todas las reseñas
├── navigation/
│   └── AppNavigator.tsx           # Configuración de navegación
├── services/
│   └── firebaseConfig.ts          # Configuración de Firebase
└── store/
    └── eventStore.ts              # Estado global con Zustand
```

## 🔧 Scripts Disponibles

```bash
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm start          # Iniciar servidor de desarrollo
npm run web        # Ejecutar en navegador web
npm run lint       # Verificar código con ESLint
npm run format     # Formatear código con Prettier
```

## 🌟 Funcionalidades Principales

### Gestión de Eventos
- Crear, editar y eliminar eventos
- Filtrado por estado (activos, finalizados, todos)
- Búsqueda por título
- Agrupación por fecha con acordeones
- Subida de imágenes a Firebase Storage [5](#1-4) 

### Sistema de Reseñas
- Calificación con estrellas (1-5)
- Comentarios de usuarios
- Cálculo de promedio de calificaciones
- Vista previa y vista completa de reseñas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a AntonyJDC.

## 📞 Contacto

**Desarrollador**: AntonyJDC  
**Repositorio**: [conference_admin](https://github.com/AntonyJDC/conference_admin)