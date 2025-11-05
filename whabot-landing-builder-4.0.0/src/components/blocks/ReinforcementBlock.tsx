'use client'

import { ReinforcementBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface ReinforcementBlockProps {
  content: ReinforcementBlockContent
  onContentChange?: (newContent: ReinforcementBlockContent) => void
}

export function ReinforcementBlock({ content, onContentChange }: ReinforcementBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  // Add defensive programming for missing content
  const safeContent = {
    title: content?.title || '¿Por qué Elegirnos?',
    description: content?.description || 'Descubre por qué somos la mejor opción para ti.',
    features: content?.features || [
      {
        title: 'Calidad Superior',
        description: 'Productos y servicios de la más alta calidad'
      },
      {
        title: 'Servicio Excepcional',
        description: 'Atención personalizada y soporte dedicado'
      }
    ]
  }
  
  const styles = content?.styles || {}
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'group',
    styles.backgroundColor || 'bg-muted/20',
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
    'max-w-4xl',
    'mx-auto',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {safeContent.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {safeContent.description}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {safeContent.features.map((feature, index) => (
            <Card key={index} className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
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
            blockType="reinforcement"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}