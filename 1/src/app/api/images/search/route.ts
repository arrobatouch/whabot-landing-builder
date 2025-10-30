import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface SearchResult {
  url: string
  name: string
  snippet: string
  host_name: string
  rank: number
  date: string
  favicon: string
}

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string
  description: string
  width: number
  height: number
  user: {
    name: string
    username: string
  }
}

interface ImageSearchResult {
  id: string
  url: string
  title: string
  description: string
  source: string
  thumbnail?: string
  width?: number
  height?: number
  category?: string
}

// Clave de API de Unsplash
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'cQb1J-MQRhmTr7JZLF2eGOrgySC0YcrOent9ea5p_7g'

// Mapeo de industrias a términos de búsqueda para Unsplash
const INDUSTRY_SEARCH_TERMS: Record<string, string[]> = {
  'restaurant': ['restaurant', 'fine dining', 'food photography', 'culinary'],
  'zapatería': ['shoes', 'footwear', 'fashion', 'boutique'],
  'nutrición': ['healthy food', 'nutrition', 'wellness', 'fresh ingredients'],
  'skincare': ['skincare', 'beauty', 'cosmetics', 'spa'],
  'fotografía': ['photography', 'camera', 'photo studio', 'professional'],
  'consultoría': ['business', 'consulting', 'office', 'corporate'],
  'tecnología': ['technology', 'innovation', 'digital', 'startup'],
  'moda': ['fashion', 'clothing', 'style', 'boutique'],
  'fitness': ['fitness', 'gym', 'workout', 'healthy lifestyle'],
  'educación': ['education', 'learning', 'classroom', 'study'],
  'viajes': ['travel', 'tourism', 'adventure', 'destinations'],
  'belleza': ['beauty', 'salon', 'makeup', 'hair styling'],
  'salud': ['healthcare', 'medical', 'wellness', 'health'],
  'deportes': ['sports', 'athletic', 'fitness', 'stadium'],
  'arte': ['art', 'gallery', 'creative', 'studio'],
  'música': ['music', 'studio', 'instruments', 'performance'],
  'libros': ['books', 'library', 'reading', 'study'],
  'juguetes': ['toys', 'children', 'play', 'educational'],
  'mascotas': ['pets', 'animals', 'pet care', 'veterinary'],
  'jardinería': ['garden', 'plants', 'landscaping', 'flowers'],
  'cocina': ['kitchen', 'cooking', 'culinary', 'food'],
  'construcción': ['construction', 'building', 'architecture', 'engineering'],
  'legal': ['law', 'office', 'legal', 'business'],
  'finanzas': ['finance', 'banking', 'investment', 'business'],
  'marketing': ['marketing', 'digital', 'social media', 'advertising'],
  'diseño': ['design', 'graphic', 'creative', 'studio'],
  'eventos': ['events', 'party', 'celebration', 'wedding'],
  'automotriz': ['cars', 'automotive', 'vehicles', 'dealership'],
  'inmobiliaria': ['real estate', 'property', 'home', 'architecture'],
  'gastronomía': ['gourmet', 'food', 'chef', 'restaurant'],
  'barbería': ['barber', 'barbershop', 'haircut', 'grooming'],
  'general': ['business', 'professional', 'office', 'workspace']
}

