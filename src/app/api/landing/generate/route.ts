import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Función para agregar parámetros anti-caché a las URLs de imágenes
function addCacheBustToImages(content: any): any {
  if (!content) return content
  
  const newContent = { ...content }
  
  // Función recursiva para procesar todas las propiedades
  const processObject = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && 
          (obj[key].includes('images.unsplash.com') || 
           obj[key].includes('pexels.com') || 
           obj[key].includes('gettyimages.com'))) {
        // Agregar parámetro de cache busting único para cada generación
        const cacheBust = `?v=${Date.now()}_${Math.floor(Math.random() * 1000000)}`
        obj[key] = obj[key].includes('?') ? `${obj[key]}&${cacheBust.substring(1)}` : `${obj[key]}${cacheBust}`
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        processObject(obj[key])
      }
    }
  }
  
  processObject(newContent)
  return newContent
}

// Función para procesar todos los bloques y agregar cache busting
function processGeneratedBlocks(blocks: any[]): any[] {
  return blocks.map(block => ({
    ...block,
    content: addCacheBustToImages(block.content)
  }))
}

interface BlockGenerationConfig {
  type: string
  priority: number
  keywords: string[]
  contentGenerator: (businessInfo: BusinessInfo) => any
}

interface BusinessInfo {
  businessType: string
  industry: string
  location?: string
  targetAudience?: string
  mainGoal: string
  keyFeatures: string[]
  brandPersonality?: string
  uniqueSellingProposition?: string
  callToAction?: string
  processedContent?: any // Contenido procesado del asistente
}

interface GeneratedBlock {
  type: string
  content: any
  position: number
}

