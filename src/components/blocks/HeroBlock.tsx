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
  const hasBackgroundImage = content.backgroundImage && content.backgroundImage.trim() !== ''
  const styles = content.styles || {}
  
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'min-h-[600px]',
    'flex',
    'items-center',
    'justify-center',
    'overflow-hidden',
    'group',
    styles.backgroundColor || 'transparent',
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
    <section className={sectionClasses}>
      {hasBackgroundImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
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
          {content.title}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {content.primaryButtonText && (
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              asChild
            >
              <a href={content.primaryButtonLink}>
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
              <a href={content.secondaryButtonLink}>
                {content.secondaryButtonText}
              </a>
            </Button>
          )}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {hasBackgroundImage ? '🖼️ Imagen: ' + content.backgroundImage.substring(0, 50) + '...' : '🎨 Gradiente por defecto'}
        </div>
      )}
    </section>
  )
}