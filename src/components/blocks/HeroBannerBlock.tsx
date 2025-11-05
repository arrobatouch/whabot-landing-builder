'use client'

import { HeroBannerBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeroBannerBlockProps {
  content: HeroBannerBlockContent
  onContentChange?: (newContent: HeroBannerBlockContent) => void
}

export function HeroBannerBlock({ content, onContentChange }: HeroBannerBlockProps) {
  const [isMounted, setIsMounted] = useState(false)
  const hasBackgroundImage = content.backgroundImage && content.backgroundImage.trim() !== ''
  const styles = content.styles || {}
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const getAnimationClass = () => {
    if (!isMounted) return ''
    switch (content.animation) {
      case 'fade':
        return 'animate-fade-in'
      case 'slide':
        return 'animate-slide-in'
      case 'zoom':
        return 'animate-zoom-in'
      default:
        return ''
    }
  }
  
  const getTextColorClass = () => {
    switch (content.textColor) {
      case 'light':
        return 'text-white'
      case 'dark':
        return 'text-gray-900'
      case 'custom':
        return ''
      default:
        return 'text-white'
    }
  }
  
  const getAlignmentClass = () => {
    switch (content.alignment) {
      case 'left':
        return 'items-start text-left'
      case 'center':
        return 'items-center text-center'
      case 'right':
        return 'items-end text-right'
      default:
        return 'items-center text-center'
    }
  }
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'min-h-[500px]',
    'flex',
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
    'max-w-4xl',
    'mx-auto',
    'w-full',
    getAlignmentClass(),
    getAnimationClass(),
    styles.paddingX || 'px-6',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  const titleClasses = [
    'text-4xl md:text-6xl font-bold mb-4 leading-tight',
    getTextColorClass(),
    content.textColor === 'custom' ? `style={{ color: ${content.customTextColor} }}` : ''
  ].filter(Boolean).join(' ')
  
  const subtitleClasses = [
    'text-xl md:text-2xl mb-6 leading-relaxed',
    content.textColor === 'light' ? 'text-gray-200' : 
    content.textColor === 'dark' ? 'text-gray-700' : 
    content.textColor === 'custom' ? 'style={{ color: ${content.customTextColor} }}' : 'text-gray-200'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      {hasBackgroundImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        >
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: content.overlayOpacity / 100 }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: content.overlayOpacity / 100 }}
          />
        </div>
      )}
      
      <div className={contentClasses}>
        {content.subtitle && (
          <p className="text-lg md:text-xl mb-4 font-medium">
            {content.subtitle}
          </p>
        )}
        
        <h1 className={titleClasses}>
          {content.title}
        </h1>
        
        {content.button.text && (
          <Button 
            size="lg"
            className="mt-8 px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            style={{ 
              backgroundColor: content.button.color,
              color: 'white'
            }}
            onMouseEnter={(e) => {
              if (content.button.hoverColor) {
                e.currentTarget.style.backgroundColor = content.button.hoverColor
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = content.button.color
            }}
            asChild
          >
            <a href={content.button.link}>
              {content.button.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        )}
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="hero-banner"
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
      
      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoom-in {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }
        
        .animate-zoom-in {
          animation: zoom-in 0.8s ease-out;
        }
      `}</style>
    </section>
  )
}