// Mapeo de palabras clave a tipos de bloques
const BLOCK_MAPPINGS: BlockGenerationConfig[] = [
  {
    type: 'navigation',
    priority: 0,
    keywords: ['navegacion', 'navegación', 'menu', 'barra', 'header', 'nav'],
    contentGenerator: (info: BusinessInfo) => ({
      logoPosition: 'left' as const,
      menuPosition: 'right' as const,
      companyName: info.businessType,
      customButtons: [
        { id: 'btn-1', label: 'Inicio', url: '#' },
        { id: 'btn-2', label: 'Servicios', url: '#' },
        { id: 'btn-3', label: 'Contacto', url: '#' }
      ],
      showLandings: true,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      sticky: false,
      shadow: true
    })
  },
  {
    type: 'hero-slide',
    priority: 1,
    keywords: ['slide', 'interactivo', 'carrusel', 'slider', 'hero'],
    contentGenerator: (info: BusinessInfo) => {
      // Generar contenido específico para hospitality
      if (info.industry === 'hospitality') {
        return {
          title: info.businessType.includes('Las Gaviotas') ? '🏖️ Alquileres Temporarios Las Gaviotas' : `🏖️ ${info.businessType}`,
          subtitle: info.businessType.includes('Océano') || info.businessType.includes('Médano') ? 'Tu descanso frente al mar' : 'Tu escape perfecto',
          description: info.location ? `Disfruta de unas vacaciones inolvidables en ${info.location}. Propiedades equipadas con todas las comodidades para tu estadía.` : `Descubre nuestras propiedades equipadas para unas vacaciones inolvidables.`,
          backgroundImage: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&h=600&fit=crop',
          primaryButtonText: 'Ver Propiedades',
          primaryButtonUrl: '#propiedades',
          secondaryButtonText: 'Reservar Ahora',
          secondaryButtonUrl: '#contacto',
          styles: {
            backgroundColor: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
            paddingY: 'py-20',
            paddingX: 'px-6',
            textAlign: 'text-center'
          }
        }
      }
      
      return {
        title: `Descubre ${info.industry} de Calidad`,
        subtitle: info.businessType,
        description: `Ofrecemos los mejores ${info.industry.toLowerCase()} con calidad garantizada. ${info.location ? `Atendemos en ${info.location}` : ''}`,
        backgroundImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
        slides: [
          {
            title: 'Innovación',
            description: 'Lo último en tecnología y diseño',
            backgroundImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop'
          },
          {
            title: 'Calidad',
            description: 'Estándares superiores en cada producto',
            backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=1200&h=600&fit=crop'
          }
        ],
        autoPlay: true,
        interval: 5000
      }
    }
  },
  {
    type: 'reinforcement',
    priority: 2,
    keywords: ['refuerzo', 'destacado', 'importante', 'clave', 'refuerzo'],
    contentGenerator: (info: BusinessInfo) => ({
      title: '¿Por qué Elegirnos?',
      description: `En ${info.businessType} nos destacamos por ofrecer ${info.industry.toLowerCase()} de la más alta calidad con un servicio excepcional que supera todas tus expectativas.`,
      features: [
        {
          title: 'Calidad Superior',
          description: `Productos de ${info.industry.toLowerCase()} de la más alta calidad`
        },
        {
          title: 'Servicio Excepcional',
          description: 'Atención personalizada y soporte dedicado'
        },
        {
          title: 'Experiencia Profesional',
          description: 'Equipo experto con años de experiencia en el sector'
        },
        {
          title: 'Innovación Constante',
          description: 'Siempre a la vanguardia de las últimas tendencias'
        }
      ]
    })
  },
  {
    type: 'features',
    priority: 3,
    keywords: ['características', 'beneficios', 'ventajas', 'features', 'productos', 'servicios'],
    contentGenerator: (info: BusinessInfo) => {
      // Generar contenido específico para hospitality
      if (info.industry === 'hospitality') {
        return {
          title: '🧭 Qué nos diferencia',
          subtitle: 'Por qué elegir nuestras propiedades',
          features: [
            {
              icon: '🌊',
              title: 'Ubicación privilegiada',
              description: info.location && info.location.includes('Las Gaviotas') ? 'A pocos pasos de la playa y cerca del centro de Mar de las Pampas' : 'Ubicaciones estratégicas en las mejores zonas'
            },
            {
              icon: '🏡',
              title: 'Propiedades equipadas',
              description: 'Departamentos amplios y equipados, con diseño moderno y detalles cuidados'
            },
            {
              icon: '💬',
              title: 'Atención personalizada',
              description: 'Trato directo con los dueños para una experiencia única'
            },
            {
              icon: '🔒',
              title: 'Seguridad y tranquilidad',
              description: 'Ambiente seguro y pacífico para disfrutar tus vacaciones'
            },
            {
              icon: '🌱',
              title: 'Respeto por el entorno',
              description: 'Energía eficiente y gestión sustentable del complejo'
            }
          ],
          styles: {
            backgroundColor: 'bg-slate-50',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      }
      
      return {
        title: 'Características Principales',
        subtitle: `Por qué elegir ${info.businessType}`,
        features: [
          {
            icon: '⭐',
            title: 'Calidad Superior',
            description: `Productos de ${info.industry.toLowerCase()} de la más alta calidad`
          },
          {
            icon: '🚀',
            title: 'Rápido y Eficiente',
            description: 'Servicio ágil y resultados inmediatos'
          },
          {
            icon: '💎',
            title: 'Profesionalismo',
            description: 'Equipo experto dedicado a tu satisfacción'
          },
          {
            icon: '🛡️',
            title: 'Garantía',
            description: 'Total confianza y seguridad en nuestros servicios'
          }
        ]
      }
    }
  },
  {
    type: 'hero-split',
    priority: 4,
    keywords: ['dividido', 'split', 'dos columnas', 'bifurcado', 'separado'],
    contentGenerator: async (info: BusinessInfo) => {
      let backgroundImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'empresa',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          backgroundImage = data.images[0].url
        }
      } catch {
        backgroundImage = `https://source.unsplash.com/1200x600/?${info.businessType || 'empresa'}`
      }

      return {
        title: `Experiencia en ${info.industry}`,
        subtitle: info.businessType,
        description: `Descubre nuestra propuesta única de valor en ${info.industry.toLowerCase()}`,
        leftContent: {
          title: 'Nuestra Misión',
          description: `Brindar ${info.industry.toLowerCase()} de excelencia que transformen tu experiencia.`,
          buttonText: 'Conocer Más',
          buttonLink: '#'
        },
        rightContent: {
          title: 'Nuestra Visión',
          description: `Ser líderes en ${info.industry.toLowerCase()} con innovación constante.`,
          buttonText: 'Ver Proyectos',
          buttonLink: '#'
        },
        backgroundImage
      }
    }
  },
  {
    type: 'product-features',
    priority: 5,
    keywords: ['producto', 'catálogo', 'productos', 'artículos', 'items'],
    contentGenerator: async (info: BusinessInfo) => {
      let centerImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'productos',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          centerImage = data.images[0].url
        }
      } catch {
        centerImage = `https://source.unsplash.com/600x400/?${info.businessType || 'productos'}`
      }

      // Generar contenido específico para hospitality
      if (info.industry === 'hospitality') {
        return {
          title: 'Nuestros Complejos',
          subtitle: 'Dos opciones únicas para tu descanso perfecto',
          features: [
            {
              id: 'oceano',
              title: '🌊 Complejo Océano',
              description: 'Elegancia y confort a pasos del mar. Ideal para parejas o familias pequeñas.',
              features: [
                '📍 50 metros del mar',
                '🛏️ Departamentos para 2-4 personas',
                '🌞 Balcones con vista al mar',
                '❄️ Aire acondicionado frío/calor',
                '📺 Smart TV + WiFi fibra óptica',
                '🏊‍♂️ Piscina climatizada',
                '🚗 Estacionamiento privado'
              ],
              price: 'Desde $95.000 por noche',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
              buttonText: 'Ver Detalles',
              buttonUrl: '#oceano'
            },
            {
              id: 'medano',
              title: '🏝️ Complejo Médano 29',
              description: 'Diseño moderno rodeado de pinos, a solo tres cuadras de la playa.',
              features: [
                '📍 3 cuadras de la playa',
                '🛋️ Cabañas dúplex para 4-6 personas',
                '🍖 Deck privado y parrilla',
                '🧺 Zona de juegos para niños',
                '🐶 Pet Friendly',
                '📡 WiFi + Smart TV + calefacción',
                '🧼 Servicio de limpieza opcional'
              ],
              price: 'Desde $115.000 por noche',
              image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
              buttonText: 'Ver Detalles',
              buttonUrl: '#medano'
            }
          ],
          styles: {
            backgroundColor: 'bg-white',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      }
      
      return {
        title: 'Nuestros Productos',
        subtitle: 'Conoce nuestra selección exclusiva',
        leftItems: [
          {
            id: '1',
            icon: '🏷️',
            title: 'Variedad',
            description: 'Amplia selección de productos para elegir'
          },
          {
            id: '2',
            icon: '✨',
            title: 'Calidad',
            description: 'Productos seleccionados con estándares altos'
          }
        ],
        centerImage,
        centerImageAlt: 'Productos destacados',
        rightItems: [
          {
            id: '3',
            icon: '🚚',
            title: 'Entrega',
            description: 'Envíos rápidos y seguros'
          },
          {
            id: '4',
            icon: '💳',
            title: 'Pagos',
            description: 'Métodos de pago seguros y flexibles'
          }
        ],
        buttonText: 'Ver Catálogo',
        buttonLink: '#'
      }
    }
  },
  {
    type: 'countdown',
    priority: 6,
    keywords: ['promoción', 'descuento', 'oferta', 'cuenta', 'regresiva', 'promocional', 'descuentos'],
    contentGenerator: (info: BusinessInfo) => {
      // Generar contenido específico para hospitality
      if (info.industry === 'hospitality') {
        return {
          title: '🎁 Promoción de Lanzamiento — Temporada 2025',
          subtitle: 'No te pierdas esta oportunidad única',
          description: 'Reservando desde el 1 al 30 de noviembre de 2025, obtené increíbles beneficios en cualquiera de nuestros complejos.',
          offer: '15% OFF + Desayuno Artesanal Incluido',
          conditions: 'Válido para estadías de 4 noches o más',
          ctaText: 'Reservar Ahora',
          ctaUrl: '#contacto',
          styles: {
            backgroundColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
            paddingY: 'py-16',
            paddingX: 'px-6',
            textAlign: 'text-center'
          }
        }
      }
      
      return {
        title: '¡Oferta Exclusiva por Tiempo Limitado!',
        subtitle: 'No te pierdas esta oportunidad única',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
        backgroundImage: '',
        button: {
          text: 'Aprovechar Oferta',
          link: '#',
          linkType: 'external',
          color: '#ffffff',
          hoverColor: '#f3f4f6'
        },
        alignment: 'center',
        timerStyle: 'digital',
        timerColors: {
          numbers: '#ffffff',
          labels: '#ffffff',
          background: '#00000033'
        },
        expiredAction: 'show-message',
        expiredMessage: 'La promoción ha finalizado'
      }
    }
  },
  {
    type: 'social-media',
    priority: 7,
    keywords: ['social', 'redes', 'sociales', 'instagram', 'facebook', 'twitter', 'linkedin'],
    contentGenerator: (info: BusinessInfo) => ({
      title: 'Síguenos en Redes Sociales',
      subtitle: 'Mantente conectado con nuestras novedades',
      description: `Síguenos en nuestras redes para conocer las últimas novedades sobre ${info.industry.toLowerCase()}.`,
      socialLinks: [
        {
          id: '1',
          name: 'Instagram',
          icon: '📷',
          url: 'https://instagram.com/tu-perfil',
          order: 1
        },
        {
          id: '2',
          name: 'Facebook',
          icon: '📘',
          url: 'https://facebook.com/tu-pagina',
          order: 2
        },
        {
          id: '3',
          name: 'Twitter',
          icon: '🐦',
          url: 'https://twitter.com/tu-perfil',
          order: 3
        },
        {
          id: '4',
          name: 'LinkedIn',
          icon: '💼',
          url: 'https://linkedin.com/tu-perfil',
          order: 4
        },
        {
          id: '5',
          name: 'YouTube',
          icon: '📺',
          url: 'https://youtube.com/tu-canal',
          order: 5
        },
        {
          id: '6',
          name: 'TikTok',
          icon: '🎵',
          url: 'https://tiktok.com/@tu-perfil',
          order: 6
        }
      ]
    })
  },
  {
    type: 'youtube',
    priority: 8,
    keywords: ['youtube', 'video', 'vídeo', 'canal', 'youtube'],
    contentGenerator: (info: BusinessInfo) => ({
      title: 'Presentamos ORUS v2.0',
      description: 'Descubre la nueva versión de nuestra plataforma con características innovadoras y mejor rendimiento.',
      videoUrl: 'https://www.youtube.com/watch?v=S9w88y5Od9w',
      videoId: 'S9w88y5Od9w',
      visualMode: 'light',
      controls: {
        hideControls: false,
        hideTitle: false,
        autoPlay: false,
        muteOnStart: true,
        loop: false,
        showRelatedVideos: false,
        modestBranding: true
      },
      size: {
        preset: 'medium',
        height: '400',
        heightUnit: 'px',
        marginTop: 0,
        marginBottom: 0
      }
    })
  },
  {
    type: 'product-cart',
    priority: 9,
    keywords: ['carrito', 'compra', 'comprar', 'cart', 'checkout', 'tienda'],
    contentGenerator: async (info: BusinessInfo) => {
      let productImages = []
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'productos',
            industry: info.industry || 'general',
            count: 2
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          productImages = data.images.map(img => img.url)
        }
      } catch {
        productImages = [
          `https://source.unsplash.com/200x200/?${info.businessType || 'producto'}1`,
          `https://source.unsplash.com/200x200/?${info.businessType || 'producto'}2`
        ]
      }

      return {
        title: 'Carrito de Compras',
        subtitle: 'Tus productos seleccionados',
        products: [
          {
            id: '1',
            name: `Producto ${info.industry} 1`,
            price: 29.99,
            quantity: 1,
            image: productImages[0] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=200&h=200&fit=crop'
          },
          {
            id: '2',
            name: `Producto ${info.industry} 2`,
            price: 49.99,
            quantity: 2,
            image: productImages[1] || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop'
          }
        ],
        currency: '$',
        showTax: true,
        taxRate: 21,
        buttonText: 'Proceder al Pago',
        buttonLink: '#'
      }
    }
  },
  {
    type: 'testimonials',
    priority: 10,
    keywords: ['testimonios', 'opiniones', 'reseñas', 'clientes', 'feedback', 'experiencias'],
    contentGenerator: async (info: BusinessInfo) => {
      let avatarImages = []
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'person people portrait',
            industry: 'general',
            count: 3
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          avatarImages = data.images.map(img => img.url)
        }
      } catch {
        avatarImages = [
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        ]
      }

      return {
        title: 'Lo que dicen nuestros clientes',
        testimonials: [
          {
            name: 'María García',
            role: 'Cliente',
            company: info.businessType,
            content: `Excelente servicio de ${info.industry.toLowerCase()}. Superó todas mis expectativas, totalmente recomendado.`,
            avatar: avatarImages[0] || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
          },
          {
            name: 'Juan Pérez',
            role: 'Cliente',
            company: info.businessType,
            content: `Profesionalismo y calidad en ${info.industry.toLowerCase()}. El mejor equipo con el que he trabajado.`,
            avatar: avatarImages[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          },
          {
            name: 'Ana Martínez',
            role: 'Cliente',
            company: info.businessType,
            content: `Increíble experiencia con ${info.businessType}. La atención y los resultados son excepcionales.`,
            avatar: avatarImages[2] || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
          }
        ]
      }
    }
  },
  {
    type: 'cta',
    priority: 11,
    keywords: ['llamada', 'acción', 'cta', 'contacto', 'empezar', 'comenzar'],
    contentGenerator: async (info: BusinessInfo) => {
      let backgroundImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'empresa',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          backgroundImage = data.images[0].url
        }
      } catch {
        backgroundImage = `https://source.unsplash.com/1200x400/?${info.businessType || 'empresa'}`
      }

      return {
        title: `¿Listo para empezar con ${info.businessType}?`,
        description: `Únete a nuestros clientes satisfechos y descubre la diferencia en ${info.industry.toLowerCase()}.`,
        buttonText: 'Comenzar Ahora',
        buttonLink: '#',
        backgroundImage
      }
    }
  },
  {
    type: 'pricing',
    priority: 12,
    keywords: ['precios', 'planes', 'tarifas', 'costos', 'precios', 'valor'],
    contentGenerator: (info: BusinessInfo) => ({
      title: 'Nuestros Planes',
      subtitle: 'Elige el plan que mejor se adapte a tus necesidades',
      plans: [
        {
          name: 'Básico',
          price: 29,
          frequency: '/mes',
          features: [
            'Característica básica 1',
            'Característica básica 2',
            'Soporte por email'
          ],
          highlighted: false,
          buttonText: 'Empezar',
          buttonLink: '#'
        },
        {
          name: 'Pro',
          price: 59,
          frequency: '/mes',
          features: [
            'Todas las características básicas',
            'Características avanzadas',
            'Soporte prioritario',
            'Análisis y reportes'
          ],
          highlighted: true,
          buttonText: 'Empezar',
          buttonLink: '#'
        },
        {
          name: 'Empresarial',
          price: 99,
          frequency: '/mes',
          features: [
            'Todas las características Pro',
            'API completa',
            'Soporte 24/7',
            'Personalización total'
          ],
          highlighted: false,
          buttonText: 'Contactar',
          buttonLink: '#'
        }
      ]
    })
  },
  {
    type: 'whatsapp-contact',
    priority: 13,
    keywords: ['whatsapp', 'contacto', 'whats', 'mensaje', 'comunicación', 'consulta'],
    contentGenerator: async (info: BusinessInfo) => {
      let leftImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'contacto',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          leftImage = data.images[0].url
        }
      } catch {
        leftImage = `https://source.unsplash.com/800x600/?${info.businessType || 'contacto'}`
      }

      // Generar contenido específico para hospitality
      if (info.industry === 'hospitality') {
        return {
          title: '📅 Reservas & Contacto',
          description: 'Consultá disponibilidad y tarifas actualizadas. ¡Estamos para ayudarte!',
          whatsappNumber: '+54 9 11 5555-9000',
          defaultMessage: 'Hola, estoy interesado en reservar en sus complejos en Las Gaviotas. ¿Podrían darme más información?',
          buttonText: 'Contactar por WhatsApp',
          leftImage: leftImage || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
          leftImageAlt: 'Playa Las Gaviotas',
          styles: {
            backgroundColor: 'bg-white',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      }
      
      return {
        title: '¿Tenés Consultas?',
        description: `Contactanos por WhatsApp para más información sobre ${info.industry.toLowerCase()}`,
        whatsappNumber: '5491168765432',
        defaultMessage: `Hola! Estoy interesado en ${info.industry.toLowerCase()} de ${info.businessType}. ¿Podrían darme más información?`,
        buttonText: 'Escribir por WhatsApp',
        leftImage: leftImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=600&h=400&fit=crop',
        leftImageAlt: 'Contacto WhatsApp'
      }
    }
  },
  {
    type: 'footer',
    priority: 14,
    keywords: ['pie', 'footer', 'redes', 'sociales', 'contacto', 'información'],
    contentGenerator: async (info: BusinessInfo) => {
      let logoImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `${info.businessType} logo brand`,
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          logoImage = data.images[0].url
        }
      } catch {
        logoImage = '/logo.svg' // Mantener el logo por defecto
      }

      return {
        logo: logoImage,
        company: info.businessType,
        description: `Líderes en ${info.industry.toLowerCase()} con compromiso de calidad y servicio.`,
        links: [
          {
            title: 'Servicios',
            items: [
              { text: `${info.industry}`, url: '#' },
              { text: 'Catálogo', url: '#' },
              { text: 'Contacto', url: '#' }
            ]
          },
          {
            title: 'Empresa',
            items: [
              { text: 'Sobre Nosotros', url: '#' },
              { text: 'Blog', url: '#' },
              { text: 'Ubicación', url: '#' }
            ]
          }
        ],
        socialLinks: [
          { platform: 'whatsapp', url: '#', icon: '📱' },
          { platform: 'instagram', url: '#', icon: '📷' },
          { platform: 'facebook', url: '#', icon: '📘' }
        ]
      }
    }
  },
  {
    type: 'hero',
    priority: 15,
    keywords: ['héroe', 'principal', 'cabecera', 'header', 'inicio'],
    contentGenerator: async (info: BusinessInfo) => {
      let backgroundImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'empresa',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          backgroundImage = data.images[0].url
        }
      } catch {
        backgroundImage = `https://source.unsplash.com/1920x1080/?${info.businessType || 'empresa'}`
      }

      return {
        title: `Bienvenido a ${info.businessType}`,
        subtitle: `Líderes en ${info.industry.toLowerCase()}`,
        description: `Descubre la excelencia en ${info.industry.toLowerCase()} con soluciones innovadoras y resultados garantizados.`,
        primaryButtonText: 'Conocer Más',
        primaryButtonLink: '#',
        secondaryButtonText: 'Contactar',
        secondaryButtonLink: '#contacto',
        backgroundImage
      }
    }
  },
  {
    type: 'hero-banner',
    priority: 16,
    keywords: ['banner', 'cabecera', 'publicidad', 'promoción'],
    contentGenerator: async (info: BusinessInfo) => {
      let backgroundImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'banner',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          backgroundImage = data.images[0].url
        }
      } catch {
        backgroundImage = `https://source.unsplash.com/1920x600/?${info.businessType || 'banner'}`
      }

      return {
        backgroundImage,
        title: `${info.businessType} - Calidad Garantizada`,
        subtitle: `Los mejores ${info.industry.toLowerCase()} del mercado`,
        button: {
          text: 'Más Información',
          link: '#',
          linkType: 'external',
          color: '#ffffff',
          hoverColor: '#f3f4f6'
        },
        alignment: 'center',
        overlayOpacity: 0.4,
        textColor: 'light',
        animation: 'fade'
      }
    }
  },
  {
    type: 'hero-countdown',
    priority: 17,
    keywords: ['cuenta', 'regresiva', 'temporizador', 'countdown', 'oferta'],
    contentGenerator: async (info: BusinessInfo) => {
      let backgroundImage = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'promoción',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          backgroundImage = data.images[0].url
        }
      } catch {
        backgroundImage = `https://source.unsplash.com/1920x800/?${info.businessType || 'promoción'}`
      }

      return {
        title: '🔥 Oferta Especial por Tiempo Limitado',
        subtitle: `No te pierdas esta oportunidad única en ${info.industry.toLowerCase()}`,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
        backgroundImage,
        button: {
          text: 'Aprovechar Oferta',
          link: '#',
          linkType: 'external',
          color: '#ffffff',
          hoverColor: '#f3f4f6'
        },
        alignment: 'center',
        timerStyle: 'digital',
        timerColors: {
          numbers: '#ffffff',
          labels: '#ffffff',
          background: '#00000033'
        },
        expiredAction: 'show-message',
        expiredMessage: 'La promoción ha finalizado'
      }
    }
  },
  {
    type: 'image',
    priority: 18,
    keywords: ['imagen', 'foto', 'gráfico', 'visual', 'picture'],
    contentGenerator: async (info: BusinessInfo) => {
      let image = ''
      
      try {
        const res = await fetch('http://localhost:3000/api/images/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: info.businessType || info.name || 'imagen',
            industry: info.industry || 'general',
            count: 1
          })
        })

        const data = await res.json()
        if (data.success && data.images?.length > 0) {
          image = data.images[0].url
        }
      } catch {
        image = `https://source.unsplash.com/1200x800/?${info.businessType || 'imagen'}`
      }

      return {
        title: `Galería ${info.businessType}`,
        description: `Descubre nuestras mejores imágenes de ${info.industry.toLowerCase()}`,
        image,
        alt: `Imagen representativa de ${info.businessType}`
      }
    }
  }
]

