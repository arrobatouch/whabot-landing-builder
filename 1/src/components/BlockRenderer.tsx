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

interface BlockRendererProps {
  block: BlockType
  onContentChange?: (blockId: string, newContent: any) => void
  blocks?: BlockType[] // Para pasar los bloques actuales al NavigationBlock
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
    }
  }

  // Validate block content
  if (!block || !block.type) {
    console.error('Invalid block structure:', block)
    return (
      <BlockErrorBoundary 
        blockType="desconocido" 
        error={new Error('Bloque inválido: falta tipo o contenido')} 
      />
    )
  }

  // Add error handling for each block type
  const renderBlock = () => {
    try {
      switch (block.type) {
        case 'navigation':
          return <NavigationBlock block={block} onContentChange={handleContentChange} blocks={blocks} />
        case 'hero':
          return <HeroBlock content={block.content} onContentChange={handleContentChange} />
        case 'features':
          return <FeaturesBlock content={block.content} onContentChange={handleContentChange} />
        case 'testimonials':
          return <TestimonialsBlock content={block.content} onContentChange={handleContentChange} />
        case 'cta':
          return <CtaBlock content={block.content} onContentChange={handleContentChange} />
        case 'footer':
          return <FooterBlock content={block.content} onContentChange={handleContentChange} />
        case 'reinforcement':
          return <ReinforcementBlock content={block.content} onContentChange={handleContentChange} />
        case 'hero-split':
          return <HeroSplitBlock content={block.content} onContentChange={handleContentChange} />
        case 'pricing':
          return <PricingBlock content={block.content} onContentChange={handleContentChange} />
        case 'stats':
          return <StatsBlock content={block.content} onContentChange={handleContentChange} />
        case 'timeline':
          return <TimelineBlock content={block.content} onContentChange={handleContentChange} />
        case 'faq':
          return <FaqBlock content={block.content} onContentChange={handleContentChange} />
        case 'image':
          return <ImageBlock content={block.content} onContentChange={handleContentChange} />
        case 'process':
          return <ProcessBlock content={block.content} onContentChange={handleContentChange} />
        case 'product-cart':
          return <ProductCartBlock content={block.content} onContentChange={handleContentChange} />
        case 'product-features':
          return <ProductFeaturesBlock content={block.content} onContentChange={handleContentChange} />
        case 'whatsapp-contact':
          return <WhatsAppContactBlock content={block.content} onContentChange={handleContentChange} />
        case 'social-media':
          return <SocialMediaBlock content={block.content} onContentChange={handleContentChange} />
        case 'hero-slide':
          return <HeroSlideBlock content={block.content} onContentChange={handleContentChange} />
        case 'youtube':
          return <HeroYouTubeBlock content={block.content} onContentChange={handleContentChange} />
        case 'countdown':
          return <HeroCountdownBlock content={block.content} onContentChange={handleContentChange} />
        case 'hero-banner':
          return <HeroBannerBlock content={block.content} onContentChange={handleContentChange} />
        default:
          console.warn('Unknown block type:', block.type)
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
    } catch (error) {
      console.error(`Error rendering block ${block.type}:`, error)
      throw error // Re-throw to be caught by the outer error boundary
    }
  }

  // Wrap the block rendering in an error boundary
  try {
    return renderBlock()
  } catch (error) {
    console.error(`Failed to render block ${block.type}:`, error)
    return (
      <BlockErrorBoundary 
        blockType={block.type} 
        error={error as Error}
        onRetry={() => {
          // Force a re-render by updating the content
          if (onContentChange && block.content) {
            onContentChange(block.id, { ...block.content })
          }
        }}
      />
    )
  }
}