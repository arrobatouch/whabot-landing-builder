'use client'

import { CtaBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface CtaBlockProps {
  content: CtaBlockContent
  onContentChange?: (newContent: CtaBlockContent) => void
}

export function CtaBlock({ content, onContentChange }: CtaBlockProps) {
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
    'overflow-hidden',
    'group',
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
  
  const containerClasses = [
    'relative',
    'z-10',
    'max-w-4xl',
    'mx-auto',
    'text-center',
    'text-white',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      {hasBackgroundImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700">
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      <div className={containerClasses}>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {content.title}
        </h2>
        
        <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          {content.description}
        </p>
        
        {content.buttonText && (
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            asChild
          >
            <a href={content.buttonLink}>
              {content.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        )}
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="cta"
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