// Función para limpiar contenido JSON de la IA
function cleanJsonContent(content: string): string {
  // Eliminar markdown formatting común
  let cleaned = content.trim()
  
  // Eliminar ```json al inicio
  cleaned = cleaned.replace(/^```json\n?/, '')
  
  // Eliminar ``` al final
  cleaned = cleaned.replace(/\n?```$/, '')
  
  // Eliminar cualquier otro markdown formatting
  cleaned = cleaned.replace(/^```\n?/, '')
  cleaned = cleaned.replace(/\n?```$/, '')
  
  // Eliminar espacios en blanco adicionales
  cleaned = cleaned.trim()
  
  return cleaned
}

// Función para crear una solicitud con timeout
async function createTimeoutRequest<T>(requestFn: () => Promise<T>, timeoutMs: number = 30000): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const result = await Promise.race([
      requestFn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      })
    ])
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Función para reintentar solicitudes fallidas
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
      delayMs *= 2 // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded')
}

// Función para extraer información del negocio usando IA con fallback robusto
async function extractBusinessInfo(prompt: string): Promise<BusinessInfo> {
  console.log('[AUDIT] Starting business info extraction process...')
  
  // Primero intentar con el smart fallback inmediatamente para evitar demoras
  // Solo intentar IA si está explícitamente habilitado
  if (process.env.ENABLE_AI_SERVICES !== 'true') {
    console.log('[AUDIT] AI services disabled, using smart fallback immediately')
    return generateSmartBusinessInfo(prompt)
  }
  
  // Intentar con OpenAI/DeepSeek si está habilitado
  if (process.env.ENABLE_OPENAI_FALLBACK === 'true') {
    try {
      console.log('[AUDIT] Attempting to extract business info with OpenAI/DeepSeek...')
      
      const openaiResponse = await fetch('http://localhost:3000/api/ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Eres un experto en analizar textos de negocios y crear landing pages coherentes. Analiza el texto del cliente y extrae la información necesaria para crear una landing page completa y profesional.

Responde en formato JSON con la siguiente estructura:

{
  "businessType": "Nombre específico del negocio o marca",
  "industry": "Industria o rubro principal (ej: restaurant, zapatería, nutrición, skincare, fotografía, consultoría, tecnología)",
  "location": "Ubicación si se menciona, sino null",
  "targetAudience": "Público objetivo específico (ej: jóvenes profesionales, mamás, empresas, estudiantes)",
  "mainGoal": "Objetivo principal del landing page (ej: vender productos online, mostrar servicios, generar contactos, promocionar eventos)",
  "keyFeatures": ["característica1", "característica2", "característica3", "característica4"],
  "brandPersonality": "personalidad de la marca (ej: profesional, moderna, tradicional, innovadora, amigable)",
  "uniqueSellingProposition": "propuesta única de valor que diferencia al negocio",
  "callToAction": "llamada a la acción principal (ej: comprar ahora, contactar, registrarse)"
}`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        }),
      })

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json()
        if (openaiData.success && openaiData.content) {
          console.log('[AUDIT] Successfully extracted business info with OpenAI/DeepSeek fallback')
          const cleanedContent = cleanJsonContent(openaiData.content)
          return JSON.parse(cleanedContent)
        }
      }
    } catch (openaiError) {
      console.error('[AUDIT] OpenAI/DeepSeek fallback failed:', openaiError)
    }
  }

  // Si OpenAI/DeepSeek fallan, intentar con Z-AI con manejo de errores mejorado
  try {
    console.log('[AUDIT] Attempting to extract business info with Z-AI...')
    let zai
    try {
      zai = await ZAI.create()
      console.log('[AUDIT] Z-AI SDK initialized successfully')
    } catch (zaiError) {
      console.error('[AUDIT] Error initializing Z-AI SDK:', zaiError)
      console.log('[AUDIT] Falling back to smart business info generation')
      return generateSmartBusinessInfo(prompt)
    }
    
    const requestFn = async () => {
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Eres un experto en analizar textos de negocios y crear landing pages coherentes. Analiza el texto del cliente y extrae la información necesaria para crear una landing page completa y profesional.

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON en formato puro, sin ningún texto adicional, sin markdown, sin explicaciones. Solo el JSON crudo.

{
  "businessType": "Nombre específico del negocio o marca",
  "industry": "Industria o rubro principal (ej: restaurant, zapatería, nutrición, skincare, fotografía, consultoría, tecnología)",
  "location": "Ubicación si se menciona, sino null",
  "targetAudience": "Público objetivo específico (ej: jóvenes profesionales, mamás, empresas, estudiantes)",
  "mainGoal": "Objetivo principal del landing page (ej: vender productos online, mostrar servicios, generar contactos, promocionar eventos)",
  "keyFeatures": ["característica1", "característica2", "característica3", "característica4"],
  "brandPersonality": "personalidad de la marca (ej: profesional, moderna, tradicional, innovadora, amigable)",
  "uniqueSellingProposition": "propuesta única de valor que diferencia al negocio",
  "callToAction": "llamada a la acción principal (ej: comprar ahora, contactar, registrarse)"
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const content = response.choices[0]?.message?.content
      if (content) {
        const cleanedContent = cleanJsonContent(content)
        return JSON.parse(cleanedContent)
      }
      throw new Error('No content received from AI')
    }

    // Usar timeout y retry para la solicitud con tiempos reducidos
    const result = await retryRequest(() => createTimeoutRequest(requestFn, 15000), 1, 1000)
    console.log('[AUDIT] Successfully extracted business info with Z-AI')
    return result

  } catch (error) {
    console.error('[AUDIT] All AI services failed, using smart fallback:', error.message)
    // Si todos los servicios fallan, usar el smart fallback inmediatamente
    return generateSmartBusinessInfo(prompt)
  }
}

