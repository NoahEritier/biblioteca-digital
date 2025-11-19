<<<<<<< HEAD
# Biblioteca Digital

Una aplicación web moderna desarrollada en Angular para explorar libros utilizando la API de Google Books, con un diseño retro inspirado en bibliotecas clásicas.

## 📋 Características

- 🔍 **Búsqueda avanzada**: Búsqueda de libros por título, autor o tema
- 📚 **Catálogo completo**: Visualización de información detallada de libros
- 🖼️ **Portadas de libros**: Integración con Google Books API para imágenes
- ⭐ **Sistema de favoritos**: Guarda tus libros favoritos para acceso rápido
- 📖 **Gestión de préstamos**: Control de préstamos de libros
- 👤 **Perfil de usuario**: Personaliza tu experiencia de lectura
- 🎨 **Diseño retro**: Interfaz inspirada en bibliotecas clásicas con colores marrones y cremas
- 📱 **Diseño responsive**: Optimizado para dispositivos móviles y escritorio
- 🔔 **Notificaciones**: Sistema de notificaciones toast para feedback al usuario

## 🚀 Requisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI 17

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/TU_USUARIO/biblioteca-digital.git
cd biblioteca-digital
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre tu navegador en `http://localhost:4200`

## 🛠️ Tecnologías

- **Angular 17**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Google Books API**: API para búsqueda y obtención de información de libros
- **RxJS**: Programación reactiva
- **CSS3**: Estilos con diseño retro

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/              # Componentes reutilizables
│   │   ├── book-card/          # Tarjeta de libro
│   │   ├── book-detail-panel/  # Panel de detalles de libro
│   │   ├── category-filter/    # Filtro de categorías
│   │   ├── navbar/             # Barra de navegación
│   │   ├── search-bar/         # Barra de búsqueda
│   │   └── toast/              # Componente de notificaciones
│   ├── pages/                   # Páginas principales
│   │   ├── home/               # Página de inicio
│   │   ├── catalogo/           # Página de catálogo
│   │   ├── guardados/          # Página de libros guardados
│   │   └── perfil/             # Página de perfil de usuario
│   ├── services/                # Servicios de la aplicación
│   │   ├── auth.service.ts     # Servicio de autenticación
│   │   ├── favorites.service.ts # Servicio de favoritos
│   │   ├── google-books.service.ts # Servicio de Google Books API
│   │   ├── loans.service.ts    # Servicio de préstamos
│   │   ├── storage.service.ts  # Servicio de almacenamiento
│   │   ├── toast.service.ts    # Servicio de notificaciones
│   │   └── user-profile.service.ts # Servicio de perfil de usuario
│   ├── app.component.*          # Componente principal
│   └── app.routes.ts           # Configuración de rutas
├── assets/                      # Recursos estáticos
├── styles.css                   # Estilos globales
├── index.html                   # HTML principal
└── main.ts                      # Punto de entrada
```

## 🗺️ Rutas de la Aplicación

- `/home` - Página de inicio (redirección por defecto)
- `/catalogo` - Catálogo de libros con búsqueda
- `/guardados` - Libros guardados/favoritos
- `/perfil` - Perfil y configuración de usuario

## 💻 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run watch` - Compila en modo watch para desarrollo
- `npm test` - Ejecuta las pruebas unitarias

## 📖 Uso

1. **Búsqueda de libros**: Navega a la página de catálogo y utiliza la barra de búsqueda
2. **Explorar resultados**: Visualiza los libros encontrados en formato de tarjetas
3. **Ver detalles**: Haz clic en un libro para ver información detallada
4. **Guardar favoritos**: Marca libros como favoritos para acceso rápido
5. **Gestionar préstamos**: Controla tus préstamos desde la sección correspondiente
6. **Personalizar perfil**: Configura tus preferencias en la página de perfil

## 🔧 Configuración

La aplicación utiliza la API pública de Google Books, no requiere autenticación adicional para la búsqueda básica. Los datos del usuario (favoritos, préstamos, perfil) se almacenan localmente en el navegador.

## 📝 Notas

- La aplicación utiliza la API pública de Google Books, no requiere autenticación para búsquedas
- El diseño está optimizado para dispositivos móviles y escritorio
- Los datos del usuario se almacenan en el almacenamiento local del navegador
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.