// Función para buscar imágenes usando Unsplash API
async function searchUnsplashImages(query: string, count: number = 6): Promise<ImageSearchResult[]> {
  try {
    const searchQuery = query.toLowerCase()
    
    // Determinar el término de búsqueda basado en la industria
    let searchTerm = searchQuery
    for (const [industry, terms] of Object.entries(INDUSTRY_SEARCH_TERMS)) {
      if (searchQuery.includes(industry) || terms.some(term => searchQuery.includes(term))) {
        searchTerm = terms[0] // Usar el primer término relevante
        break
      }
    }
    
    console.log('Searching Unsplash with term:', searchTerm)
    
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=${count}`, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const photos: UnsplashPhoto[] = data.results || []

    const imageResults: ImageSearchResult[] = photos.map((photo, index) => ({
      id: `unsplash-${photo.id}-${index}`,
      url: addCacheBust(photo.urls.regular),
      title: photo.alt_description || `${searchTerm} professional image ${index + 1}`,
      description: photo.description || `High quality ${searchTerm} image from Unsplash`,
      source: 'Unsplash',
      thumbnail: addCacheBust(photo.urls.small),
      width: photo.width,
      height: photo.height,
      category: searchTerm
    }))

    return imageResults

  } catch (error) {
    console.error('Error searching Unsplash images:', error)
    return [] // Retornar vacío para usar fallback
  }
}

// Función para buscar imágenes usando web search (fallback)
async function searchImages(query: string, industry?: string): Promise<ImageSearchResult[]> {
  try {
    const zai = await ZAI.create()
    
    // Obtener términos de búsqueda específicos para la industria
    const searchTerms = industry && INDUSTRY_SEARCH_TERMS[industry.toLowerCase()] 
      ? INDUSTRY_SEARCH_TERMS[industry.toLowerCase()] 
      : INDUSTRY_SEARCH_TERMS['general']
    
    // Combinar la consulta con los términos de la industria
    const enhancedQuery = `${query} ${searchTerms[0]} pinterest images`
    
    console.log('Searching images with query:', enhancedQuery)
    
    const searchResult = await zai.functions.invoke("web_search", {
      query: enhancedQuery,
      num: 10
    })

    const results = searchResult as SearchResult[]
    
    // Transformar resultados a formato de imagen
    const imageResults: ImageSearchResult[] = results
      .filter(result => 
        result.url.includes('pinterest') || 
        result.url.includes('pin') ||
        result.snippet.toLowerCase().includes('image') ||
        result.snippet.toLowerCase().includes('photo')
      )
      .map((result, index) => ({
        id: `image-${index}-${Date.now()}`,
        url: extractImageUrl(result.url),
        title: extractTitle(result.name, result.snippet),
        description: result.snippet,
        source: result.host_name,
        thumbnail: generateThumbnailUrl(result.url),
        category: industry || 'general'
      }))
      .filter(result => result.url) // Filtrar resultados sin URL válida

    // Si no hay suficientes resultados, buscar con términos alternativos
    if (imageResults.length < 5) {
      for (let i = 1; i < searchTerms.length && imageResults.length < 8; i++) {
        const alternativeQuery = `${query} ${searchTerms[i]} images`
        const altResults = await zai.functions.invoke("web_search", {
          query: alternativeQuery,
          num: 5
        })
        
        const altImageResults = (altResults as SearchResult[])
          .map((result, altIndex) => ({
            id: `image-alt-${altIndex}-${Date.now()}`,
            url: extractImageUrl(result.url),
            title: extractTitle(result.name, result.snippet),
            description: result.snippet,
            source: result.host_name,
            thumbnail: generateThumbnailUrl(result.url),
            category: industry || 'general'
          }))
          .filter(result => result.url)
        
        imageResults.push(...altImageResults)
      }
    }

    // Generar imágenes de respaldo si no hay suficientes resultados
    while (imageResults.length < 6) {
      const fallbackImage = generateFallbackImage(query, industry, imageResults.length)
      imageResults.push(fallbackImage)
    }

    return imageResults.slice(0, 8) // Limitar a 8 resultados

  } catch (error) {
    console.error('Error searching images:', error)
    
    // Generar imágenes de respaldo en caso de error
    const fallbackImages: ImageSearchResult[] = []
    for (let i = 0; i < 6; i++) {
      fallbackImages.push(generateFallbackImage(query, industry, i))
    }
    
    return fallbackImages
  }
}

// Función para agregar parámetro anti-caché a las URLs
function addCacheBust(url: string): string {
  const cacheBust = `?v=${Date.now()}_${Math.floor(Math.random() * 1000000)}`
  return url.includes('?') ? `${url}&${cacheBust.substring(1)}` : `${url}${cacheBust}`
}

// Función para extraer URL de imagen de una URL de Pinterest o web
function extractImageUrl(url: string): string {
  if (url.includes('pinterest.com/pin/')) {
    // Para pins de Pinterest, generar una URL de imagen simulada
    const pinId = url.split('/pin/')[1]?.split('/')[0]
    return addCacheBust(`https://images.unsplash.com/photo-${Date.now()}-${pinId || '123'}?w=800&h=600&fit=crop`)
  }
  
  if (url.includes('unsplash') || url.includes('pexels') || url.includes('gettyimages')) {
    return addCacheBust(url)
  }
  
  // Para otras URLs, generar una URL de imagen genérica
  return addCacheBust(`https://images.unsplash.com/photo-${Date.now()}-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop`)
}