// Función para buscar imágenes relevantes para el negocio
async function searchBusinessImages(businessInfo: BusinessInfo): Promise<{ [key: string]: string }> {
  try {
    const imageResponse = await fetch('http://localhost:3000/api/images/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: businessInfo.businessType,
        industry: businessInfo.industry,
        count: 8
      })
    })

    if (imageResponse.ok) {
      const imageData = await imageResponse.json()
      if (imageData.success && imageData.images) {
        const images: { [key: string]: string } = {}
        
        // Asignar imágenes a diferentes tipos de bloques
        imageData.images.forEach((img: any, index: number) => {
          switch (index) {
            case 0:
              images.hero = img.url
              break
            case 1:
              images.features = img.url
              break
            case 2:
              images.background = img.url
              break
            case 3:
              images.product = img.url
              break
            case 4:
              images.contact = img.url
              break
            case 5:
              images.cta = img.url
              break
            default:
              if (!images.general) images.general = img.url
          }
        })
        
        console.log('Business images found:', Object.keys(images))
        return images
      }
    }
  } catch (error) {
    console.error('Error searching business images:', error)
  }

  // Imágenes de respaldo mejoradas
  return {
    hero: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    features: 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=800&h=600&fit=crop',
    background: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop',
    product: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    contact: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    cta: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
    testimonial: 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=800&h=600&fit=crop',
    general: 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=800&h=600&fit=crop'
  }
}

