# Guía de Imágenes de Fondo - Landing Page Builder

## 📋 Resumen del Problema Solucionado

El problema con las imágenes de fondo en los bloques ha sido solucionado. Ahora la aplicación maneja correctamente los siguientes escenarios:

1. **Imágenes válidas**: Se muestran correctamente como fondo
2. **URLs vacías**: Se muestra un gradiente por defecto
3. **URLs inválidas**: Se muestra un gradiente por defecto con mensaje de error
4. **Imágenes que no cargan**: Se muestra un mensaje de error en la vista previa

## 🎨 Mejoras Implementadas

### 1. **Componentes Mejorados**

#### HeroBlock (`/src/components/blocks/HeroBlock.tsx`)
- ✅ Manejo de imágenes vacías o inválidas
- ✅ Gradiente por defecto cuando no hay imagen
- ✅ Indicador de depuración en modo desarrollo
- ✅ Fallback automático a gradiente si la imagen falla

#### CtaBlock (`/src/components/blocks/CtaBlock.tsx`)
- ✅ Las mismas mejoras que HeroBlock
- ✅ Gradiente verde-teal-azul por defecto

### 2. **EditorPanel Mejorado**

#### Campo de Imagen de Fondo
- ✅ Vista previa en tiempo real
- ✅ Manejo de errores de carga
- ✅ Placeholder descriptivo
- ✅ Indicador visual cuando la imagen no se puede cargar

#### Características del Editor
- **Vista previa**: Miniatura de 80px de altura
- **Error handling**: Mensaje de error si la imagen no carga
- **Placeholder**: Texto indicando que se usará gradiente por defecto
- **Validación**: Verificación de URL no vacía

## 🛠️ Cómo Usar

### 1. **Añadir un Bloque con Imagen de Fondo**
1. Arrastra un bloque "Hero Block" o "CTA Block" al canvas
2. El bloque se creará con una imagen de fondo por defecto
3. La imagen se mostrará correctamente

### 2. **Cambiar la Imagen de Fondo**
1. Selecciona el bloque en el canvas
2. En el panel derecho (Editor), busca el campo "Imagen de Fondo"
3. Ingresa la URL de la nueva imagen
4. La vista previa se actualizará automáticamente
5. Si la imagen es válida, se mostrará en el bloque

### 3. **Quitar la Imagen de Fondo**
1. Selecciona el bloque
2. En el campo "Imagen de Fondo", borra la URL
3. Deja el campo vacío
4. El bloque mostrará un gradiente por defecto

## 🎨 Opciones de Gradiente por Defecto

### HeroBlock
- **Gradiente**: `from-blue-600 via-purple-600 to-indigo-700`
- **Opacidad**: `bg-black/30`
- **Estilo**: Moderno y tecnológico

### CtaBlock
- **Gradiente**: `from-green-600 via-teal-600 to-blue-700`
- **Opacidad**: `bg-black/50`
- **Estilo**: Llamativo y profesional

## 🔍 Herramientas de Depuración

### 1. **Modo Desarrollo**
En modo desarrollo, los bloques muestran un indicador en la esquina inferior izquierda:
- `🖼️ Imagen: [URL]` - Si hay una imagen válida
- `🎨 Gradiente por defecto` - Si no hay imagen

### 2. **Consola del Navegador**
Los errores de carga de imágenes se registran en la consola:
- `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`
- `Failed to load resource: 404 (Not Found)`

### 3. **Script de Prueba**
Usa el script `test-background-images.js` para probar URLs de imágenes:
```bash
node test-background-images.js
```

## 📝 Recomendaciones

### 1. **Fuentes de Imágenes Confiables**
- **Unsplash**: `https://images.unsplash.com/photo-ID?w=1200&h=600&fit=crop`
- **Placeholder**: `https://via.placeholder.com/1200x600/COLOR/TEXT`
- **Local**: `/images/nombre-imagen.jpg` (debes tener la imagen en la carpeta public)

### 2. **Buenas Prácticas**
- Usa imágenes con dimensiones adecuadas (1200x600 para hero, 1200x400 para CTA)
- Comprime las imágenes para mejor rendimiento
- Usa formatos modernos (WebP, AVIF) cuando sea posible
- Proporciona texto alternativo para accesibilidad

### 3. **Solución de Problemas**
Si una imagen no se muestra:
1. Verifica que la URL sea correcta
2. Prueba abrir la URL en el navegador
3. Revisa la consola del navegador en busca de errores
4. Usa el script de prueba para verificar la imagen
5. Considera usar una fuente de imágenes más confiable

## 🚀 Ejemplos de URLs Funcionales

### Unsplash (Recomendado)
```
https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop
https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop
```

### Placeholder (Para pruebas)
```
https://via.placeholder.com/1200x600/4f46e5/ffffff?text=Hero+Background
https://via.placeholder.com/1200x400/059669/ffffff?text=CTA+Background
```

### Imágenes Locales
```
/images/hero-background.jpg
/images/cta-background.png
```

## 🎯 Conclusión

El problema de las imágenes de fondo ha sido completamente solucionado. La aplicación ahora:

- ✅ Muestra imágenes correctamente cuando son válidas
- ✅ Tiene un fallback elegante con gradientes cuando no hay imagen
- ✅ Proporciona retroalimentación visual en el editor
- ✅ Incluye herramientas de depuración
- ✅ Maneja errores de manera graceful

Los usuarios ahora pueden crear landing pages profesionales con o sin imágenes de fondo, con una experiencia de usuario fluida y sin errores.