=======
# Biblioteca Digital

Una aplicación web moderna desarrollada en Angular para explorar libros utilizando la API de Google Books, con un diseño retro inspirado en bibliotecas clásicas.

## 📋 Características

- 🔍 **Búsqueda avanzada**: Búsqueda de libros por título, autor o tema
- 📚 **Catálogo completo**: Visualización de información detallada de libros
- 🖼️ **Portadas de libros**: Integración con Google Books API para imágenes
- ⭐ **Sistema de favoritos**: Guarda tus libros favoritos para acceso rápido
- 📖 **Gestión de préstamos**: Control de préstamos de libros
- 👤 **Perfil de usuario**: Personaliza tu experiencia de lectura
- 🎨 **Diseño retro**: Interfaz inspirada en bibliotecas clásicas con colores marrones y cremas
- 📱 **Diseño responsive**: Optimizado para dispositivos móviles y escritorio
- 🔔 **Notificaciones**: Sistema de notificaciones toast para feedback al usuario

## 🚀 Requisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI 17

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/TU_USUARIO/biblioteca-digital.git
cd biblioteca-digital
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre tu navegador en `http://localhost:4200`

## 🛠️ Tecnologías

- **Angular 17**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Google Books API**: API para búsqueda y obtención de información de libros
- **RxJS**: Programación reactiva
- **CSS3**: Estilos con diseño retro

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/              # Componentes reutilizables
│   │   ├── book-card/          # Tarjeta de libro
│   │   ├── book-detail-panel/  # Panel de detalles de libro
│   │   ├── category-filter/    # Filtro de categorías
│   │   ├── navbar/             # Barra de navegación
│   │   ├── search-bar/         # Barra de búsqueda
│   │   └── toast/              # Componente de notificaciones
│   ├── pages/                   # Páginas principales
│   │   ├── home/               # Página de inicio
│   │   ├── catalogo/           # Página de catálogo
│   │   ├── guardados/          # Página de libros guardados
│   │   └── perfil/             # Página de perfil de usuario
│   ├── services/                # Servicios de la aplicación
│   │   ├── auth.service.ts     # Servicio de autenticación
│   │   ├── favorites.service.ts # Servicio de favoritos
│   │   ├── google-books.service.ts # Servicio de Google Books API
│   │   ├── loans.service.ts    # Servicio de préstamos
│   │   ├── storage.service.ts  # Servicio de almacenamiento
│   │   ├── toast.service.ts    # Servicio de notificaciones
│   │   └── user-profile.service.ts # Servicio de perfil de usuario
│   ├── app.component.*          # Componente principal
│   └── app.routes.ts           # Configuración de rutas
├── assets/                      # Recursos estáticos
├── styles.css                   # Estilos globales
├── index.html                   # HTML principal
└── main.ts                      # Punto de entrada
```

## 🗺️ Rutas de la Aplicación

- `/home` - Página de inicio (redirección por defecto)
- `/catalogo` - Catálogo de libros con búsqueda
- `/guardados` - Libros guardados/favoritos
- `/perfil` - Perfil y configuración de usuario

## 💻 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run watch` - Compila en modo watch para desarrollo
- `npm test` - Ejecuta las pruebas unitarias

## 📖 Uso

1. **Búsqueda de libros**: Navega a la página de catálogo y utiliza la barra de búsqueda
2. **Explorar resultados**: Visualiza los libros encontrados en formato de tarjetas
3. **Ver detalles**: Haz clic en un libro para ver información detallada
4. **Guardar favoritos**: Marca libros como favoritos para acceso rápido
5. **Gestionar préstamos**: Controla tus préstamos desde la sección correspondiente
6. **Personalizar perfil**: Configura tus preferencias en la página de perfil

## 🔧 Configuración

La aplicación utiliza la API pública de Google Books, no requiere autenticación adicional para la búsqueda básica. Los datos del usuario (favoritos, préstamos, perfil) se almacenan localmente en el navegador.

## 📝 Notas

- La aplicación utiliza la API pública de Google Books, no requiere autenticación para búsquedas
- El diseño está optimizado para dispositivos móviles y escritorio
- Los datos del usuario se almacenan en el almacenamiento local del navegador
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.

>>>>>>> master