// Función para generar contenido coherente usando IA con fallback robusto
async function generateCoherentContent(blockType: string, businessInfo: BusinessInfo, context?: any, businessImages?: { [key: string]: string }): Promise<any> {
  console.log(`[AUDIT] Starting generateCoherentContent for block: ${blockType}`)
  const startTime = Date.now()
  
  // Si tenemos contenido procesado, usarlo para generar contenido más preciso
  if (businessInfo.processedContent) {
    console.log(`[AUDIT] Using processed content for block: ${blockType}`)
    return generateContentFromProcessed(blockType, businessInfo.processedContent, businessImages)
  }
  
  // Si los servicios de IA están deshabilitados, usar fallback inmediato
  if (process.env.ENABLE_AI_SERVICES !== 'true') {
    console.log(`[AUDIT] AI services disabled, using immediate fallback for block: ${blockType}`)
    return generateFallbackContent(blockType, businessInfo, businessImages)
  }
  
  try {
    const zai = await ZAI.create()
    console.log(`[AUDIT] Z-AI initialized for block: ${blockType}`)
    
    const blockConfig = BLOCK_MAPPINGS.find(b => b.type === blockType)
    if (!blockConfig) {
      console.log(`[AUDIT] No block config found for: ${blockType}`)
      return null
    }

    // Seleccionar imagen relevante para este bloque
    let relevantImage = businessImages?.general
    switch (blockType) {
      case 'hero':
        relevantImage = businessImages?.hero || businessImages?.background
        break
      case 'features':
        relevantImage = businessImages?.features
        break
      case 'hero-banner':
        relevantImage = businessImages?.background
        break
      case 'product-features':
        relevantImage = businessImages?.product
        break
      case 'whatsapp-contact':
        relevantImage = businessImages?.contact
        break
      case 'cta':
        relevantImage = businessImages?.cta
        break
    }

    const systemPrompt = `Eres un experto copywriter especializado en landing pages. Genera contenido para un bloque de tipo "${blockType}" que sea coherente con la información del negocio y mantenga una narrativa consistente.

INFORMACIÓN DEL NEGOCIO:
- Nombre: ${businessInfo.businessType}
- Industria: ${businessInfo.industry}
- Ubicación: ${businessInfo.location || 'No especificada'}
- Público objetivo: ${businessInfo.targetAudience || 'General'}
- Objetivo principal: ${businessInfo.mainGoal}
- Características clave: ${businessInfo.keyFeatures.join(', ')}
- Personalidad de marca: ${businessInfo.brandPersonality || 'Profesional'}
- Propuesta única: ${businessInfo.uniqueSellingProposition || 'Calidad y servicio'}
- Llamada a la acción: ${businessInfo.callToAction || 'Contactar'}
- Imagen relevante disponible: ${relevantImage || 'Imagen genérica de negocio'}

Genera el contenido en formato JSON según el tipo de bloque. El contenido debe ser:
1. Coherente con la identidad de la marca
2. Orientado al público objetivo
3. Con un tono consistente (${businessInfo.brandPersonality || 'profesional'})
4. Enfocado en el objetivo: ${businessInfo.mainGoal}
5. Incluir palabras clave naturales relacionadas con ${businessInfo.industry}
6. Incluir la imagen relevante: "${relevantImage}" si aplica para este tipo de bloque

IMPORTANTE: Para bloques que requieren imágenes (hero, hero-banner, cta, etc.), incluye la URL de la imagen en el campo correspondiente del JSON.`

    const requestFn = async () => {
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Genera contenido para el bloque "${blockType}" manteniendo coherencia con el contexto general de la landing page. Usa la imagen relevante proporcionada si aplica.`
          }
        ]
      })

      const content = response.choices[0]?.message?.content
      if (content) {
        try {
          const cleanedContent = cleanJsonContent(content)
          const parsedContent = JSON.parse(cleanedContent)
          
          // Asegurar que se use la imagen relevante si el bloque lo requiere
          if (relevantImage && ['hero', 'hero-banner', 'cta', 'product-features', 'whatsapp-contact'].includes(blockType)) {
            if (blockType === 'hero' || blockType === 'hero-banner' || blockType === 'cta') {
              parsedContent.backgroundImage = relevantImage
            } else if (blockType === 'product-features') {
              parsedContent.centerImage = relevantImage
            } else if (blockType === 'whatsapp-contact') {
              parsedContent.leftImage = relevantImage
            }
          }
          
          return parsedContent
        } catch (parseError) {
          console.warn(`Error parsing AI content for ${blockType}, using fallback`)
          const fallbackContent = blockConfig.contentGenerator(businessInfo)
          
          // Aplicar imagen relevante al contenido de respaldo
          if (relevantImage && ['hero', 'hero-banner', 'cta', 'product-features', 'whatsapp-contact'].includes(blockType)) {
            if (blockType === 'hero' || blockType === 'hero-banner' || blockType === 'cta') {
              fallbackContent.backgroundImage = relevantImage
            } else if (blockType === 'product-features') {
              fallbackContent.centerImage = relevantImage
            } else if (blockType === 'whatsapp-contact') {
              fallbackContent.leftImage = relevantImage
            }
          }
          
          return fallbackContent
        }
      }
      throw new Error('No content received from AI')
    }

    // Usar timeout y retry para la solicitud con timeout más corto para bloques individuales
    console.log(`[AUDIT] Starting AI request for block: ${blockType} with 3s timeout`)
    const requestStartTime = Date.now()
    
    const result = await retryRequest(() => createTimeoutRequest(requestFn, 3000), 1, 500)
    
    const requestEndTime = Date.now()
    console.log(`[AUDIT] AI request completed for block: ${blockType} in ${requestEndTime - requestStartTime}ms`)
    
    const totalTime = Date.now() - startTime
    console.log(`[AUDIT] generateCoherentContent completed for block: ${blockType} in ${totalTime}ms`)
    
    return result
  } catch (error) {
    const errorTime = Date.now() - startTime
    console.error(`[AUDIT] Error generating content for ${blockType} after ${errorTime}ms:`, error)
    console.log(`[AUDIT] Using fallback for block: ${blockType}`)
    return generateFallbackContent(blockType, businessInfo, businessImages)
  }
}

// Función para generar contenido de respaldo sin IA
function generateFallbackContent(blockType: string, businessInfo: BusinessInfo, businessImages?: { [key: string]: string }): any {
  console.log(`[AUDIT] Generating fallback content for block: ${blockType}`)
  
  const blockConfig = BLOCK_MAPPINGS.find(b => b.type === blockType)
  const fallbackContent = blockConfig ? blockConfig.contentGenerator(businessInfo) : null
  
  // Aplicar imagen relevante al contenido de respaldo
  if (fallbackContent && businessImages) {
    let relevantImage = businessImages.general
    switch (blockType) {
      case 'hero':
        relevantImage = businessImages.hero || businessImages.background
        if (relevantImage) fallbackContent.backgroundImage = relevantImage
        break
      case 'features':
        relevantImage = businessImages.features
        break
      case 'hero-banner':
        relevantImage = businessImages.background
        if (relevantImage) fallbackContent.backgroundImage = relevantImage
        break
      case 'product-features':
        relevantImage = businessImages.product
        if (relevantImage) fallbackContent.centerImage = relevantImage
        break
      case 'whatsapp-contact':
        relevantImage = businessImages.contact
        if (relevantImage) fallbackContent.leftImage = relevantImage
        break
      case 'cta':
        relevantImage = businessImages.cta
        if (relevantImage) fallbackContent.backgroundImage = relevantImage
        break
    }
  }
  
  const fallbackEndTime = Date.now()
  console.log(`[AUDIT] Fallback completed for block: ${blockType}`)
  
  return fallbackContent
}

// Función para generar contenido a partir del contenido procesado del asistente
function generateContentFromProcessed(blockType: string, processedContent: any, businessImages?: { [key: string]: string }): any {
  console.log(`[AUDIT] Generating content from processed data for block: ${blockType}`)
  
  const content: any = {}
  
  switch (blockType) {
    case 'navigation':
      content.logo = processedContent.businessInfo.name
      content.menuItems = [
        { label: 'Inicio', link: '#' },
        { label: 'Productos', link: '#productos' },
        { label: 'Nosotros', link: '#nosotros' },
        { label: 'Contacto', link: '#contacto' }
      ]
      content.ctaButton = {
        text: processedContent.cta.primary,
        link: '#contacto'
      }
      break
      
    case 'hero-slide':
      content.slides = [{
        title: processedContent.businessInfo.name,
        subtitle: processedContent.businessInfo.description,
        description: `Descubre nuestros productos de ${processedContent.businessInfo.type.toLowerCase()} con la mejor calidad del mercado.`,
        backgroundImage: businessImages?.hero || '',
        primaryButtonText: processedContent.cta.primary,
        primaryButtonLink: '#productos',
        secondaryButtonText: processedContent.cta.secondary,
        secondaryButtonLink: '#contacto'
      }]
      break
      
    case 'features':
      content.features = processedContent.features.map((feature: any, index: number) => ({
        id: (index + 1).toString(),
        icon: feature.icon,
        title: feature.title,
        description: feature.description
      }))
      content.title = 'Características Principales'
      content.subtitle = 'Por qué elegirnos'
      break
      
    case 'product-features':
      content.title = 'Nuestros Productos'
      content.subtitle = 'Calidad y diseño excepcional'
      content.leftItems = processedContent.products.slice(0, 2).map((product: any, index: number) => ({
        id: (index + 1).toString(),
        icon: '🛍️',
        title: product.name,
        description: product.description
      }))
      content.centerImage = businessImages?.product || ''
      content.centerImageAlt = 'Productos destacados'
      content.rightItems = processedContent.features.slice(0, 2).map((feature: any, index: number) => ({
        id: (index + 3).toString(),
        icon: feature.icon,
        title: feature.title,
        description: feature.description
      }))
      content.buttonText = processedContent.cta.primary
      content.buttonLink = '#productos'
      break
      
    case 'cta':
      content.title = processedContent.promotions?.[0]?.title || '¿Listo para empezar?'
      content.subtitle = processedContent.promotions?.[0]?.description || processedContent.businessInfo.description
      content.backgroundImage = businessImages?.cta || ''
      content.button = {
        text: processedContent.cta.primary,
        link: '#contacto',
        linkType: 'external',
        color: '#ffffff',
        hoverColor: '#f3f4f6'
      }
      content.alignment = 'center'
      break
      
    case 'testimonials':
      content.title = 'Lo que dicen nuestros clientes'
      content.subtitle = 'Experiencias reales de clientes satisfechos'
      content.testimonials = [
        {
          id: '1',
          name: 'Cliente Satisfecho',
          role: 'Cliente frecuente',
          content: `Excelente servicio y productos de alta calidad. Recomiendo totalmente a ${processedContent.businessInfo.name}.`,
          avatar: businessImages?.testimonials || ''
        },
        {
          id: '2',
          name: 'Otro Cliente',
          role: 'Nuevo cliente',
          content: `La atención es increíble y los productos superaron mis expectativas.`,
          avatar: businessImages?.testimonials || ''
        }
      ]
      break
      
    case 'whatsapp-contact':
      content.title = '¿Tenés preguntas?'
      content.subtitle = 'Comunicate con nosotros directamente'
      content.leftImage = businessImages?.contact || ''
      content.phoneNumber = processedContent.contact.phone || '+5491123456789'
      content.message = `Hola! Estoy interesado en los productos de ${processedContent.businessInfo.name}`
      content.buttonText = 'Chatear por WhatsApp'
      break
      
    case 'footer':
      content.logo = processedContent.businessInfo.name
      content.description = processedContent.businessInfo.description
      content.quickLinks = [
        { label: 'Inicio', link: '#' },
        { label: 'Productos', link: '#productos' },
        { label: 'Nosotros', link: '#nosotros' },
        { label: 'Contacto', link: '#contacto' }
      ]
      content.contactInfo = {
        phone: processedContent.contact.phone || '',
        email: processedContent.contact.email || '',
        address: processedContent.contact.address || ''
      }
      content.socialLinks = [
        { platform: 'facebook', url: '#' },
        { platform: 'instagram', url: '#' },
        { platform: 'twitter', url: '#' }
      ]
      content.copyrightText = `© 2025 ${processedContent.businessInfo.name}. Todos los derechos reservados.`
      break
      
    default:
      // Para otros bloques, usar el contenido procesado genéricamente
      return generateFallbackContent(blockType, { 
        ...processedContent.businessInfo,
        keyFeatures: processedContent.features.map((f: any) => f.title)
      }, businessImages)
  }
  
  console.log(`[AUDIT] Processed content generated for block: ${blockType}`)
  return content
}

// Función para seleccionar bloques basados en el prompt y asegurar orden coherente
async function selectBlocks(prompt: string, businessInfo: BusinessInfo, businessImages?: { [key: string]: string }): Promise<GeneratedBlock[]> {
  const promptLower = prompt.toLowerCase()
  const selectedBlocks: GeneratedBlock[] = []
  
  // Orden lógico de bloques para una landing page coherente
  const logicalOrder = [
    'navigation',         // 0 - Barra de navegación (siempre primero)
    'hero-slide',         // 1 - Hero slide interactivo
    'reinforcement',      // 2 - Bloque refuerzo
    'features',           // 3 - Características ppales
    'hero-split',         // 4 - Bloque hero dividido
    'product-features',   // 5 - Carac del producto
    'countdown',          // 6 - Bloque promocional
    'social-media',       // 7 - Redes Sociales
    'youtube',            // 8 - Bloque youtube (siempre usaremos demo https://www.youtube.com/watch?v=S9w88y5Od9w)
    'product-cart',       // 9 - Bloque de carrito de productos
    'testimonials',       // 10 - Bloque de testimonios
    'cta',                // 11 - Bloque CTA
    'pricing',            // 12 - Bloque de precios
    'whatsapp-contact',   // 13 - Contacto whatsapp
    'footer'              // 14 - Bloque de pie de pagina
  ]
  
  console.log('[DEBUG] Using logicalOrder:', logicalOrder) // Debug log

  // Generar contenido coherente para cada bloque en orden lógico
  for (const blockType of logicalOrder) {
    const config = BLOCK_MAPPINGS.find(b => b.type === blockType)
    if (config) {
      // Verificar si el bloque es relevante para el negocio
      const isRelevant = config.keywords.some(keyword => 
        promptLower.includes(keyword) || 
        businessInfo.keyFeatures.some(feature => 
          feature.toLowerCase().includes(keyword)
        ) ||
        businessInfo.industry.toLowerCase().includes(keyword) ||
        businessInfo.mainGoal.toLowerCase().includes(keyword)
      )

      // Incluir bloques básicos siempre o si son relevantes
      if (['navigation', 'hero-slide', 'reinforcement', 'features', 'hero-split', 'product-features', 'countdown', 'social-media', 'youtube', 'product-cart', 'testimonials', 'cta', 'pricing', 'whatsapp-contact', 'footer'].includes(blockType) || isRelevant) {
        try {
          const content = await generateCoherentContent(blockType, businessInfo, {
            previousBlocks: selectedBlocks,
            prompt
          }, businessImages)
          
          if (content) {
            selectedBlocks.push({
              type: blockType,
              content,
              position: selectedBlocks.length
            })
          }
        } catch (error) {
          console.error(`Error generating ${blockType}:`, error)
          // Usar fallback
          selectedBlocks.push({
            type: blockType,
            content: config.contentGenerator(businessInfo),
            position: selectedBlocks.length
          })
        }
      }
    }
  }

  // Asegurar mínimo 14 bloques añadiendo bloques adicionales si es necesario
  if (selectedBlocks.length < 14) {
    const remainingBlocks = BLOCK_MAPPINGS
      .filter(config => !selectedBlocks.some(b => b.type === config.type))
      .sort((a, b) => a.priority - b.priority)
    
    const needed = 14 - selectedBlocks.length
    for (let i = 0; i < Math.min(needed, remainingBlocks.length); i++) {
      const config = remainingBlocks[i]
      try {
        const content = await generateCoherentContent(config.type, businessInfo, {
          previousBlocks: selectedBlocks,
          prompt
        }, businessImages)
        
        if (content) {
          selectedBlocks.push({
            type: config.type,
            content,
            position: selectedBlocks.length
          })
        }
      } catch (error) {
        console.error(`Error generating additional ${config.type}:`, error)
        selectedBlocks.push({
          type: config.type,
          content: config.contentGenerator(businessInfo),
          position: selectedBlocks.length
        })
      }
    }
  }

  return selectedBlocks.sort((a, b) => a.position - b.position)
}

// Función para generar información básica del negocio sin IA
function generateSmartBusinessInfo(prompt: string): BusinessInfo {
  console.log('Generating smart business info from prompt:', prompt)
  
  const lowerPrompt = prompt.toLowerCase()
  
  // Detección de industria
  let industry = 'general'
  let businessType = 'Mi Negocio'
  let mainGoal = 'vender online'
  let targetAudience = 'general'
  
  // Mapeo de palabras clave a industrias
  const industryMap = {
    'restaurante': { industry: 'restaurant', businessType: 'Restaurante', mainGoal: 'mostrar menú y tomar reservas', targetAudience: 'clientes locales' },
    'comida': { industry: 'food', businessType: 'Negocio de Comida', mainGoal: 'vender productos alimenticios', targetAudience: 'amantes de la buena comida' },
    'nutricionista': { industry: 'health', businessType: 'Consultorio de Nutrición', mainGoal: 'mostrar servicios y citas', targetAudience: 'personas saludables' },
    'cursos': { industry: 'education', businessType: 'Academia Online', mainGoal: 'vender cursos online', targetAudience: 'estudiantes' },
    'programación': { industry: 'technology', businessType: 'Academia de Programación', mainGoal: 'enseñar habilidades técnicas', targetAudience: 'desarrolladores' },
    'diseño': { industry: 'design', businessType: 'Estudio de Diseño', mainGoal: 'mostrar portafolio', targetAudience: 'empresas y clientes' },
    'tienda': { industry: 'retail', businessType: 'Tienda Online', mainGoal: 'vender productos', targetAudience: 'compradores online' },
    'servicios': { industry: 'services', businessType: 'Empresa de Servicios', mainGoal: 'ofrecer servicios profesionales', targetAudience: 'empresas' },
    'consultoría': { industry: 'consulting', businessType: 'Consultora', mainGoal: 'asesorar a clientes', targetAudience: 'empresas' },
    'fotografía': { industry: 'photography', businessType: 'Estudio de Fotografía', mainGoal: 'mostrar trabajo fotográfico', targetAudience: 'clientes' },
    'skincare': { industry: 'beauty', businessType: 'Marca de Skincare', mainGoal: 'vender productos de belleza', targetAudience: 'mujeres' },
    'zapatería': { industry: 'fashion', businessType: 'Zapatería', mainGoal: 'vender calzado', targetAudience: 'clientes de moda' },
    'alquiler': { industry: 'hospitality', businessType: 'Alquileres Temporarios', mainGoal: 'alquilar propiedades vacacionales', targetAudience: 'turistas y familias' },
    'temporario': { industry: 'hospitality', businessType: 'Alquileres Temporarios', mainGoal: 'alquilar propiedades vacacionales', targetAudience: 'turistas y familias' },
    'costa': { industry: 'hospitality', businessType: 'Complejos Turísticos', mainGoal: 'ofrecer alojamiento en la playa', targetAudience: 'veraneantes' },
    'gaviotas': { industry: 'hospitality', businessType: 'Alquileres Las Gaviotas', mainGoal: 'alquilar departamentos en la costa', targetAudience: 'turistas y familias' },
    'departamento': { industry: 'hospitality', businessType: 'Alquiler de Departamentos', mainGoal: 'alquilar propiedades equipadas', targetAudience: 'turistas y familias' },
    'complejo': { industry: 'hospitality', businessType: 'Complejos Turísticos', mainGoal: 'ofrecer alojamiento con amenities', targetAudience: 'familias y parejas' },
    'playa': { industry: 'hospitality', businessType: 'Alojamiento en la Playa', mainGoal: 'ofrecer alojamiento cerca del mar', targetAudience: 'veraneantes' },
    'vacacional': { industry: 'hospitality', businessType: 'Alquileres Vacacionales', mainGoal: 'alquilar para temporadas', targetAudience: 'turistas' }
  }
  
  // Buscar coincidencias en el prompt
  for (const [keyword, info] of Object.entries(industryMap)) {
    if (lowerPrompt.includes(keyword)) {
      industry = info.industry
      businessType = info.businessType
      mainGoal = info.mainGoal
      targetAudience = info.targetAudience
      break
    }
  }
  
  // Características basadas en la industria
  const featureMap = {
    'restaurant': ['comida deliciosa', 'servicio rápido', 'ambiente acogedor', 'precios competitivos'],
    'food': ['productos frescos', 'calidad garantizada', 'entrega a domicilio', 'variedad de opciones'],
    'health': ['asesoramiento personalizado', 'planes nutricionales', 'seguimiento continuo', 'resultados comprobados'],
    'education': ['contenido de calidad', 'expertos en la materia', 'certificación', 'soporte 24/7'],
    'technology': ['tecnología actualizada', 'proyectos prácticos', 'mentoría', 'comunidad activa'],
    'design': ['creatividad', 'diseños únicos', 'atención al detalle', 'entrega puntual'],
    'retail': ['productos de calidad', 'precios accesibles', 'envío rápido', 'devoluciones fáciles'],
    'services': ['profesionalismo', 'experiencia', 'resultados garantizados', 'atención personalizada'],
    'consulting': ['expertos en la industria', 'soluciones a medida', 'mejora de procesos', 'ROI medible'],
    'photography': ['equipo profesional', 'edición de calidad', 'creatividad', 'rapidez de entrega'],
    'beauty': ['productos naturales', 'resultados visibles', 'dermatológicamente testado', 'envío gratuito'],
    'fashion': ['tendencias actuales', 'calidad premium', 'comodidad', 'estilo único'],
    'hospitality': ['propiedades equipadas', 'ubicación privilegiada', 'servicio de limpieza', 'amenidades exclusivas', 'seguridad las 24 horas', 'WiFi de alta velocidad', 'aire acondicionado', 'estacionamiento privado']
  }
  
  const keyFeatures = featureMap[industry as keyof typeof featureMap] || 
    ['calidad', 'servicio', 'profesionalismo', 'innovación']
  
  // Personalidad de marca basada en la industria
  const personalityMap = {
    'restaurant': 'acogedora',
    'food': 'tradicional',
    'health': 'profesional',
    'education': 'innovadora',
    'technology': 'moderna',
    'design': 'creativa',
    'retail': 'amigable',
    'services': 'profesional',
    'consulting': 'experta',
    'photography': 'artística',
    'beauty': 'elegante',
    'fashion': 'moderna',
    'hospitality': 'acogedora'
  }
  
  const brandPersonality = personalityMap[industry as keyof typeof personalityMap] || 'profesional'
  
  // Propuesta única de valor
  const uspMap = {
    'restaurant': 'experiencia culinaria única',
    'food': 'sabor casero con ingredientes frescos',
    'health': 'enfoque holístico para la salud',
    'education': 'aprendizaje práctico y aplicable',
    'technology': 'tecnología de vanguardia',
    'design': 'diseños que cuentan historias',
    'retail': 'la mejor relación calidad-precio',
    'services': 'soluciones que transforman negocios',
    'consulting': 'estrategias que generan resultados',
    'photography': 'momentos capturados con arte',
    'beauty': 'belleza natural y sostenible',
    'fashion': 'estilo que define personalidad',
    'hospitality': 'experiencia vacacional inolvidable con atención personalizada'
  }
  
  const uniqueSellingProposition = uspMap[industry as keyof typeof uspMap] || 'calidad y servicio excepcional'
  
  // Llamada a la acción
  const ctaMap = {
    'restaurant': 'reservar mesa',
    'food': 'hacer pedido',
    'health': 'agendar consulta',
    'education': 'inscribirse',
    'technology': 'comenzar a aprender',
    'design': 'ver portafolio',
    'retail': 'comprar ahora',
    'services': 'contratar servicio',
    'consulting': 'solicitar asesoría',
    'photography': 'contratar sesión',
    'beauty': 'comprar productos',
    'fashion': 'ver colección',
    'hospitality': 'reservar ahora'
  }
  
  const callToAction = ctaMap[industry as keyof typeof ctaMap] || 'contactar'
  
  // Detección de ubicación específica
  let location = null
  if (lowerPrompt.includes('las gaviotas')) {
    location = 'Las Gaviotas, Partido de Villa Gesell, Buenos Aires'
  } else if (lowerPrompt.includes('villa gesell')) {
    location = 'Villa Gesell, Buenos Aires'
  } else if (lowerPrompt.includes('mar del plata')) {
    location = 'Mar del Plata, Buenos Aires'
  } else if (lowerPrompt.includes('pinamar')) {
    location = 'Pinamar, Buenos Aires'
  } else if (lowerPrompt.includes('cariló')) {
    location = 'Cariló, Buenos Aires'
  } else if (lowerPrompt.includes('monte hermoso')) {
    location = 'Monte Hermoso, Buenos Aires'
  } else if (lowerPrompt.includes('necochea')) {
    location = 'Necochea, Buenos Aires'
  } else if (lowerPrompt.includes('miramar')) {
    location = 'Miramar, Buenos Aires'
  } else if (lowerPrompt.includes('san clemente')) {
    location = 'San Clemente del Tuyú, Buenos Aires'
  } else if (lowerPrompt.includes('santa teresita')) {
    location = 'Santa Teresita, Buenos Aires'
  } else if (lowerPrompt.includes('mar de las pampas')) {
    location = 'Mar de las Pampas, Buenos Aires'
  } else if (lowerPrompt.includes('mar azul')) {
    location = 'Mar Azul, Buenos Aires'
  }
  
  // Detección mejorada de nombres de complejos
  if (lowerPrompt.includes('oceano') || lowerPrompt.includes('océano')) {
    businessType = businessType.includes('Océano') ? businessType : `Complejo Océano - ${businessType}`
  }
  if (lowerPrompt.includes('medano') || lowerPrompt.includes('medano 29')) {
    businessType = businessType.includes('Médano') ? businessType : `Complejo Médano 29 - ${businessType}`
  }
  
  const result: BusinessInfo = {
    businessType,
    industry,
    location,
    targetAudience,
    mainGoal,
    keyFeatures,
    brandPersonality,
    uniqueSellingProposition,
    callToAction
  }
  
  console.log('Generated smart business info:', result)
  return result
}

// Función para generar bloques específicos y detallados según el tipo de negocio
function generateDetailedBlocks(prompt: string, businessInfo: BusinessInfo, businessImages: { [key: string]: string }): GeneratedBlock[] {
  console.log('Generating detailed blocks for business:', businessInfo.businessType)
  
  const basicBlocks: GeneratedBlock[] = []
  
  // 1 - Hero slide interactivo (posición 0)
  basicBlocks.push({
    type: 'hero-slide',
    content: {
      slides: [{
        id: 'slide-1',
        backgroundImage: businessImages?.hero || businessImages?.background || 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&h=600&fit=crop',
        title: businessInfo.businessType,
        subtitle: businessInfo.uniqueSellingProposition || `Líder en ${businessInfo.industry}`,
        buttonText: businessInfo.callToAction || 'Conocer Más',
        buttonType: 'external' as const,
        buttonTarget: '#contacto',
        textColor: 'light' as const,
        imageFilter: 'none' as const
      }],
      navigationStyle: 'arrows' as const,
      autoPlay: true,
      autoPlayInterval: 5000,
      transitionType: 'fade' as const,
      transitionSpeed: 500,
      height: 'viewport' as const,
      marginTop: 0,
      marginBottom: 0,
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-0',
        paddingX: 'px-0'
      }
    },
    position: 0
  })
  
  // 2 - Bloque refuerzo (posición 1)
  basicBlocks.push({
    type: 'reinforcement',
    content: {
      title: `Más de 10 años de experiencia en ${businessInfo.industry}`,
      description: `En ${businessInfo.businessType} cuidamos cada detalle: calidad, atención directa y ambientes profesionales durante todo el año.`,
      features: [
        {
          title: 'Calidad Profesional',
          description: `${businessInfo.industry.charAt(0).toUpperCase() + businessInfo.industry.slice(1)} de la más alta calidad`
        },
        {
          title: 'Atención Personalizada',
          description: 'Trato directo y servicio dedicado a cada cliente'
        },
        {
          title: 'Innovación Constante',
          description: 'Siempre a la vanguardia de las últimas tendencias'
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 1
  })
  
  // 3 - Características ppales (posición 2)
  basicBlocks.push({
    type: 'features',
    content: {
      title: 'Características Principales',
      subtitle: `Lo que nos hace únicos en ${businessInfo.industry}`,
      features: [
        {
          icon: '⭐',
          title: 'Excelencia',
          description: `Estándares superiores en ${businessInfo.industry.toLowerCase()}`
        },
        {
          icon: '🎯',
          title: 'Enfoque',
          description: `Especializados en ${businessInfo.targetAudience || 'nuestros clientes'}`
        },
        {
          icon: '📍',
          title: 'Ubicación',
          description: businessInfo.location || 'Ubicación estratégica'
        },
        {
          icon: '💎',
          title: 'Calidad',
          description: businessInfo.uniqueSellingProposition || 'Compromiso con la excelencia'
        },
        {
          icon: '🚀',
          title: 'Innovación',
          description: 'Tecnología y métodos modernos'
        },
        {
          icon: '🛡️',
          title: 'Confianza',
          description: 'Seguridad y garantía en nuestros servicios'
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 2
  })
  
  // 4 - Bloque hero dividido (posición 3)
  basicBlocks.push({
    type: 'hero-split',
    content: {
      title: `Experiencia en ${businessInfo.industry}`,
      subtitle: businessInfo.businessType,
      description: `Descubre nuestra propuesta única de valor en ${businessInfo.industry.toLowerCase()}`,
      leftImage: businessImages?.hero || businessImages?.background || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      leftImageAlt: `Imagen de ${businessInfo.businessType}`,
      primaryButtonText: 'Conocer Más',
      primaryButtonUrl: '#nosotros',
      secondaryButtonText: 'Ver Servicios',
      secondaryButtonUrl: '#servicios',
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-20',
        paddingX: 'px-6'
      }
    },
    position: 3
  })
  
  // 5 - Carac del producto (posición 4)
  basicBlocks.push({
    type: 'product-features',
    content: {
      title: 'Nuestros Productos y Servicios',
      subtitle: `Todo lo que ofrecemos en ${businessInfo.industry}`,
      features: [
        {
          id: 'feature-1',
          title: 'Calidad Superior',
          description: `Productos de ${businessInfo.industry.toLowerCase()} con los más altos estándares`
        },
        {
          id: 'feature-2',
          title: 'Variedad',
          description: 'Amplia selección para diferentes necesidades y preferencias'
        },
        {
          id: 'feature-3',
          title: 'Innovación',
          description: 'Últimas tendencias y tecnología en nuestros productos'
        },
        {
          id: 'feature-4',
          title: 'Servicio Personalizado',
          description: 'Atención dedicada y asesoramiento experto'
        },
        {
          id: 'feature-5',
          title: 'Garantía',
          description: 'Confianza y seguridad en cada producto'
        },
        {
          id: 'feature-6',
          title: 'Soporte',
          description: 'Acompañamiento continuo post-venta'
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 4
  })
  
  // 6 - Bloque promocional (posición 5)
  basicBlocks.push({
    type: 'countdown',
    content: {
      title: 'Promo Lanzamiento Temporada 2025',
      subtitle: '15% OFF + Beneficios Exclusivos',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      backgroundImage: businessImages?.background || 'https://images.unsplash.com/photo-1564013799219-ab600027ffc6?w=1200&h=600&fit=crop',
      button: {
        text: 'Aprovechar Oferta',
        link: '#contacto',
        linkType: 'external' as const,
        color: 'bg-primary',
        hoverColor: 'bg-primary/90'
      },
      alignment: 'center' as const,
      timerStyle: 'digital' as const,
      timerColors: {
        numbers: '#ffffff',
        labels: '#ffffff',
        background: '#000000'
      },
      expiredAction: 'show-message' as const,
      expiredMessage: 'La oferta ha finalizado',
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 5
  })
  
  // 7 - Redes Sociales (posición 6)
  basicBlocks.push({
    type: 'social-media',
    content: {
      buttonPosition: 'right' as const,
      buttonMargin: 20,
      buttonColor: '#25D366',
      socialLinks: [
        {
          id: 'instagram',
          name: 'Instagram',
          icon: '📸',
          url: `https://instagram.com/${businessInfo.businessType.toLowerCase().replace(/\s+/g, '')}`,
          order: 1
        },
        {
          id: 'facebook',
          name: 'Facebook',
          icon: '👍',
          url: `https://facebook.com/${businessInfo.businessType.toLowerCase().replace(/\s+/g, '')}`,
          order: 2
        },
        {
          id: 'tiktok',
          name: 'TikTok',
          icon: '🎥',
          url: `https://tiktok.com/@${businessInfo.businessType.toLowerCase().replace(/\s+/g, '')}`,
          order: 3
        }
      ],
      animationType: 'vertical' as const,
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 6
  })
  
  // 8 - Bloque youtube (siempre usaremos demo https://www.youtube.com/watch?v=S9w88y5Od9w) (posición 7)
  basicBlocks.push({
    type: 'youtube',
    content: {
      title: `Conocé ${businessInfo.businessType}`,
      description: 'Video institucional que muestra nuestra experiencia, instalaciones y el valor que agregamos a cada cliente.',
      videoUrl: 'https://www.youtube.com/watch?v=S9w88y5Od9w',
      videoId: 'S9w88y5Od9w',
      visualMode: 'light' as const,
      controls: {
        hideControls: false,
        hideTitle: false,
        autoPlay: false,
        muteOnStart: false,
        loop: false,
        showRelatedVideos: false,
        modestBranding: true
      },
      size: {
        preset: 'large' as const,
        height: '400',
        heightUnit: 'px' as const,
        marginTop: 0,
        marginBottom: 0
      },
      alignment: 'center' as const,
      advanced: {
        startTime: 0,
        language: 'es'
      },
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 7
  })
  
  // 9 - Bloque de carrito de productos (posición 8)
  basicBlocks.push({
    type: 'product-cart',
    content: {
      title: 'Nuestros Productos Destacados',
      subtitle: `Selección exclusiva de ${businessInfo.industry}`,
      whatsappNumber: '5491168765432',
      products: [
        {
          id: 'producto-1',
          name: `Producto Premium ${businessInfo.industry}`,
          description: `El mejor producto de ${businessInfo.industry.toLowerCase()} para clientes exigentes`,
          price: 299.99,
          currency: 'ARS',
          image: businessImages?.product || businessImages?.background || 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=400&h=300&fit=crop',
          category: 'Premium',
          inStock: true,
          features: ['Alta calidad', 'Garantizado', 'Entrega rápida']
        },
        {
          id: 'producto-2',
          name: `Producto Estándar ${businessInfo.industry}`,
          description: `Solución confiable de ${businessInfo.industry.toLowerCase()} para uso diario`,
          price: 199.99,
          currency: 'ARS',
          image: businessImages?.background || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
          category: 'Estándar',
          inStock: true,
          features: ['Calidad confiable', 'Buen precio', 'Disponible']
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 8
  })
  
  // 10 - Bloque de testimonios (posición 9)
  basicBlocks.push({
    type: 'testimonials',
    content: {
      title: 'Lo que dicen nuestros clientes',
      subtitle: `Experiencias reales con ${businessInfo.businessType}`,
      testimonials: [
        {
          name: 'María García',
          role: 'Cliente Satisfecho',
          company: businessInfo.location || 'Buenos Aires',
          content: `Excelente atención y calidad en ${businessInfo.industry.toLowerCase()}. El lugar es increíble, ideal para recomendar.`,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        {
          name: 'Juan Pérez',
          role: 'Cliente Frecuente',
          company: businessInfo.location || 'Córdoba',
          content: `Volvería sin dudar. Todo impecable, muy profesional y con resultados excelentes.`,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        {
          name: 'Ana Martínez',
          role: 'Cliente Nuevo',
          company: businessInfo.location || 'Rosario',
          content: `La atención es excelente y los productos son de primera. Muy recomendable.`,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 9
  })
  
  // 11 - Bloque CTA (posición 10)
  basicBlocks.push({
    type: 'cta',
    content: {
      title: `¿Listo para experimentar ${businessInfo.businessType}?`,
      description: `Contactanos directamente y descubrí por qué somos líderes en ${businessInfo.industry.toLowerCase()}.`,
      buttonText: businessInfo.callToAction || 'Consultar Ahora',
      buttonLink: '#contacto',
      backgroundImage: businessImages?.cta || businessImages?.background || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-20',
        paddingX: 'px-6'
      }
    },
    position: 10
  })
  
  // 12 - Bloque de precios (posición 11)
  basicBlocks.push({
    type: 'pricing',
    content: {
      title: 'Nuestros Precios',
      subtitle: `Planes de ${businessInfo.industry} para todas las necesidades`,
      plans: [
        {
          icon: '🌟',
          name: 'Básico',
          price: '$19.999',
          period: 'por mes',
          description: 'Perfecto para comenzar',
          features: [
            `${businessInfo.industry} básico`,
            'Soporte por email',
            '1 revisión mensual',
            'Acceso a plataforma'
          ],
          buttonText: 'Empezar',
          buttonLink: '#contacto',
          featured: false
        },
        {
          icon: '🚀',
          name: 'Profesional',
          price: '$39.999',
          period: 'por mes',
          description: 'Lo más popular',
          features: [
            'Todo lo del Básico',
            `${businessInfo.industry} avanzado`,
            'Soporte prioritario',
            'Revisiones ilimitadas',
            'Análisis detallado'
          ],
          buttonText: 'Elegir Plan',
          buttonLink: '#contacto',
          featured: true
        },
        {
          icon: '💎',
          name: 'Empresarial',
          price: '$79.999',
          period: 'por mes',
          description: 'Para grandes proyectos',
          features: [
            'Todo lo del Profesional',
            `${businessInfo.industry} empresarial`,
            'Soporte 24/7',
            'API completa',
            'Personalización total'
          ],
          buttonText: 'Contactar',
          buttonLink: '#contacto',
          featured: false
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 11
  })
  
  // 13 - Contacto whatsapp (posición 12)
  basicBlocks.push({
    type: 'whatsapp-contact',
    content: {
      title: 'Consultanos ahora',
      description: `Por disponibilidad o promociones en ${businessInfo.industry.toLowerCase()}`,
      whatsappNumber: '5491168765432',
      defaultMessage: `Hola, estoy interesado en ${businessInfo.businessType}. ¿Podrían darme más información sobre sus servicios de ${businessInfo.industry.toLowerCase()}?`,
      buttonText: 'WhatsApp +54 9 11 6876-5432',
      leftImage: businessImages?.contact || businessImages?.background || 'https://images.unsplash.com/photo-1607082348824-0a96f2a2bdaa?w=600&h=400&fit=crop',
      leftImageAlt: 'Contacto WhatsApp',
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-16',
        paddingX: 'px-6'
      }
    },
    position: 12
  })
  
  // 14 - Bloque de pie de pagina (posición 13)
  basicBlocks.push({
    type: 'footer',
    content: {
      logo: '',
      company: businessInfo.businessType,
      description: `Líderes en ${businessInfo.industry} con compromiso de calidad y servicio profesional.`,
      links: [
        {
          title: 'Enlaces Rápidos',
          items: [
            { text: 'Inicio', url: '#' },
            { text: 'Servicios', url: '#servicios' },
            { text: 'Productos', url: '#productos' },
            { text: 'Contacto', url: '#contacto' }
          ]
        },
        {
          title: 'Nuestros Servicios',
          items: [
            { text: businessInfo.industry, url: '#' },
            { text: 'Asesoramiento', url: '#' },
            { text: 'Soporte', url: '#' },
            { text: 'Ubicación', url: '#' }
          ]
        }
      ],
      socialLinks: [
        {
          platform: 'Instagram',
          url: `https://instagram.com/${businessInfo.businessType.toLowerCase().replace(/\s+/g, '')}`,
          icon: '📷'
        },
        {
          platform: 'Facebook',
          url: `https://facebook.com/${businessInfo.businessType.toLowerCase().replace(/\s+/g, '')}`,
          icon: '👍'
        },
        {
          platform: 'TikTok',
          url: `https://tiktok.com/@${businessInfo.businessType.toLowerCase().replace(/\s+/g, '')}`,
          icon: '🎥'
        }
      ],
      styles: {
        backgroundColor: 'bg-background',
        paddingY: 'py-8',
        paddingX: 'px-6'
      }
    },
    position: 13
  })
  
  console.log(`Generated ${basicBlocks.length} detailed blocks for ${businessInfo.businessType}`)
  return basicBlocks
}

export async function POST(request: NextRequest) {
  const totalStartTime = Date.now()
  console.log('[AUDIT] ===== STARTING LANDING GENERATION PROCESS =====')
  
  try {
    const { prompt, theme = 'system', processedContent } = await request.json()
    console.log('[AUDIT] Received processedContent:', processedContent)

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt inválido' },
        { status: 400 }
      )
    }

    console.log('[AUDIT] Generating landing for prompt:', prompt, 'with theme:', theme)

    // Extraer información del negocio con timeout general más corto
    console.log('[AUDIT] Extracting business information...')
    let businessInfo
    
    // Si tenemos contenido procesado, usarlo en lugar de extraer con IA
    if (processedContent) {
      console.log('[AUDIT] Using processed content instead of AI extraction')
      
      // Convertir el contenido procesado al formato BusinessInfo
      businessInfo = {
        businessType: processedContent.businessInfo.type,
        industry: processedContent.businessInfo.type,
        location: processedContent.businessInfo.location,
        targetAudience: 'general',
        mainGoal: 'vender online',
        keyFeatures: processedContent.features.map(f => f.title),
        brandPersonality: 'profesional',
        processedContent: processedContent // Guardar el contenido completo para uso posterior
      }
    } else {
      try {
        console.log('[AUDIT] Extracting business info with AI...')
        businessInfo = await createTimeoutRequest(async () => {
          return await extractBusinessInfo(prompt)
        }, 15000) // 15 segundos timeout total para la extracción
      } catch (extractionError) {
        console.log('[AUDIT] AI business info extraction failed, using smart fallback')
        businessInfo = generateSmartBusinessInfo(prompt)
      }
    }
    
    console.log('[AUDIT] Extracted business info:', businessInfo)

    // Buscar imágenes relevantes para el negocio con timeout más corto
    console.log('[AUDIT] Searching business images...')
    const businessImages = await createTimeoutRequest(async () => {
      return await searchBusinessImages(businessInfo)
    }, 10000) // 10 segundos para búsqueda de imágenes
    
    console.log('[AUDIT] Business images found:', Object.keys(businessImages))

    // Seleccionar y generar bloques con contenido coherente e imágenes
    console.log('[AUDIT] Starting block generation process...')
    const blockGenerationStartTime = Date.now()
    
    let blocks
    try {
      blocks = await createTimeoutRequest(async () => {
        return await selectBlocks(prompt, businessInfo, businessImages)
      }, 15000) // 15 segundos para generación de bloques
      
      const blockGenerationEndTime = Date.now()
      console.log(`[AUDIT] Block generation completed in ${blockGenerationEndTime - blockGenerationStartTime}ms`)
    } catch (blockError) {
      const blockGenerationErrorTime = Date.now() - blockGenerationStartTime
      console.log(`[AUDIT] AI block generation failed after ${blockGenerationErrorTime}ms, using basic fallback blocks`)
      console.log('[AUDIT] Block generation error:', blockError)
      blocks = generateDetailedBlocks(prompt, businessInfo, businessImages)
    }
    
    console.log('[AUDIT] Total blocks generated:', blocks.length)

    // Apply cache busting to all image URLs in generated blocks
    const blocksWithCacheBust = processGeneratedBlocks(blocks)
    
    // Add IDs to generated blocks for frontend compatibility
    const blocksWithIds = blocksWithCacheBust.map((block, index) => ({
      ...block,
      id: `block-${Date.now()}-${index}`
    }))

    const totalTime = Date.now() - totalStartTime
    console.log(`[AUDIT] ===== LANDING GENERATION COMPLETED SUCCESSFULLY IN ${totalTime}ms =====`)
    
    return NextResponse.json({
      success: true,
      businessInfo,
      blocks: blocksWithIds,
      businessImages,
      theme,
      message: `Landing generada con ${blocksWithIds.length} bloques para ${businessInfo.businessType}`
    })

  } catch (error) {
    const errorTime = Date.now() - totalStartTime
    console.error(`[AUDIT] ===== LANDING GENERATION FAILED AFTER ${errorTime}ms =====`)
    console.error('Error generating landing:', error)
    
    // Proporcionar mensajes de error más específicos
    let errorMessage = 'Error al generar la landing'
    let errorDetails = error.message
    
    if (error.message.includes('timeout')) {
      errorMessage = 'El servicio de IA está tardando demasiado en responder'
      errorDetails = 'Por favor, intenta nuevamente en unos momentos'
    } else if (error.message.includes('Failed to initialize Z-AI SDK')) {
      errorMessage = 'No se pudo conectar con el servicio de IA'
      errorDetails = 'Por favor, verifica tu conexión e intenta nuevamente'
    } else if (error.message.includes('API Error: 504')) {
      errorMessage = 'El servicio de IA no está disponible temporalmente'
      errorDetails = 'Por favor, intenta nuevamente más tarde'
    } else if (error.message.includes('API Error: 502')) {
      errorMessage = 'El servicio de IA está experimentando problemas técnicos'
      errorDetails = 'Por favor, intenta nuevamente en unos minutos'
    } else if (error.message.includes('Bad Gateway')) {
      errorMessage = 'Error de comunicación con el servicio de IA'
      errorDetails = 'El servicio está temporalmente fuera de línea, por favor intenta más tarde'
    } else if (error.message.includes('MCP Error')) {
      errorMessage = 'El servicio de IA está en mantenimiento o actualización'
      errorDetails = 'Por favor, intenta nuevamente en unos minutos o use el modo offline'
    } else if (error.message.includes('Failed to initialize')) {
      errorMessage = 'No se pudo inicializar el servicio de IA'
      errorDetails = 'El servicio puede estar en mantenimiento, por favor intente más tarde'
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}