import { NextResponse } from 'next/server'
import { extractBusinessInfo } from '@/lib/extractBusinessInfo'

// Generador de bloques con contenido dinámico e integración de imágenes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const info = extractBusinessInfo(body.text || '')

    // Generadores de contenido por tipo de bloque
    const BLOCK_MAPPINGS: Record<string, any> = {
      // 🔹 HERO SLIDE (ya funcional)
      'hero-slide': {
        contentGenerator: async (info: any) => {
          let images: string[] = []
          try {
            const imageResponse = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.businessType || info.name || 'empresa',
                industry: info.industry || 'general',
                count: 3
              })
            })
            const imageData = await imageResponse.json()
            if (imageData.success && imageData.images?.length) {
              images = imageData.images.map((img: any) => img.url)
            }
          } catch (error) {
            images = [
              `https://source.unsplash.com/1920x1080/?${info.businessType || 'business'}`,
              `https://source.unsplash.com/1920x1080/?${info.industry || 'technology'}`,
              `https://source.unsplash.com/1920x1080/?${info.name || 'empresa'}`
            ]
          }

          return {
            title: info.name || 'Tu empresa destacada',
            subtitle: info.description || 'Mostrá lo mejor de tu negocio con estilo.',
            images
          }
        }
      },

      // 🔹 HERO BLOCK
      'hero': {
        contentGenerator: async (info: any) => {
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
            title: info.name || 'Tu negocio en línea',
            subtitle: info.description || 'Impulsá tu marca al siguiente nivel.',
            backgroundImage
          }
        }
      },

      // 🔹 HERO BANNER BLOCK
      'hero-banner': {
        contentGenerator: async (info: any) => {
          let backgroundImage = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.industry || info.businessType || 'empresa',
                count: 1
              })
            })
            const data = await res.json()
            backgroundImage = data.success && data.images?.length
              ? data.images[0].url
              : `https://source.unsplash.com/1920x1080/?${info.industry || 'empresa'}`
          } catch {
            backgroundImage = `https://source.unsplash.com/1920x1080/?${info.industry || 'empresa'}`
          }

          return {
            title: info.bannerTitle || 'Mostrá tu negocio al mundo',
            description: info.bannerDesc || 'Diseños modernos y visuales potentes.',
            backgroundImage
          }
        }
      },

      // 🔹 HERO SPLIT BLOCK
      'hero-split': {
        contentGenerator: async (info: any) => {
          let image = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.businessType || info.name || 'empresa',
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              image = data.images[0].url
            }
          } catch {
            image = `https://source.unsplash.com/600x600/?${info.businessType || 'empresa'}`
          }

          return {
            title: info.heroTitle || 'Creamos experiencias únicas',
            description: info.heroDesc || 'Soluciones digitales para tu marca.',
            image
          }
        }
      },

      // 🔹 HERO COUNTDOWN BLOCK
      'hero-countdown': {
        contentGenerator: async (info: any) => {
          let backgroundImage = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.eventName || info.name || 'empresa',
                count: 1
              })
            })
            const data = await res.json()
            backgroundImage = data.success && data.images?.length
              ? data.images[0].url
              : `https://source.unsplash.com/1920x1080/?event,${info.name || 'business'}`
          } catch {
            backgroundImage = `https://source.unsplash.com/1920x1080/?event,${info.name || 'business'}`
          }

          return {
            title: info.eventTitle || '¡Gran lanzamiento en camino!',
            date: info.eventDate || '2025-12-31',
            backgroundImage
          }
        }
      },

      // 🔹 CTA BLOCK
      'cta': {
        contentGenerator: async (info: any) => {
          let backgroundImage = ''
          try {
            const imageResponse = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.businessType || info.name || 'empresa',
                industry: info.industry || 'general',
                count: 1
              })
            })
            const data = await imageResponse.json()
            if (data.success && data.images?.length > 0) {
              backgroundImage = data.images[0].url
            }
          } catch {
            backgroundImage = `https://source.unsplash.com/1920x1080/?${info.businessType || 'empresa'}`
          }

          return {
            title: info.ctaTitle || '¿Listo para comenzar?',
            description: info.ctaDescription || 'Potenciá tu presencia online.',
            buttonText: info.ctaButtonText || 'Empezar ahora',
            buttonLink: info.ctaButtonLink || '#contacto',
            backgroundImage
          }
        }
      },

      // 🔹 IMAGE BLOCK
      'image': {
        contentGenerator: async (info: any) => {
          let image = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.businessType || info.name || 'empresa',
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              image = data.images[0].url
            }
          } catch {
            image = `https://source.unsplash.com/800x600/?${info.businessType || 'empresa'}`
          }

          return {
            image,
            caption: info.imageCaption || 'Inspiración visual para tu negocio.'
          }
        }
      },

      // 🔹 FOOTER BLOCK
      'footer': {
        contentGenerator: async (info: any) => {
          let logo = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `${info.name} logo` || 'logo empresa',
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              logo = data.images[0].url
            }
          } catch {
            logo = `https://source.unsplash.com/400x200/?logo,business`
          }

          return {
            companyName: info.name || 'Tu Empresa',
            year: new Date().getFullYear(),
            logo
          }
        }
      },

      // 🔹 PRODUCT CART BLOCK
      'product-cart': {
        contentGenerator: async (info: any) => {
          let image = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `${info.businessType || 'producto'} ${info.industry || ''}`,
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              image = data.images[0].url
            }
          } catch {
            image = `https://source.unsplash.com/800x800/?product,${info.businessType || 'item'}`
          }

          return {
            title: info.productTitle || 'Producto destacado',
            description: info.productDesc || 'Calidad y diseño para vos.',
            price: info.productPrice || '$99.00',
            image
          }
        }
      },

      // 🔹 PRODUCT FEATURES BLOCK
      'product-features': {
        contentGenerator: async (info: any) => {
          let centerImage = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: info.businessType || info.name || 'producto',
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              centerImage = data.images[0].url
            }
          } catch {
            centerImage = `https://source.unsplash.com/800x600/?${info.businessType || 'producto'}`
          }

          return {
            title: info.featuresTitle || 'Características del producto',
            features: info.featuresList || ['Alta calidad', 'Diseño moderno', 'Durabilidad'],
            centerImage
          }
        }
      },

      // 🔹 WHATSAPP CONTACT BLOCK
      'whatsapp-contact': {
        contentGenerator: async (info: any) => {
          let leftImage = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `${info.businessType || 'empresa'} contacto cliente`,
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              leftImage = data.images[0].url
            }
          } catch {
            leftImage = `https://source.unsplash.com/600x600/?customer,communication`
          }

          return {
            title: info.contactTitle || 'Contactanos por WhatsApp',
            phone: info.phone || '+54 11 5555-5555',
            message: info.contactMsg || 'Estamos para ayudarte.',
            leftImage
          }
        }
      },

      // 🔹 TESTIMONIALS BLOCK
      'testimonials': {
        contentGenerator: async (info: any) => {
          let avatar = ''
          try {
            const res = await fetch('http://localhost:3000/api/images/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `${info.industry || 'business'} client portrait`,
                count: 1
              })
            })
            const data = await res.json()
            if (data.success && data.images?.length > 0) {
              avatar = data.images[0].url
            }
          } catch {
            avatar = `https://source.unsplash.com/400x400/?person,client`
          }

          return {
            testimonials: [
              {
                name: info.testimonialName || 'Cliente satisfecho',
                text: info.testimonialText || 'Excelente atención y resultados.',
                avatar
              }
            ]
          }
        }
      }
    }

    // Ejecutar todos los contentGenerators para obtener el contenido
    const generatedBlocks: Record<string, any> = {}
    
    for (const [blockType, blockConfig] of Object.entries(BLOCK_MAPPINGS)) {
      try {
        if (blockConfig.contentGenerator && typeof blockConfig.contentGenerator === 'function') {
          generatedBlocks[blockType] = await blockConfig.contentGenerator(info)
        }
      } catch (error) {
        console.error(`Error generating content for block ${blockType}:`, error)
        generatedBlocks[blockType] = {}
      }
    }

    // Retornar todos los bloques generados
    return NextResponse.json({ success: true, blocks: generatedBlocks })
  } catch (error) {
    console.error('Error generating landing content:', error)
    return NextResponse.json({ success: false, error: 'Error generando contenido dinámico' }, { status: 500 })
  }
}