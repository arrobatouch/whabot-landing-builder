# 🚀 Whabot Landing Builder v2.4.0

Generador visual de landings basado en React + Next.js con integración de IA y bloques reutilizables.

## ✨ Características Principales

### 🎯 Generador Visual
- **🎨 Drag & Drop**: Interfaz intuitiva para construir landings visualmente
- **📱 Vista Previa en Tiempo Real**: Visualiza los cambios instantáneamente
- **🧩 Bloques Reutilizables**: 20+ tipos de bloques predefinidos
- **🎯 Editor Visual**: Modifica contenido, estilos y propiedades fácilmente

### 🤖 Integración con IA
- **📝 Generación Automática**: Crea landings completas con descripciones simples
- **🎨 Diseño Inteligente**: La IA selecciona imágenes y crea contenido persuasivo
- **🔍 Búsqueda de Imágenes**: Integración con Unsplash para imágenes profesionales
- **💬 Asistente Virtual**: Ayuda guiada para crear landings efectivas

### 🏗️ Bloques Disponibles
- **🎭 Hero Slide**: Hero interactivo con imágenes de fondo
- **📱 Navegación**: Menús de navegación personalizables
- **⭐ Características**: Muestra las características de tu producto
- **💰 Precios**: Tablas de precios y planes
- **🗣️ Testimonios**: Muestra opiniones de clientes
- **📞 Contacto WhatsApp**: Integración directa con WhatsApp
- **📊 Estadísticas**: Muestra métricas y números importantes
- **⏰ Countdown**: Bloques promocionales con cuenta regresiva
- **🎥 YouTube**: Integración con videos de YouTube
- **🛒 Carrito**: Bloques de productos y compras
- **📅 Proceso**: Muestra procesos paso a paso
- **❓ FAQ**: Preguntas frecuentes
- **👥 Footer**: Pies de página personalizables
- **🖼️ Imágenes**: Galerías y bloques de imágenes
- **📈 Línea de Tiempo**: Muestra evolución o historia
- **🔄 Refuerzo**: Bloques de llamada a la acción

## 🚀 Tecnología

### 🎯 Core Framework
- **⚡ Next.js 15**: Framework React para producción con App Router
- **📘 TypeScript 5**: JavaScript tipado para mejor experiencia de desarrollo
- **🎨 Tailwind CSS 4**: Framework CSS utility-first para desarrollo rápido de UI

### 🧩 UI Components & Styling
- **🧩 shadcn/ui**: Componentes accesibles de alta calidad
- **🎯 Lucide React**: Biblioteca de iconos consistente
- **🌈 Framer Motion**: Biblioteca de motion para React
- **🎨 Next Themes**: Soporte para modo oscuro/claro

### 🤖 AI Integration
- **🤖 z-ai-web-dev-sdk**: SDK para integración con modelos de lenguaje
- **🖼️ Unsplash API**: Búsqueda de imágenes profesionales
- **💬 WhatsApp API**: Integración con mensajería
- **📊 Análisis Inteligente**: Procesamiento de contenido con IA

### 🔄 Interactividad
- **🖱️ DND Kit**: Modern drag and drop toolkit para React
- **📊 TanStack Table**: Componentes para tablas complejas
- **🎨 Recharts**: Biblioteca de gráficos basada en D3
- **📱 React Hook Form**: Forms performantes con validación fácil

## 🎯 Casos de Uso

### 🏢 Empresas
- **Sitios Corporativos**: Páginas de presentación profesional
- **Landing Pages**: Páginas de aterrizaje para campañas
- **Portafolios**: Muestra de proyectos y servicios

### 🛍️ E-commerce
- **Tiendas Online**: Catálogos de productos
- **Promociones**: Páginas de ofertas especiales
- **Lanzamientos**: Nuevos productos y servicios

