'use client'

import { BlockType } from '@/types'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { NavigationBlock } from '@/components/blocks/NavigationBlock'
import { FeaturesBlock } from '@/components/blocks/FeaturesBlock'
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock'
import { CtaBlock } from '@/components/blocks/CtaBlock'
import { FooterBlock } from '@/components/blocks/FooterBlock'
import { ReinforcementBlock } from '@/components/blocks/ReinforcementBlock'
import { HeroSplitBlock } from '@/components/blocks/HeroSplitBlock'
import { PricingBlock } from '@/components/blocks/PricingBlock'
import { StatsBlock } from '@/components/blocks/StatsBlock'
import { TimelineBlock } from '@/components/blocks/TimelineBlock'
import { FaqBlock } from '@/components/blocks/FaqBlock'
import { ImageBlock } from '@/components/blocks/ImageBlock'
import { ProcessBlock } from '@/components/blocks/ProcessBlock'
import { ProductCartBlock } from '@/components/blocks/ProductCartBlock'
import { ProductFeaturesBlock } from '@/components/blocks/ProductFeaturesBlock'
import { WhatsAppContactBlock } from '@/components/blocks/WhatsAppContactBlock'
import { SocialMediaBlock } from '@/components/blocks/SocialMediaBlock'
import { HeroSlideBlock } from '@/components/blocks/HeroSlideBlock'
import { HeroYouTubeBlock } from '@/components/blocks/HeroYouTubeBlock'
import { HeroCountdownBlock } from '@/components/blocks/HeroCountdownBlock'
import { HeroBannerBlock } from '@/components/blocks/HeroBannerBlock'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

interface BlockRendererProps {
  block: BlockType
  onContentChange?: (blockId: string, newContent: any) => void
  blocks?: BlockType[] // Para pasar los bloques actuales al NavigationBlock
}

// Función para detectar imágenes en el contenido de un bloque
function detectImagesInContent(content: any): { hasImages: boolean; imageCount: number; imageUrls: string[] } {
  if (!content) return { hasImages: false, imageCount: 0, imageUrls: [] }
  
  const imageUrls: string[] = []
  
  // Función recursiva para buscar URLs de imagen
  function findImageUrls(obj: any): void {
    if (!obj || typeof obj !== 'object') return
    
    // Buscar propiedades comunes de imagen
    const imageProps = ['image', 'imageUrl', 'backgroundImage', 'src', 'url', 'photo', 'avatar', 'logo']
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Verificar si es una URL de imagen
        if (imageProps.some(prop => key.toLowerCase().includes(prop)) && 
            (value.includes('http') || value.includes('data:image') || value.includes('/'))) {
          imageUrls.push(value)
        }
        // También verificar si el string parece una URL de imagen
        else if (value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || 
                 value.includes('unsplash.com') || 
                 value.includes('pexels.com') ||
                 value.includes('images.unsplash.com')) {
          imageUrls.push(value)
        }
      } else if (Array.isArray(value)) {
        value.forEach(item => findImageUrls(item))
      } else if (typeof value === 'object') {
        findImageUrls(value)
      }
    }
  }
  
  findImageUrls(content)
  
  return {
    hasImages: imageUrls.length > 0,
    imageCount: imageUrls.length,
    imageUrls: [...new Set(imageUrls)] // Eliminar duplicados
  }
}

