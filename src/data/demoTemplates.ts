import { BlockType } from '@/types'

// Función para agregar parámetro anti-caché a las URLs de imágenes
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
        // Agregar parámetro de cache busting
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
function processTemplateBlocks(blocks: BlockType[]): BlockType[] {
  return blocks.map(block => ({
    ...block,
    content: addCacheBustToImages(block.content)
  }))
}

export const demoTemplates = {
  perfumery: [
    {
      id: 'navigation-1',
      type: 'navigation' as const,
      content: {
        logoPosition: 'center' as const,
        menuPosition: 'right' as const,
        companyName: 'Luxe Parfums',
        customButtons: [],
        showLandings: true
      },
      position: 0
    },
    {
      id: 'hero-1',
      type: 'hero' as const,
      content: {
        title: 'Elegancia en Cada Gotita',
        subtitle: 'Fragancias Exclusivas',
        description: 'Descubre nuestra colección de perfumes de lujo creados con los ingredientes más finos del mundo.',
        primaryButtonText: 'Explorar Colección',
        primaryButtonLink: '#',
        secondaryButtonText: 'Conocer Más',
        secondaryButtonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1590766940554-153aefb4b6a6?w=1200&h=600&fit=crop'
      },
      position: 1
    },
    {
      id: 'features-1',
      type: 'features' as const,
      content: {
        title: 'Arte Perfumado',
        subtitle: 'Lo que nos hace únicos',
        features: [
          {
            icon: '🌹',
            title: 'Ingredientes Naturales',
            description: 'Esencias extraídas de los mejores jardines del mundo'
          },
          {
            icon: '🎨',
            title: 'Diseño Exclusivo',
            description: 'Botellas de cristal diseñadas por artistas reconocidos'
          },
          {
            icon: '⏱️',
            title: 'Larga Duración',
            description: 'Fragancias que perduran hasta 12 horas en tu piel'
          }
        ]
      },
      position: 2
    },
    {
      id: 'testimonials-1',
      type: 'testimonials' as const,
      content: {
        title: 'Testimonios de Clientes',
        testimonials: [
          {
            name: 'Isabella Martínez',
            role: 'Cliente VIP',
            company: '',
            content: 'El perfume "Noche de París" es simplemente mágico. Me siento elegante y segura cada vez que lo uso.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
          },
          {
            name: 'Carlos Rodríguez',
            role: 'Coleccionista',
            company: '',
            content: 'Llevo años coleccionando perfumes y nunca había encontrado nada como esta marca. ¡Excepcional!',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        ]
      },
      position: 3
    },
    {
      id: 'cta-1',
      type: 'cta' as const,
      content: {
        title: 'Encuentra tu Fragancia Perfecta',
        description: 'Agenda una consulta personalizada con nuestros expertos en perfumería.',
        buttonText: 'Reservar Cita',
        buttonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1523293182086-7651a899637b?w=1200&h=400&fit=crop'
      },
      position: 4
    },
    {
      id: 'footer-1',
      type: 'footer' as const,
      content: {
        logo: '/logo.svg',
        company: 'Luxe Parfums',
        description: 'Creando fragancias excepcionales desde 1985.',
        links: [
          {
            title: 'Productos',
            items: [
              { text: 'Perfumes para Mujer', url: '#' },
              { text: 'Perfumes para Hombre', url: '#' },
              { text: 'Colecciones Limitadas', url: '#' }
            ]
          },
          {
            title: 'Sobre Nosotros',
            items: [
              { text: 'Nuestra Historia', url: '#' },
              { text: 'Artesanía', url: '#' },
              { text: 'Tiendas', url: '#' }
            ]
          }
        ],
        socialLinks: [
          { platform: 'instagram', url: '#', icon: '📷' },
          { platform: 'facebook', url: '#', icon: '📘' },
          { platform: 'twitter', url: '#', icon: '🐦' }
        ]
      },
      position: 5
    }
  ],
  
  saas: [
    {
      id: 'navigation-2',
      type: 'navigation' as const,
      content: {
        logoPosition: 'left' as const,
        menuPosition: 'right' as const,
        companyName: 'TechFlow',
        customButtons: [],
        showLandings: true
      },
      position: 0
    },
    {
      id: 'hero-2',
      type: 'hero-split' as const,
      content: {
        title: 'Potencia tu Negocio con Nuestra Plataforma',
        subtitle: 'Solución Todo en Uno',
        description: 'La plataforma completa que necesita tu empresa para crecer. Gestión de proyectos, análisis de datos y colaboración en un solo lugar.',
        primaryButtonText: 'Comenzar Gratis',
        primaryButtonLink: '#',
        secondaryButtonText: 'Ver Demo',
        secondaryButtonLink: '#',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
      },
      position: 1
    },
    {
      id: 'features-2',
      type: 'features' as const,
      content: {
        title: 'Características Principales',
        subtitle: 'Todo lo que necesitas para tener éxito',
        features: [
          {
            icon: '📊',
            title: 'Análisis en Tiempo Real',
            description: 'Dashboard intuitivo con métricas actualizadas al instante'
          },
          {
            icon: '🤝',
            title: 'Colaboración en Equipo',
            description: 'Herramientas integradas para trabajo remoto eficiente'
          },
          {
            icon: '🔒',
            title: 'Seguridad Empresarial',
            description: 'Protección de nivel bancario para tus datos'
          }
        ]
      },
      position: 2
    },
    {
      id: 'process-1',
      type: 'process' as const,
      content: {
        title: 'Nuestro Proceso',
        subtitle: 'Cómo transformamos tu negocio en 4 pasos simples',
        steps: [
          {
            icon: '🚀',
            title: 'Inicio Rápido',
            description: 'Regístrate en minutos y comienza a explorar todas las funcionalidades de nuestra plataforma.'
          },
          {
            icon: '⚙️',
            title: 'Configuración',
            description: 'Personaliza tu espacio de trabajo, invita a tu equipo y configura tus primeros proyectos.'
          },
          {
            icon: '📊',
            title: 'Optimización',
            description: 'Utiliza nuestras herramientas de análisis para identificar oportunidades de mejora.'
          },
          {
            icon: '🎯',
            title: 'Resultados',
            description: 'Observa el crecimiento de tu productividad y la mejora en tus resultados.'
          }
        ]
      },
      position: 3
    },
    {
      id: 'pricing-1',
      type: 'pricing' as const,
      content: {
        title: 'Planes Flexibles',
        subtitle: 'Elige el plan perfecto para tu equipo',
        plans: [
          {
            name: 'Starter',
            price: '$29',
            period: 'mes',
            description: 'Perfecto para pequeños equipos',
            features: [
              'Hasta 5 usuarios',
              '10 GB de almacenamiento',
              'Soporte por email',
              'Análisis básico'
            ],
            buttonText: 'Comenzar',
            buttonLink: '#',
            featured: false
          },
          {
            name: 'Professional',
            price: '$79',
            period: 'mes',
            description: 'Ideal para empresas en crecimiento',
            features: [
              'Hasta 20 usuarios',
              '100 GB de almacenamiento',
              'Soporte prioritario',
              'Análisis avanzado',
              'API access'
            ],
            buttonText: 'Comenzar',
            buttonLink: '#',
            featured: true
          },
          {
            name: 'Enterprise',
            price: '$199',
            period: 'mes',
            description: 'Para grandes organizaciones',
            features: [
              'Usuarios ilimitados',
              'Almacenamiento ilimitado',
              'Soporte 24/7',
              'Análisis personalizado',
              'API dedicada',
              'SLA garantizado'
            ],
            buttonText: 'Contactar',
            buttonLink: '#',
            featured: false
          }
        ]
      },
      position: 4
    },
    {
      id: 'testimonials-2',
      type: 'testimonials' as const,
      content: {
        title: 'Lo que dicen nuestros clientes',
        testimonials: [
          {
            name: 'Ana García',
            role: 'CEO',
            company: 'TechStart',
            content: 'Esta plataforma transformó completamente nuestra forma de trabajar. La productividad aumentó un 300%.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
          },
          {
            name: 'Miguel López',
            role: 'Director de Operaciones',
            company: 'InnovateCorp',
            content: 'La mejor inversión que hemos hecho este año. El ROI es increíble.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        ]
      },
      position: 5
    },
    {
      id: 'footer-2',
      type: 'footer' as const,
      content: {
        logo: '/logo.svg',
        company: 'TechFlow',
        description: 'Empoderando empresas con tecnología innovadora.',
        links: [
          {
            title: 'Producto',
            items: [
              { text: 'Características', url: '#' },
              { text: 'Precios', url: '#' },
              { text: 'Integraciones', url: '#' }
            ]
          },
          {
            title: 'Compañía',
            items: [
              { text: 'Sobre Nosotros', url: '#' },
              { text: 'Blog', url: '#' },
              { text: 'Carreras', url: '#' }
            ]
          }
        ],
        socialLinks: [
          { platform: 'linkedin', url: '#', icon: '💼' },
          { platform: 'twitter', url: '#', icon: '🐦' },
          { platform: 'github', url: '#', icon: '📱' }
        ]
      },
      position: 6
    }
  ],
  
  portfolio: [
    {
      id: 'navigation-3',
      type: 'navigation' as const,
      content: {
        logoPosition: 'center' as const,
        menuPosition: 'right' as const,
        companyName: 'Creative Studio',
        customButtons: [],
        showLandings: true
      },
      position: 0
    },
    {
      id: 'hero-3',
      type: 'hero' as const,
      content: {
        title: 'Diseño que Inspira',
        subtitle: 'Portafolio Creativo',
        description: 'Soy un diseñador apasionado por crear experiencias digitales memorables y soluciones visuales impactantes.',
        primaryButtonText: 'Ver Proyectos',
        primaryButtonLink: '#',
        secondaryButtonText: 'Contactar',
        secondaryButtonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=600&fit=crop'
      },
      position: 1
    },
    {
      id: 'features-3',
      type: 'features' as const,
      content: {
        title: 'Servicios Creativos',
        subtitle: 'Lo que puedo hacer por ti',
        features: [
          {
            icon: '🎨',
            title: 'Diseño UI/UX',
            description: 'Interfaces intuitivas que los usuarios aman'
          },
          {
            icon: '📱',
            title: 'Diseño Responsivo',
            description: 'Experiencias perfectas en todos los dispositivos'
          },
          {
            icon: '🚀',
            title: 'Branding',
            description: 'Identidades visuales únicas y memorables'
          }
        ]
      },
      position: 2
    },
    {
      id: 'stats-1',
      type: 'stats' as const,
      content: {
        title: 'Resultados que Hablan',
        stats: [
          { value: '150+', label: 'Proyectos Completados' },
          { value: '98%', label: 'Clientes Satisfechos' },
          { value: '25', label: 'Premios Ganados' },
          { value: '5+', label: 'Años de Experiencia' }
        ]
      },
      position: 3
    },
    {
      id: 'testimonials-3',
      type: 'testimonials' as const,
      content: {
        title: 'Recomendaciones',
        testimonials: [
          {
            name: 'Laura Sánchez',
            role: 'Marketing Manager',
            company: 'BrandCorp',
            content: 'Trabajar con [Nombre] fue una experiencia increíble. Su creatividad y profesionalidad superaron todas mis expectativas.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
          }
        ]
      },
      position: 4
    },
    {
      id: 'cta-2',
      type: 'cta' as const,
      content: {
        title: '¿Listo para Crear Algo Increble?',
        description: 'Hablemos de tu próximo proyecto y hagamos realidad tus ideas.',
        buttonText: 'Comenzar Proyecto',
        buttonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1559028006-44b36feca3c5?w=1200&h=400&fit=crop'
      },
      position: 5
    }
  ],
  
  event: [
    {
      id: 'navigation-4',
      type: 'navigation' as const,
      content: {
        logoPosition: 'center' as const,
        menuPosition: 'right' as const,
        companyName: 'TechConf 2024',
        customButtons: [],
        showLandings: true
      },
      position: 0
    },
    {
      id: 'hero-4',
      type: 'hero' as const,
      content: {
        title: 'TechConf 2024',
        subtitle: 'La Conferencia de Tecnología del Año',
        description: 'Únete a los líderes más influyentes del mundo tech en 3 días de innovación, networking y aprendizaje.',
        primaryButtonText: 'Comprar Entradas',
        primaryButtonLink: '#',
        secondaryButtonText: 'Ver Agenda',
        secondaryButtonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=1200&h=600&fit=crop'
      },
      position: 1
    },
    {
      id: 'features-4',
      type: 'features' as const,
      content: {
        title: 'Qué Esperar',
        subtitle: 'Una experiencia inolvidable',
        features: [
          {
            icon: '🎤',
            title: 'Speakers de Elite',
            description: 'Más de 50 expertos de las principales empresas tecnológicas'
          },
          {
            icon: '🤝',
            title: 'Networking',
            description: 'Conecta con profesionales de todo el mundo'
          },
          {
            icon: '🏆',
            title: 'Workshops',
            description: 'Sesiones prácticas de aprendizaje hands-on'
          }
        ]
      },
      position: 2
    },
    {
      id: 'timeline-1',
      type: 'timeline' as const,
      content: {
        title: 'Agenda del Evento',
        events: [
          {
            date: 'Día 1 - 15 Nov',
            title: 'Inauguración y Keynotes',
            description: 'Apertura oficial con los principales líderes del sector y presentaciones de productos revolucionarios.'
          },
          {
            date: 'Día 2 - 16 Nov',
            title: 'Workshops y Networking',
            description: 'Sesiones prácticas por la mañana y eventos de networking por la tarde en un entorno exclusivo.'
          },
          {
            date: 'Día 3 - 17 Nov',
            title: 'Futuro Tech y Clausura',
            description: 'Panel sobre las tendencias futuras y ceremonia de clausura con entrega de premios.'
          }
        ]
      },
      position: 3
    },
    {
      id: 'stats-2',
      type: 'stats' as const,
      content: {
        title: 'TechConf en Números',
        stats: [
          { value: '2000+', label: 'Asistentes' },
          { value: '50+', label: 'Speakers' },
          { value: '30', label: 'Países' },
          { value: '100+', label: 'Empresas' }
        ]
      },
      position: 4
    },
    {
      id: 'cta-3',
      type: 'cta' as const,
      content: {
        title: '¿No te lo Pierdas?',
        description: 'Las entradas son limitadas. Asegura tu lugar en el evento tecnológico más importante del año.',
        buttonText: 'Comprar Entradas Ahora',
        buttonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=1200&h=400&fit=crop'
      },
      position: 5
    }
  ],
  
  'next-gen': [
    {
      id: 'navigation-5',
      type: 'navigation' as const,
      content: {
        logoPosition: 'left' as const,
        menuPosition: 'right' as const,
        companyName: 'NextGen Tech',
        customButtons: [],
        showLandings: true
      },
      position: 0
    },
    {
      id: 'hero-5',
      type: 'hero-split' as const,
      content: {
        title: 'El Futuro es Ahora',
        subtitle: 'Tecnología de Vanguardia',
        description: 'Experimenta el poder de la inteligencia artificial y la computación cuántica en nuestras soluciones de última generación.',
        primaryButtonText: 'Explorar',
        primaryButtonLink: '#',
        secondaryButtonText: 'Demo',
        secondaryButtonLink: '#',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop'
      },
      position: 1
    },
    {
      id: 'features-5',
      type: 'features' as const,
      content: {
        title: 'Tecnología Revolucionaria',
        subtitle: 'Lo que nos diferencia',
        features: [
          {
            icon: '🧠',
            title: 'IA Avanzada',
            description: 'Algoritmos de machine learning de última generación'
          },
          {
            icon: '⚡',
            title: 'Velocidad Cuántica',
            description: 'Procesamiento 1000x más rápido que la tecnología tradicional'
          },
          {
            icon: '🌐',
            title: 'Conexión Global',
            description: 'Red distribuida segura y descentralizada'
          }
        ]
      },
      position: 2
    },
    {
      id: 'stats-3',
      type: 'stats' as const,
      content: {
        title: 'Impacto Global',
        stats: [
          { value: '1M+', label: 'Usuarios Activos' },
          { value: '99.9%', label: 'Uptime' },
          { value: '150', label: 'Países' },
          { value: '10TB', label: 'Datos Procesados' }
        ]
      },
      position: 3
    },
    {
      id: 'reinforcement-1',
      type: 'reinforcement' as const,
      content: {
        title: 'Por Qué Elegirnos',
        description: 'La elección natural para el futuro digital',
        features: [
          {
            title: 'Innovación Constante',
            description: 'Siempre a la vanguardia de la tecnología emergente'
          },
          {
            title: 'Seguridad Absoluta',
            description: 'Encriptación cuántica para máxima protección'
          },
          {
            title: 'Escalabilidad Infinita',
            description: 'Crece sin límites con nuestra arquitectura modular'
          },
          {
            title: 'Soporte 24/7',
            description: 'Equipo de expertos disponible siempre que lo necesites'
          }
        ]
      },
      position: 4
    },
    {
      id: 'faq-1',
      type: 'faq' as const,
      content: {
        title: 'Preguntas Frecuentes',
        faqs: [
          {
            question: '¿Qué hace única a su tecnología?',
            answer: 'Nuestra tecnología combina inteligencia artificial avanzada con principios de computación cuántica, lo que nos permite ofrecer soluciones que son exponencialmente más rápidas y eficientes que cualquier alternativa en el mercado.'
          },
          {
            question: '¿Es segura mi información?',
            answer: 'Sí, utilizamos encriptación cuántica de última generación que es teóricamente imposible de romper, incluso con los supercomputadores más potentes del mundo.'
          },
          {
            question: '¿Cómo puedo empezar?',
            answer: 'Puedes comenzar con nuestro plan gratuito para explorar las funcionalidades básicas, o contactar a nuestro equipo de ventas para una demo personalizada de nuestras soluciones empresariales.'
          }
        ]
      },
      position: 5
    },
    {
      id: 'cta-4',
      type: 'cta' as const,
      content: {
        title: 'Únete a la Revolución',
        description: 'Sé parte del futuro con nuestras soluciones tecnológicas de vanguardia.',
        buttonText: 'Comenzar Ahora',
        buttonLink: '#',
        backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop'
      },
      position: 6
    }
  ]
}

// Función exportada para obtener plantillas con cache busting
export function getDemoTemplatesWithCacheBust() {
  const templatesWithCacheBust: any = {}
  
  for (const [key, blocks] of Object.entries(demoTemplates)) {
    templatesWithCacheBust[key] = processTemplateBlocks(blocks)
  }
  
  return templatesWithCacheBust
}

// Función para obtener una plantilla específica con cache busting
export function getDemoTemplateWithCacheBust(templateName: string): BlockType[] {
  const template = demoTemplates[templateName as keyof typeof demoTemplates]
  if (!template) return []
  
  return processTemplateBlocks(template)
}