### 🎭 Marketing Digital
- **Campañas**: Páginas para campañas específicas
- **Lead Generation**: Captura de contactos
- **Eventos**: Promoción de eventos y webinars

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación en funcionamiento.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── blocks/           # Bloques reutilizables
│   ├── Canvas.tsx        # Área de diseño
│   ├── EditorPanel.tsx   # Panel de edición
│   ├── LandingAssistant.tsx # Asistente de IA
│   └── ModulesPanel.tsx  # Panel de módulos
├── hooks/                 # Custom React hooks
├── lib/                   # Utilidades y configuraciones
├── data/                  # Datos y plantillas
└── types.ts               # Definiciones de tipos
```

## 🎨 Bloques Disponibles

### 📋 Contenido
- **Hero Slide**: Hero interactivo con imágenes
- **Features**: Características y beneficios
- **Testimonials**: Testimonios de clientes
- **Pricing**: Tablas de precios
- **FAQ**: Preguntas frecuentes
- **Stats**: Estadísticas y métricas

### 🎯 Marketing
- **CTA**: Llamadas a la acción
- **Countdown**: Cuentas regresivas
- **Process**: Procesos paso a paso
- **Timeline**: Líneas de tiempo
- **Reinforcement**: Bloques de refuerzo

### 🛍️ E-commerce
- **Product Features**: Características de productos
- **Product Cart**: Carritos de compra
- **Hero Split**: Heroes divididos

### 📞 Contacto
- **WhatsApp Contact**: Integración con WhatsApp
- **Contact Forms**: Formularios de contacto
- **Social Media**: Redes sociales

### 🎨 Multimedia
- **Image**: Galerías de imágenes
- **YouTube**: Videos de YouTube
- **Hero Banner**: Banners principales

### 🏗️ Estructura
- **Navigation**: Menús de navegación
- **Footer**: Pies de página
- **Hero Banner**: Banners principales

## 🤖 Características de IA

### 📝 Generación de Contenido
- **Descripción a Landing**: Convierte descripciones simples en landings completas
- **Contenido Persuasivo**: Genera textos efectivos y profesionales
- **Optimización SEO**: Contenido optimizado para motores de búsqueda

### 🎨 Diseño Inteligente
- **Selección de Imágenes**: Búsqueda automática de imágenes relevantes
- **Paletas de Colores**: Combinaciones de colores armoniosas
- **Tipografía**: Selección inteligente de fuentes

### 🔍 Análisis y Mejora
- **Sugerencias de Mejora**: Recomendaciones para optimizar el contenido
- **A/B Testing**: Sugerencias para pruebas de variantes
- **Análisis de Rendimiento**: Métricas y optimización

## 🚀 Despliegue

### 🐳 Docker
```bash
# Construir imagen
docker build -t whabot-landing-builder .

# Ejecutar contenedor
docker run -p 3000:3000 whabot-landing-builder
```

### 🌐 Vercel
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### 🚀 Servidor Propio
```bash
# Construir aplicación
npm run build

# Iniciar en producción
npm start
```

## 🔧 Configuración

### Variables de Entorno
```env
# API Keys
OPENAI_API_KEY=tu_openai_api_key
UNSPLASH_ACCESS_KEY=tu_unsplash_access_key

# Base de Datos
DATABASE_URL=tu_database_url

# Autenticación
NEXTAUTH_URL=tu_nextauth_url
NEXTAUTH_SECRET=tu_nextauth_secret
```

### 🎨 Personalización
- **Temas**: Personaliza colores y fuentes
- **Bloques**: Crea bloques personalizados
- **Plantillas**: Diseña tus propias plantillas
- **API**: Extiende con APIs propias

## 🤝 Contribuir

1. Fork del repositorio
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Next.js Team**: Por el excelente framework
- **shadcn**: Por los componentes de UI de alta calidad
- **OpenAI**: Por la tecnología de IA
- **Unsplash**: Por las imágenes gratuitas
- **Tailwind CSS**: Por el framework de CSS utility-first

---

🏗️ Construido con ❤️ para la comunidad de desarrolladores. 
Superchargado por Whabot 🚀