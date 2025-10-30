'use client'

import { ProductFeaturesBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { Settings, Plus, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface ProductFeaturesBlockProps {
  content: ProductFeaturesBlockContent
  onContentChange?: (newContent: ProductFeaturesBlockContent) => void
}

export function ProductFeaturesBlock({ content, onContentChange }: ProductFeaturesBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }

  const scrollToProductCart = () => {
    // Buscar el bloque de product-cart en la página
    const productCartElement = document.querySelector('[data-block-type="product-cart"]')
    if (productCartElement) {
      productCartElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Si no se encuentra, redirigir al enlace del botón
      if (content.buttonLink && content.buttonLink !== '#') {
        window.open(content.buttonLink, '_blank')
      }
    }
  }

  const styles = content.styles || {}
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
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
  
  const containerClasses = [
    'max-w-7xl',
    'mx-auto',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses} data-block-type="product-features">
      <div className={containerClasses}>
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left Column - Items */}
          <div className="lg:col-span-4 space-y-6">
            {(content.leftItems || []).map((item, index) => (
              <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Center Column - Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="w-full max-w-sm mx-auto">
                {content.centerImage ? (
                  <img
                    src={content.centerImage}
                    alt={content.centerImageAlt}
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget.parentElement
                      if (fallback) {
                        fallback.innerHTML = '<div class="w-full h-64 flex items-center justify-center text-muted-foreground bg-muted rounded-lg">🖼️ Imagen no disponible</div>'
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    🖼️ Imagen no disponible
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Items */}
          <div className="lg:col-span-4 space-y-6">
            {(content.rightItems || []).map((item, index) => (
              <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Button */}
        {content.buttonText && (
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={scrollToProductCart}
              className="px-8 py-3"
            >
              {content.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {((content.leftItems || []).length === 0 && (content.rightItems || []).length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Características del producto</h3>
            <p className="text-muted-foreground">
              Agrega características para mostrar las ventajas de tu producto
            </p>
          </div>
        )}
      </div>

      {/* AI Improvement Button */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="product-features"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}