// Error boundary component for block rendering
function BlockErrorBoundary({ blockType, error, onRetry }: { 
  blockType: string; 
  error: Error; 
  onRetry?: () => void 
}) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Error en bloque "{blockType}"</h3>
            <p className="text-sm text-red-600 mt-1">
              {error.message || 'No se pudo cargar el bloque'}
            </p>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BlockRenderer({ block, onContentChange, blocks = [] }: BlockRendererProps) {
  const handleContentChange = (newContent: any) => {
    if (onContentChange) {
      onContentChange(block.id, newContent)
      
      // Loggear cambios de contenido
      const imageInfo = detectImagesInContent(newContent)
      logger.logBlockImageOperation(block.type, block.id, 'change', 
        imageInfo.imageUrls[0], true)
    }
  }

  // Validate block content
  if (!block || !block.type) {
    console.error('Invalid block structure:', block)
    logger.logBlock('unknown', 'validation_error', {
      blockId: block?.id,
      error: 'Bloque inválido: falta tipo o contenido',
      content: block
    })
    return (
      <BlockErrorBoundary 
        blockType="desconocido" 
        error={new Error('Bloque inválido: falta tipo o contenido')} 
      />
    )
  }

  // Add error handling for each block type
  const renderBlock = () => {
    const startTime = Date.now()
    let isActive = true // Asumimos que está activo si se está renderizando
    
    try {
      console.log(`🎯 BLOCK RENDERER: Renderizando bloque ${block.type} con contenido:`, block.content)
      
      // Detectar imágenes en el contenido antes de renderizar
      const imageInfo = detectImagesInContent(block.content)
      
      // Loggear inicio de renderizado
      logger.logBlockRender(block.type, block.id, isActive, imageInfo.hasImages, imageInfo.imageCount)
      
      let renderedBlock = null
      
      switch (block.type) {
        case 'navigation':
          renderedBlock = <NavigationBlock block={block} onContentChange={handleContentChange} blocks={blocks} />
          break
        case 'hero':
          renderedBlock = <HeroBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'features':
          renderedBlock = <FeaturesBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'testimonials':
          renderedBlock = <TestimonialsBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'cta':
          renderedBlock = <CtaBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'footer':
          renderedBlock = <FooterBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'reinforcement':
          renderedBlock = <ReinforcementBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'hero-split':
          renderedBlock = <HeroSplitBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'pricing':
          renderedBlock = <PricingBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'stats':
          renderedBlock = <StatsBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'timeline':
          renderedBlock = <TimelineBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'faq':
          renderedBlock = <FaqBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'image':
          renderedBlock = <ImageBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'process':
          renderedBlock = <ProcessBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'product-cart':
          renderedBlock = <ProductCartBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'product-features':
          renderedBlock = <ProductFeaturesBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'whatsapp-contact':
          renderedBlock = <WhatsAppContactBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'social-media':
          renderedBlock = <SocialMediaBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'hero-slide':
          renderedBlock = <HeroSlideBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'youtube':
          renderedBlock = <HeroYouTubeBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'countdown':
          renderedBlock = <HeroCountdownBlock content={block.content} onContentChange={handleContentChange} />
          break
        case 'hero-banner':
          renderedBlock = <HeroBannerBlock content={block.content} onContentChange={handleContentChange} />
          break
        default:
          console.warn('Unknown block type:', block.type)
          logger.logBlock(block.type, 'unknown_type', {
            blockId: block.id,
            isActive: false,
            error: `Tipo de bloque no reconocido: ${block.type}`
          })
          return (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Tipo de bloque no reconocido</h3>
                    <p className="text-sm text-yellow-600 mt-1">
                      El bloque "{block.type}" no está implementado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
      }
      
      // Loggear finalización exitosa del renderizado
      const duration = Date.now() - startTime
      logger.logBlock(block.type, 'render_success', {
        blockId: block.id,
        isActive,
        hasImages: imageInfo.hasImages,
        imageCount: imageInfo.imageCount,
        imageUrls: imageInfo.imageUrls,
        duration,
        content: block.content
      })
      
      return renderedBlock
      
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`Error rendering block ${block.type}:`, error)
      
      // Loggear error de renderizado
      logger.logBlock(block.type, 'render_error', {
        blockId: block.id,
        isActive: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        duration,
        content: block.content
      })
      
      throw error // Re-throw to be caught by the outer error boundary
    }
  }

  // Wrap the block rendering in an error boundary
  try {
    return renderBlock()
  } catch (error) {
    console.error(`Failed to render block ${block.type}:`, error)
    
    // Loggear error del boundary
    logger.logBlock(block.type, 'boundary_error', {
      blockId: block.id,
      isActive: false,
      error: error instanceof Error ? error.message : 'Error en boundary',
      content: block.content
    })
    
    return (
      <BlockErrorBoundary 
        blockType={block.type} 
        error={error as Error}
        onRetry={() => {
          // Loggear reintento
          logger.logBlock(block.type, 'retry_attempt', {
            blockId: block.id,
            isActive: true,
            metadata: { action: 'user_retry' }
          })
          
          // Force a re-render by updating the content
          if (onContentChange && block.content) {
            onContentChange(block.id, { ...block.content })
          }
        }}
      />
    )
  }
}