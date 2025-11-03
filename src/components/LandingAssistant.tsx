'use client'

import { ConversationalChat } from './ConversationalChat'

interface LandingAssistantProps {
  onGenerateLanding: (prompt: string, processedContent?: any) => void
  onManualMode: () => void
  isGenerating?: boolean
}

export function LandingAssistant({ onGenerateLanding, onManualMode, isGenerating = false }: LandingAssistantProps) {
  const handleBusinessInfoComplete = (businessInfo: any) => {
    console.log("🎯 LANDING ASSISTANT: Recibiendo businessInfo:", businessInfo)
    console.log("📋 LANDING ASSISTANT: landingContent recibido:", businessInfo.landingContent?.substring(0, 100) + "...")
    
    // 🎯 EXTRAER DATOS DINÁMICOS DEL landingContent
    const extractLandingData = (content: string) => {
      const lines = content.split('\n').filter(line => line.trim())
      const data: any = {}
      
      lines.forEach((line, index) => {
        // Extraer título principal
        if (line.includes('1⃣') || line.includes('Hero Principal')) {
          const titleMatch = lines[index + 1]?.match(/^(.+)$/)
          const subtitleMatch = lines[index + 2]?.match(/^(.+)$/)
          data.heroTitle = titleMatch?.[1] || 'Tu Negocio'
          data.heroSubtitle = subtitleMatch?.[1] || 'Descripción principal'
        }
        
        // Extraer introducción
        if (line.includes('2⃣') || line.includes('Introducción')) {
          const introMatch = lines[index + 1]?.match(/^(.+)$/)
          data.introduction = introMatch?.[1] || 'Introducción del negocio'
        }
        
        // Extraer características
        if (line.includes('3⃣') || line.includes('Características')) {
          const features = []
          let i = index + 1
          while (i < lines.length && lines[i]?.match(/^[🍏🚚🌱⭐]/)) {
            const featureMatch = lines[i]?.match(/^[🍏🚚🌱⭐]\s*(.+)$/)
            if (featureMatch) {
              features.push({
                icon: lines[i]?.charAt(0) || '⭐',
                title: featureMatch[1].split(' • ')[0] || 'Característica',
                description: featureMatch[1].split(' • ')[1] || 'Descripción'
              })
            }
            i++
          }
          data.features = features
        }
        
        // Extraer promoción
        if (line.includes('4⃣') || line.includes('Promocional')) {
          const promoMatch = lines[index + 1]?.match(/^(.+)$/)
          data.promoTitle = promoMatch?.[1] || 'Promoción especial'
        }
        
        // Extraer testimonios
        if (line.includes('5⃣') || line.includes('Testimonios')) {
          const testimonials = []
          let i = index + 2
          while (i < lines.length && lines[i]?.includes('⭐')) {
            if (lines[i]?.includes('—')) {
              const textMatch = lines[i - 1]?.match(/^"(.+)"$/)
              const authorMatch = lines[i]?.match(/—\s*(.+)$/)
              if (textMatch && authorMatch) {
                testimonials.push({
                  name: authorMatch[1],
                  role: 'Cliente',
                  text: textMatch[1],
                  rating: 5
                })
              }
            }
            i++
          }
          data.testimonials = testimonials
        }
        
        // Extraer CTA final
        if (line.includes('6⃣') || line.includes('CTA Final')) {
          const ctaMatch = lines[index + 1]?.match(/^(.+)$/)
          data.ctaTitle = ctaMatch?.[1] || 'Contacto'
        }
      })
      
      return data
    }
    
    const landingData = extractLandingData(businessInfo.landingContent || '')
    console.log("🔍 LANDING ASSISTANT: Datos extraídos dinámicamente:", landingData)
    
    console.log("🚀 LANDING ASSISTANT: Iniciando generación con datos dinámicos")
    
    // Convert business info a bloques para la landing page
    const blocks = [
      // 1 - Hero Slide Interactivo
      {
        id: 'hero-slide-1',
        type: 'hero-slide',
        content: {
          slides: [
            {
              id: 'slide-1',
              backgroundImage: '',
              title: landingData.heroTitle || businessInfo.nombre_negocio || 'Mi Empresa',
              subtitle: landingData.heroSubtitle || businessInfo.diferencial || 'Líder en el sector',
              buttonText: businessInfo.cta_principal || 'Conocer Más',
              buttonType: 'external' as const,
              buttonTarget: '#',
              textColor: 'light' as const,
              imageFilter: 'none' as const
            }
          ],
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
        }
      },
      // 2 - Bloque Refuerzo
      {
        id: 'reinforcement-1',
        type: 'reinforcement',
        content: {
          title: 'Introducción',
          description: landingData.introduction || 'Conoce más sobre nuestro negocio',
          features: [landingData.heroSubtitle || 'Calidad garantizada'],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 3 - Características Principales
      {
        id: 'features-1',
        type: 'features',
        content: {
          title: 'Características Principales',
          subtitle: 'Lo que nos hace únicos',
          features: landingData.features || [
            {
              icon: '⭐',
              title: 'Característica 1',
              description: 'Descripción de la característica'
            },
            {
              icon: '🎯',
              title: 'Característica 2', 
              description: 'Descripción de la característica'
            },
            {
              icon: '📍',
              title: 'Característica 3',
              description: 'Descripción de la característica'
            }
          ],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 4 - Bloque Hero Dividido
      {
        id: 'hero-split-1',
        type: 'hero-split',
        content: {
          title: 'Servicios Adicionales',
          subtitle: 'Todo lo que ofrecemos para vos',
          description: 'Conocé más sobre nuestros servicios y cómo podemos ayudarte.',
          leftImage: '',
          leftImageAlt: 'Servicios adicionales',
          primaryButtonText: businessInfo.cta_principal || 'Contactar',
          primaryButtonUrl: '#',
          secondaryButtonText: 'Más Información',
          secondaryButtonUrl: '#',
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-20',
            paddingX: 'px-6'
          }
        }
      },
      // 5 - Características del Producto (Promoción)
      {
        id: 'product-features-1',
        type: 'product-features',
        content: {
          title: landingData.promoTitle || 'Promoción Especial',
          subtitle: 'Aprovechá nuestras ofertas',
          features: [
            {
              title: 'Oferta Especial',
              description: 'Promoción disponible por tiempo limitado',
              icon: '🎉'
            },
            {
              title: 'Calidad Garantizada',
              description: 'Los mejores productos y servicios',
              icon: '✨'
            },
            {
              title: 'Atención Personalizada',
              description: 'Servicio dedicado a cada cliente',
              icon: '🎯'
            }
          ],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 6 - Bloque Promocional
      {
        id: 'countdown-1',
        type: 'countdown',
        content: {
          title: '¡Oferta Especial!',
          description: 'No te pierdas esta oportunidad única',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
          buttonText: 'Aprovechar Oferta',
          buttonLink: '#',
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 7 - Redes Sociales
      {
        id: 'social-media-1',
        type: 'social-media',
        content: {
          buttonPosition: 'right' as const,
          buttonMargin: 20,
          buttonColor: '#25D366',
          socialLinks: [
            {
              id: 'whatsapp',
              name: 'WhatsApp',
              icon: '',
              url: 'https://wa.me/+1234567890',
              order: 1
            },
            {
              id: 'facebook',
              name: 'Facebook',
              icon: '',
              url: 'https://facebook.com/',
              order: 2
            },
            {
              id: 'instagram',
              name: 'Instagram',
              icon: '',
              url: 'https://instagram.com/',
              order: 3
            }
          ],
          animationType: 'vertical' as const,
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-4',
            paddingX: 'px-4'
          }
        }
      },
      // 8 - Bloque YouTube
      {
        id: 'youtube-1',
        type: 'youtube',
        content: {
          title: 'Conocé Nuestro Trabajo',
          description: 'Mirá este video para conocer más sobre nuestros servicios y cómo podemos ayudarte.',
          videoUrl: 'https://www.youtube.com/watch?v=S9w88y5Od9w',
          videoId: 'S9w88y5Od9w',
          visualMode: 'light',
          controls: {
            hideControls: false,
            hideTitle: false,
            autoPlay: false,
            muteOnStart: false,
            loop: false,
            showRelatedVideos: true,
            modestBranding: true
          },
          size: {
            preset: 'medium',
            height: '400',
            heightUnit: 'px',
            marginTop: 0,
            marginBottom: 0
          },
          alignment: 'center',
          advanced: {
            startTime: 0,
            language: 'es'
          },
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 9 - Bloque de Carrito de Productos
      {
        id: 'product-cart-1',
        type: 'product-cart',
        content: {
          title: 'Nuestros Productos',
          subtitle: 'Los mejores para vos',
          products: [
            {
              id: 'product-1',
              name: 'Producto Básico',
              price: 99,
              description: 'Perfecto para comenzar',
              currency: 'USD',
              image: '',
              category: 'Básico',
              inStock: true,
              features: ['Funcionalidad esencial', 'Soporte básico']
            },
            {
              id: 'product-2',
              name: 'Producto Profesional',
              price: 199,
              description: 'Para usuarios avanzados',
              currency: 'USD',
              image: '',
              category: 'Profesional',
              inStock: true,
              features: ['Todas las funciones', 'Soporte prioritario']
            }
          ],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 10 - Bloque de Testimonios
      {
        id: 'testimonials-1',
        type: 'testimonials',
        content: {
          title: 'Lo que dicen nuestros clientes',
          subtitle: 'Experiencias reales de quienes confían en nosotros',
          testimonials: landingData.testimonials || [
            {
              name: 'Cliente Satisfecho',
              role: 'Cliente',
              text: 'Excelente servicio, superaron todas mis expectativas.',
              avatar: '',
              rating: 5
            },
            {
              name: 'Cliente Frecuente',
              role: 'Cliente',
              text: 'Profesionales dedicados y resultados garantizados.',
              avatar: '',
              rating: 5
            }
          ],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 11 - Bloque CTA
      {
        id: 'cta-1',
        type: 'cta',
        content: {
          title: landingData.ctaTitle || 'Contacto',
          description: 'No esperes más, contactanos y comenzá a disfrutar de nuestros servicios.',
          buttonText: businessInfo.cta_principal || 'Contactar',
          buttonLink: '#',
          backgroundImage: '',
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 12 - Bloque de Precios
      {
        id: 'pricing-1',
        type: 'pricing',
        content: {
          title: 'Nuestros Planes',
          subtitle: 'Elegí la opción que mejor se adapte a tus necesidades',
          plans: [
            {
              name: 'Básico',
              price: '$99',
              period: '/mes',
              description: 'Perfecto para comenzar',
              features: [
                'Hasta 5 proyectos',
                'Soporte por email',
                '1 GB de almacenamiento',
                'Reportes básicos'
              ],
              buttonText: 'Comenzar',
              buttonLink: '#',
              popular: false
            },
            {
              name: 'Profesional',
              price: '$199',
              period: '/mes',
              description: 'Lo más popular',
              features: [
                'Proyectos ilimitados',
                'Soporte prioritario',
                '10 GB de almacenamiento',
                'Reportes avanzados',
                'Integraciones'
              ],
              buttonText: 'Elegir Plan',
              buttonLink: '#',
              popular: true
            },
            {
              name: 'Empresarial',
              price: '$399',
              period: '/mes',
              description: 'Para grandes empresas',
              features: [
                'Todo lo del Profesional',
                'Almacenamiento ilimitado',
                'API personalizada',
                'Cuenta manager dedicado',
                'SLA garantizado'
              ],
              buttonText: 'Contactar',
              buttonLink: '#',
              popular: false
            }
          ],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 13 - Contacto WhatsApp
      {
        id: 'whatsapp-contact-1',
        type: 'whatsapp-contact',
        content: {
          title: 'Contacto vía WhatsApp',
          description: 'Habla con nosotros directamente por WhatsApp',
          whatsappNumber: '+1234567890', // Este debería ser extraído de la info del negocio
          defaultMessage: `Hola, estoy interesado en ${businessInfo.nombre_negocio || 'sus servicios'}.`,
          buttonText: 'Contactar por WhatsApp',
          leftImage: '',
          leftImageAlt: 'Imagen de contacto',
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-16',
            paddingX: 'px-6'
          }
        }
      },
      // 14 - Bloque de Pie de Página
      {
        id: 'footer-1',
        type: 'footer',
        content: {
          logo: '',
          company: businessInfo.nombre_negocio || 'Mi Empresa',
          description: businessInfo.diferencial || `Líderes en ${businessInfo.rubro || 'nuestro sector'}`,
          links: [
            {
              title: 'Enlaces Rápidos',
              items: [
                { text: 'Inicio', url: '#' },
                { text: 'Servicios', url: '#' },
                { text: 'Sobre Nosotros', url: '#' },
                { text: 'Contacto', url: '#' }
              ]
            }
          ],
          socialLinks: [
            {
              platform: 'Facebook',
              url: 'https://facebook.com/',
              icon: ''
            },
            {
              platform: 'Twitter',
              url: 'https://twitter.com/',
              icon: ''
            },
            {
              platform: 'Instagram',
              url: 'https://instagram.com/',
              icon: ''
            }
          ],
          styles: {
            backgroundColor: 'bg-background',
            paddingY: 'py-8',
            paddingX: 'px-6'
          }
        }
      }
    ]

    // Formatear el processedContent para mantener compatibilidad
    const processedContent = {
      businessInfo: {
        name: businessInfo.nombre_negocio || '',
        type: businessInfo.rubro || '',
        location: businessInfo.ubicacion || '',
        description: businessInfo.diferencial || ''
      },
      features: [
        {
          icon: '⭐',
          title: 'Calidad',
          description: businessInfo.diferencial || 'Servicios de alta calidad'
        },
        {
          icon: '🎯',
          title: 'Enfoque',
          description: `Especializados en ${businessInfo.publico_objetivo || 'nuestros clientes'}`
        },
        {
          icon: '📍',
          title: 'Ubicación',
          description: businessInfo.ubicacion || 'Ubicación estratégica'
        }
      ],
      products: [],
      contact: {
        phone: '',
        email: '',
        address: businessInfo.ubicacion
      },
      cta: {
        primary: businessInfo.cta_principal || 'Ver Más',
        secondary: 'Contactar'
      }
    }
    
    console.log("📦 LANDING ASSISTANT: Bloques generados:", blocks.length, "bloques")
    console.log("📋 LANDING ASSISTANT: Primer bloque título:", blocks[0]?.content?.title)
    console.log("📄 LANDING ASSISTANT: ProcessedContent creado:", processedContent)
    
    console.log("📤 LANDING ASSISTANT: Enviando datos con onGenerateLanding...")
    onGenerateLanding(JSON.stringify(businessInfo), processedContent, blocks)
    console.log("✅ LANDING ASSISTANT: Datos enviados exitosamente")
  }

  return (
    <ConversationalChat
      onBusinessInfoComplete={handleBusinessInfoComplete}
      onManualMode={onManualMode}
      isGenerating={isGenerating}
    />
  )
}