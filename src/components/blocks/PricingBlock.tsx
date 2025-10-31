'use client'

import { PricingBlockContent } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface PricingBlockProps {
  content: PricingBlockContent
  onContentChange?: (newContent: PricingBlockContent) => void
}

export function PricingBlock({ content, onContentChange }: PricingBlockProps) {
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
    'py-20',
    'px-6',
    'bg-muted/20',
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
  
  const headerClasses = [
    'text-center',
    'mb-16',
    styles.paddingX || 'px-6',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      <div className="max-w-6xl mx-auto">
        <div className={headerClasses}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {(content.plans || []).map((plan, index) => (
            <Card key={index} className={`relative ${plan.featured ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {(plan.features || []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.featured ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.featured ? 'default' : 'outline'}
                  asChild
                >
                  <a href={plan.buttonLink}>
                    {plan.buttonText}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="pricing"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}