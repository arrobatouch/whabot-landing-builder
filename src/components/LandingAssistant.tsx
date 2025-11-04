'use client'

import { ConversationalChat } from './ConversationalChat'

interface LandingAssistantProps {
  onGenerateLanding: (prompt: string, processedContent?: any) => void
  onManualMode: () => void
  isGenerating?: boolean
}

export function LandingAssistant({ onGenerateLanding, onManualMode, isGenerating = false }: LandingAssistantProps) {
  const handleBusinessInfoComplete = async (businessInfo: any) => {
    console.log("🎯 LANDING ASSISTANT: Recibiendo businessInfo:", businessInfo)
    console.log("📋 LANDING ASSISTANT: landingContent recibido:", businessInfo.landingContent?.substring(0, 100) + "...")
    
    // 🎯 FUNCIÓN PARA BUSCAR IMÁGENES DINÁMICAS
    const searchDynamicImages = async (keyword: string): Promise<string[]> => {
      try {
        const searchResponse = await fetch('/api/images/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: keyword,
            count: 3,
            orientation: 'landscape'
          }),
        })
        
        if (searchResponse.ok) {
          const searchResult = await searchResponse.json()
          if (searchResult.success && searchResult.images && searchResult.images.length > 0) {
            const images = searchResult.images.map((img: any) => img.url)
            console.log("✅ PARSER: Imágenes dinámicas encontradas:", images.length, "imágenes para", keyword)
            return images
          } else {
            throw new Error('No se encontraron imágenes en la API')
          }
        } else {
          throw new Error('Error en la API de imágenes')
        }
      } catch (error) {
        console.warn("⚠️ PARSER: Error buscando imágenes dinámicas, usando fallback:", error)
        // Fallback: usar imágenes genéricas pero relacionadas al keyword
        return [
          `https://source.unsplash.com/1920x1080/?${keyword},business`,
          `https://source.unsplash.com/1920x1080/?${keyword},professional`,
          `https://source.unsplash.com/1920x1080/?${keyword},modern`
        ]
      }
    }

    // 🎯 EXTRAER DATOS DINÁMICOS DEL landingContent - VERSIÓN 3.2.0
    const extractLandingData = (content: string) => {
      const lines = content.split('\n').filter(line => line.trim())
      const data: any = {}
      
      console.log("🔍 PARSER: Analizando contenido:", content.substring(0, 200) + "...")
      
      lines.forEach((line, index) => {
        // Extraer título principal (1⃣ Hero Principal)
        if (line.includes('1⃣') || line.toLowerCase().includes('hero principal')) {
          console.log("🎯 PARSER: Encontrado Hero Principal en línea:", line)
          // Buscar el título en las siguientes 3 líneas
          for (let i = 1; i <= 3; i++) {
            const titleLine = lines[index + i]
            if (titleLine && !titleLine.match(/^[0-9⃣🔥💎🌟]/) && titleLine.length > 5) {
              data.heroTitle = titleLine.trim()
              console.log("✅ PARSER: Título extraído:", data.heroTitle)
              break
            }
          }
          // Buscar subtítulo
          for (let i = 2; i <= 4; i++) {
            const subtitleLine = lines[index + i]
            if (subtitleLine && subtitleLine !== data.heroTitle && subtitleLine.length > 10) {
              data.heroSubtitle = subtitleLine.trim()
              console.log("✅ PARSER: Subtítulo extraído:", data.heroSubtitle)
              break
            }
          }
          
          // Extraer imágenes para el slider (buscar URLs de imágenes)
          const heroImages = []
          for (let i = 1; i <= 10; i++) {
            const imageLine = lines[index + i]
            if (imageLine && (imageLine.includes('http') && imageLine.includes('.jpg') || imageLine.includes('.png') || imageLine.includes('.webp'))) {
              // Extraer URL de imagen
              const urlMatch = imageLine.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|webp))/i)
              if (urlMatch) {
                heroImages.push(urlMatch[1])
                console.log("✅ PARSER: Imagen extraída:", urlMatch[1])
              }
            }
          }
          
          // Guardar palabras clave para búsqueda dinámica después
          if (heroImages.length === 0) {
            const businessKeywords = content.toLowerCase().match(/fruta|verdura|frutería|verduría|tienda|mercado|alimento|fresco|orgánico|natural|comida|salud|restaurante|hotel|departamento|casa|auto|ropa|tecnología|educación|gimnasio|consultoría|servicio/gi) || []
            data.imageKeyword = businessKeywords[0] || data.heroTitle?.toLowerCase() || 'negocio'
            console.log("🔍 PARSER: Palabra clave para búsqueda dinámica:", data.imageKeyword)
          } else {
            data.heroImages = heroImages
          }
        }
        
        // Extraer introducción (2⃣ Bloque de Introducción)
        if (line.includes('2⃣') || line.toLowerCase().includes('introducción') || line.toLowerCase().includes('bloque de introducción')) {
          console.log("🎯 PARSER: Encontrada Introducción en línea:", line)
          // Buscar el texto de introducción en las siguientes 3 líneas
          for (let i = 1; i <= 3; i++) {
            const introLine = lines[index + i]
            if (introLine && introLine.length > 15 && !introLine.match(/^[0-9⃣🔥💎🌟]/)) {
              data.introduction = introLine.trim()
              console.log("✅ PARSER: Introducción extraída:", data.introduction)
              break
            }
          }
        }
        
        // Extraer características (3⃣ Características con emojis)
        if (line.includes('3⃣') || line.toLowerCase().includes('características')) {
          console.log("🎯 PARSER: Encontradas Características en línea:", line)
          const features = []
          let i = index + 1
          
          // Buscar características con emojis (🍏🚚🌱⭐ o cualquier emoji)
          while (i < lines.length && i < index + 10) { // Máximo 10 líneas después
            const featureLine = lines[i]
            if (featureLine && featureLine.match(/^[🍏🚚🌱⭐✨🎯🔥💎🌟]/)) {
              const emojiMatch = featureLine.match(/^([🍏🚚🌱⭐✨🎯🔥💎🌟])\s*(.+)$/)
              if (emojiMatch) {
                const featureText = emojiMatch[2]
                // Separar título y descripción por • o |
                const parts = featureText.split(/[•|]/)
                features.push({
                  icon: emojiMatch[1],
                  title: parts[0]?.trim() || 'Característica',
                  description: parts[1]?.trim() || 'Descripción de la característica'
                })
                console.log("✅ PARSER: Característica extraída:", features[features.length - 1])
              }
            } else if (featureLine && featureLine.match(/^[0-9]\./)) {
              // También aceptar formato 1. Título • Descripción
              const numberedMatch = featureLine.match(/^[0-9]\.\s*(.+)$/)
              if (numberedMatch) {
                const parts = numberedMatch[1].split(/[•|]/)
                features.push({
                  icon: '⭐',
                  title: parts[0]?.trim() || 'Característica',
                  description: parts[1]?.trim() || 'Descripción de la característica'
                })
                console.log("✅ PARSER: Característica numerada extraída:", features[features.length - 1])
              }
            } else if (!featureLine.match(/^[0-9⃣🔥💎🌟]/) && featureLine.length < 5) {
              break // Detenerse si encontramos una nueva sección
            }
            i++
          }
          data.features = features
        }
        
        // Extraer promoción (4⃣ Bloque Promocional)
        if (line.includes('4⃣') || line.toLowerCase().includes('promocional') || line.toLowerCase().includes('promoción')) {
          console.log("🎯 PARSER: Encontrada Promoción en línea:", line)
          // Buscar título de promoción en las siguientes 3 líneas
          for (let i = 1; i <= 3; i++) {
            const promoLine = lines[index + i]
            if (promoLine && promoLine.length > 5 && !promoLine.match(/^[0-9⃣🔥💎🌟]/)) {
              data.promoTitle = promoLine.trim()
              console.log("✅ PARSER: Promoción extraída:", data.promoTitle)
              break
            }
          }
        }
        
        // Extraer testimonios (5⃣ Testimonios con ⭐⭐⭐⭐⭐)
        if (line.includes('5⃣') || line.toLowerCase().includes('testimonios')) {
          console.log("🎯 PARSER: Encontrados Testimonios en línea:", line)
          const testimonials = []
          let i = index + 1
          
          while (i < lines.length && i < index + 15) { // Máximo 15 líneas después
            const testimonialLine = lines[i]
            
            // Buscar citas entre comillas
            if (testimonialLine && testimonialLine.includes('"')) {
              const textMatch = testimonialLine.match(/^"(.+)"$/)
              if (textMatch) {
                // Buscar autor en la siguiente línea
                const authorLine = lines[i + 1]
                if (authorLine && (authorLine.includes('—') || authorLine.includes('-'))) {
                  const authorMatch = authorLine.match(/[—-]\s*(.+)$/)
                  if (authorMatch) {
                    testimonials.push({
                      name: authorMatch[1].trim(),
                      role: 'Cliente',
                      text: textMatch[1],
                      rating: 5
                    })
                    console.log("✅ PARSER: Testimonio extraído:", testimonials[testimonials.length - 1])
                    i++ // Saltar la línea del autor
                  }
                }
              }
            }
            // Detenerse si encontramos una nueva sección
            else if (testimonialLine && testimonialLine.match(/^[0-9⃣🔥💎🌟]/)) {
              break
            }
            i++
          }
          data.testimonials = testimonials
        }
        
        // Extraer CTA final (6⃣ Bloque CTA Final)
        if (line.includes('6⃣') || line.toLowerCase().includes('cta final') || line.toLowerCase().includes('contacto final')) {
          console.log("🎯 PARSER: Encontrado CTA Final en línea:", line)
          // Buscar título de CTA en las siguientes 3 líneas
          for (let i = 1; i <= 3; i++) {
            const ctaLine = lines[index + i]
            if (ctaLine && ctaLine.length > 5 && !ctaLine.match(/^[0-9⃣🔥💎🌟]/)) {
              data.ctaTitle = ctaLine.trim()
              console.log("✅ PARSER: CTA extraído:", data.ctaTitle)
              break
            }
          }
        }
      })
      
      console.log("🎯 PARSER: Datos finales extraídos:", data)
      return data
    }
    
    const landingData = extractLandingData(businessInfo.landingContent || '')
    
    // Buscar imágenes dinámicas si es necesario
    if (landingData.imageKeyword && !landingData.heroImages) {
      console.log("🔍 BUSCANDO IMÁGENES DINÁMICAS PARA:", landingData.imageKeyword)
      landingData.heroImages = await searchDynamicImages(landingData.imageKeyword)
      console.log("✅ IMÁGENES DINÁMICAS LISTAS:", landingData.heroImages)
    }
    console.log("🔍 LANDING ASSISTANT: Datos extraídos dinámicamente:", landingData)
    
    console.log("🚀 LANDING ASSISTANT: Iniciando generación con datos dinámicos - VERSIÓN 3.2.0")
    
    // 🧠 BLOQUES INTELIGENTES 100% DINÁMICOS - VERSIÓN 3.2.0
    const blocks = [
      // 1⃣ Hero Slide - Usa título dinámico del chat con 3 imágenes
      {
        id: 'hero-slide-dynamic-1',
        type: 'hero-slide',
        content: {
          slides: [
            {
              id: 'slide-1',
              backgroundImage: (landingData.heroImages && landingData.heroImages[0]) || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop',
              title: landingData.heroTitle || 'Tu Negocio',
              subtitle: landingData.heroSubtitle || 'Líder en el sector',
              buttonText: 'Conocer Más',
              buttonType: 'external' as const,
              buttonTarget: '#features',
              textColor: 'light' as const,
              imageFilter: 'none' as const
            },
            {
              id: 'slide-2',
              backgroundImage: (landingData.heroImages && landingData.heroImages[1]) || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
              title: landingData.heroTitle || 'Soluciones Profesionales',
              subtitle: landingData.heroSubtitle || 'Calidad y confianza en cada proyecto',
              buttonText: 'Ver Servicios',
              buttonType: 'external' as const,
              buttonTarget: '#features',
              textColor: 'light' as const,
              imageFilter: 'none' as const
            },
            {
              id: 'slide-3',
              backgroundImage: (landingData.heroImages && landingData.heroImages[2]) || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop',
              title: landingData.heroTitle || 'Innovación y Tecnología',
              subtitle: landingData.heroSubtitle || 'Transformando ideas en realidad',
              buttonText: 'Contactar',
              buttonType: 'external' as const,
              buttonTarget: '#contact',
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
      // 2⃣ Bloque de Introducción - Usa texto dinámico del chat
      {
        id: 'introduction-dynamic-1',
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
      // 3⃣ Características Principales - Extrae características dinámicas con emojis del chat
      {
        id: 'features-dynamic-1',
        type: 'features',
        content: {
          title: 'Características Principales',
          subtitle: 'Lo que nos hace únicos',
          features: landingData.features && landingData.features.length > 0 ? landingData.features : [
            {
              icon: '⭐',
              title: 'Característica Principal',
              description: 'Descripción de la característica principal'
            },
            {
              icon: '🎯',
              title: 'Ventaja Competitiva', 
              description: 'Lo que nos diferencia de los demás'
            },
            {
              icon: '📍',
              title: 'Servicio Excepcional',
              description: 'Calidad garantizada en cada detalle'
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