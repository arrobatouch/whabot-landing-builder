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
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({ ...content, ...newContent })
    }
  }

  const styles = content.styles || {}

  // 🧠 Si no hay features, genera 6 predeterminadas
  const generatedFeatures =
    content.features && content.features.length > 0
      ? content.features
      : Array.from({ length: 6 }, (_, i) => ({
          icon: '⭐',
          title: `Item ${i + 1}`,
          description: `Descripción del item ${i + 1}`,
        }))

  // ✅ Imagen central dinámica (corregido para aceptar 'image')
  const centerImage =
    (content.centerImage && content.centerImage.trim() !== ''
      ? content.centerImage
      : content.image && content.image.trim() !== ''
      ? content.image
      : content.backgroundImage && content.backgroundImage.trim() !== ''
      ? content.backgroundImage
      : 'https://placehold.co/600x400?text=Imagen+de+producto')

  const sectionClasses = [
    'relative',
    'group',
    'overflow-hidden',
    styles.backgroundColor || 'bg-background',
    styles.paddingY || 'py-20',
    styles.paddingX || 'px-6',
    styles.margin || 'mb-0',
    styles.border || 'none',
    styles.borderColor || 'border-border',
    styles.shadow || 'none',
    styles.borderRadius || 'rounded-none',
    styles.opacity || 'opacity-100',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      className={sectionClasses}
      style={{
        backgroundImage: content.backgroundImage
          ? `url(${content.backgroundImage})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay oscuro si hay fondo */}
      {content.backgroundImage && (
        <div className="absolute inset-0 bg-black/40 z-0" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Encabezado */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {content.title || 'Título de bloque de características'}
          </h2>
          {content.subtitle && (
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-6">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* GRID con 3 columnas a cada lado y una imagen central */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Columna izquierda */}
          <div className="flex flex-col space-y-6">
            {generatedFeatures.slice(0, 3).map((feature, i) => (
              <Card
                key={i}
                className="p-4 bg-black/70 text-white border-none shadow-lg"
              >
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-400 text-xl">{feature.icon}</div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Imagen central */}
          <div className="flex justify-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={centerImage}
                alt={content.centerImageAlt || 'Imagen de producto'}
                className="w-[320px] h-[320px] object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://placehold.co/320x320?text=Imagen+no+disponible'
                }}
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col space-y-6">
            {generatedFeatures.slice(3, 6).map((feature, i) => (
              <Card
                key={i}
                className="p-4 bg-black/70 text-white border-none shadow-lg"
              >
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-400 text-xl">{feature.icon}</div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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