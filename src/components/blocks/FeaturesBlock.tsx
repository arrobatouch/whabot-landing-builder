'use client'

import { FeaturesBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { Plus } from 'lucide-react'

interface FeaturesBlockProps {
  content: FeaturesBlockContent
  onContentChange?: (newContent: FeaturesBlockContent) => void
}

export function FeaturesBlock({ content, onContentChange }: FeaturesBlockProps) {
  console.log("🎯 FEATURES BLOCK: Recibiendo contenido:", content)
  console.log("📋 FEATURES BLOCK: Título:", content.title)
  console.log("📝 FEATURES BLOCK: Features:", content.features)
  console.log("🔍 FEATURES BLOCK: Features detallados:", content.features?.map((f, i) => `${i}: ${f.title} - ${f.description}`))
  
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const handleAddFeature = () => {
    if (onContentChange) {
      const newFeature = {
        icon: '✨',
        title: 'Nueva Característica',
        description: 'Añade una descripción para esta nueva característica'
      }
      
      onContentChange({
        ...content,
        features: [...(content.features || []), newFeature]
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
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              {content.subtitle}
            </p>
          )}
          {onContentChange && (
            <Button 
              onClick={handleAddFeature}
              variant="outline"
              className="mx-auto flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Característica
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {(content.features || []).map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="text-4xl mb-4">{feature.icon || '⭐'}</div>
                <h3 className="text-xl font-semibold">{feature.title || 'Característica'}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description || 'Descripción de la característica'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="features"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}