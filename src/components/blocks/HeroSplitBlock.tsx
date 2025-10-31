'use client'

import { HeroSplitBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface HeroSplitBlockProps {
  content: HeroSplitBlockContent
  onContentChange?: (newContent: HeroSplitBlockContent) => void
}

export function HeroSplitBlock({ content, onContentChange }: HeroSplitBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const styles = content.styles || {}
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
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
  
  const containerClasses = [
    'max-w-6xl',
    'mx-auto',
    styles.textAlign || 'text-left'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {content.subtitle && (
              <p className="text-lg text-blue-600 font-medium">
                {content.subtitle}
              </p>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {content.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {content.primaryButtonText && (
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
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
                  className="px-8 py-3"
                  asChild
                >
                  <a href={content.secondaryButtonLink}>
                    {content.secondaryButtonText}
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <img
              src={content.image}
              alt={content.title}
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="hero-split"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}