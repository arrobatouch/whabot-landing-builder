'use client'

import { HeroBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { ArrowRight } from 'lucide-react'

interface HeroBlockProps {
  content: HeroBlockContent
  onContentChange?: (newContent: HeroBlockContent) => void
}

export function HeroBlock({ content, onContentChange }: HeroBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({ ...content, ...newContent })
    }
  }

  const styles = content.styles || {}

  // ✅ Imagen de fondo dinámica (misma lógica que FeaturesBlock)
  const backgroundImage =
    (content.backgroundImage && content.backgroundImage.trim() !== ''
      ? content.backgroundImage
      : content.image && content.image.trim() !== ''
      ? content.image
      : content.centerImage && content.centerImage.trim() !== ''
      ? content.centerImage
      : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop')

  const hasBackgroundImage = backgroundImage && backgroundImage !== 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop'

  const sectionClasses = [
    'relative',
    'min-h-[600px]',
    'flex',
    'items-center',
    'justify-center',
    'overflow-hidden',
    'group',
    styles.backgroundColor || 'bg-background',
    styles.paddingY || 'py-20',
    styles.paddingX || 'px-6',
    styles.margin || 'mb-0',
    styles.border || 'none',
    styles.borderColor || 'border-border',
    styles.shadow || 'none',
    styles.borderRadius || 'rounded-none',
    styles.opacity || 'opacity-100',
    styles.hoverTransform || 'none'
  ].filter(Boolean).join(' ')

  const contentClasses = [
    'relative',
    'z-10',
    'text-center',
    'text-white',
    'max-w-4xl',
    'mx-auto',
    styles.paddingX || 'px-6',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')

  return (
    <section 
      className={sectionClasses}
      style={{
        backgroundImage: hasBackgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay oscuro si hay fondo */}
      {hasBackgroundImage ? (
        <div className="absolute inset-0 bg-black/50 z-0" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 z-0">
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      
      <div className={contentClasses}>
        {content.subtitle && (
          <p className="text-lg md:text-xl mb-4 text-blue-200 font-medium">
            {content.subtitle}
          </p>
        )}
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {content.title || 'Título Principal'}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          {content.description || 'Descripción principal del hero'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {content.primaryButtonText && (
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              asChild
            >
              <a href={content.primaryButtonLink || '#'}>
                {content.primaryButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
          
          {content.secondaryButtonText && (
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
              asChild
            >
              <a href={content.secondaryButtonLink || '#'}>
                {content.secondaryButtonText}
              </a>
            </Button>
          )}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <AIImprovementButton
            blockType="hero"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
      
      {/* Indicador de depuración para imagen de fondo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
          {hasBackgroundImage ? '🖼️ Imagen: ' + backgroundImage.substring(0, 50) + '...' : '🎨 Gradiente por defecto'}
        </div>
      )}
    </section>
  )
}