// Función para extraer título del resultado
function extractTitle(name: string, snippet: string): string {
  if (name && name.length > 0) return name
  if (snippet && snippet.length > 0) return snippet.split(' ').slice(0, 8).join(' ')
  return 'Professional Image'
}

// Función para generar URL de thumbnail
function generateThumbnailUrl(url: string): string {
  if (url.includes('unsplash.com')) {
    return addCacheBust(url.replace('/photo-', '/photo-').replace('?w=', '?w=200&h=200&'))
  }
  return addCacheBust(`https://images.unsplash.com/photo-${Date.now()}-${Math.floor(Math.random() * 1000)}?w=200&h=200&fit=crop`)
}

// Función para generar imágenes de respaldo
function generateFallbackImage(query: string, industry?: string, index: number): ImageSearchResult {
  const fallbackSeeds = [
    'business-professional',
    'modern-workspace', 
    'team-meeting',
    'success-growth',
    'innovation-technology',
    'quality-service'
  ]
  
  const seed = fallbackSeeds[index % fallbackSeeds.length]
  
  return {
    id: `fallback-${index}-${Date.now()}`,
    url: addCacheBust(`https://images.unsplash.com/photo-${Date.now()}-${index + 100}?w=800&h=600&fit=crop`),
    title: `${query} - Professional Image ${index + 1}`,
    description: `High quality image for ${industry || 'business'} related to ${query}`,
    source: 'Unsplash',
    thumbnail: addCacheBust(`https://images.unsplash.com/photo-${Date.now()}-${index + 100}?w=200&h=200&fit=crop`),
    category: industry || 'general'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, industry, count = 6 } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query inválida' },
        { status: 400 }
      )
    }

    console.log('Searching images for:', { query, industry, count })

    // Primero intentar con Unsplash API
    let images = await searchUnsplashImages(query, count)
    
    // Si Unsplash no devuelve suficientes imágenes, usar el sistema anterior como fallback
    if (images.length < count) {
      console.log('Unsplash returned insufficient images, using fallback search')
      const fallbackImages = await searchImages(query, industry)
      images = [...images, ...fallbackImages.slice(0, count - images.length)]
    }

    // Limitar resultados según el count solicitado
    const limitedImages = images.slice(0, Math.min(count, images.length))

    return NextResponse.json({
      success: true,
      images: limitedImages,
      total: limitedImages.length,
      query,
      industry: industry || 'general',
      source: images.length > 0 && images[0].source === 'Unsplash' ? 'Unsplash API' : 'Fallback Search'
    })

  } catch (error) {
    console.error('Error in image search:', error)
    return NextResponse.json(
      { success: false, error: 'Error al buscar imágenes' },
      { status: 500 }
    )
  }
}

// Endpoint GET para búsquedas simples
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const industry = searchParams.get('industry')
    const count = parseInt(searchParams.get('count') || '6')

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    console.log('GET search images for:', { query, industry, count })

    // Primero intentar con Unsplash API
    let images = await searchUnsplashImages(query, count)
    
    // Si Unsplash no devuelve suficientes imágenes, usar el sistema anterior como fallback
    if (images.length < count) {
      console.log('Unsplash returned insufficient images, using fallback search')
      const fallbackImages = await searchImages(query, industry || undefined)
      images = [...images, ...fallbackImages.slice(0, count - images.length)]
    }

    // Limitar resultados
    const limitedImages = images.slice(0, Math.min(count, images.length))

    return NextResponse.json({
      success: true,
      images: limitedImages,
      total: limitedImages.length,
      query,
      industry: industry || 'general',
      source: images.length > 0 && images[0].source === 'Unsplash' ? 'Unsplash API' : 'Fallback Search'
    })

  } catch (error) {
    console.error('Error in GET image search:', error)
    return NextResponse.json(
      { success: false, error: 'Error al buscar imágenes' },
      { status: 500 }
    )
  }
}