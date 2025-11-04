'use client'

import { ImageBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { ImageUpload } from '@/components/ui/image-upload'
import { Edit, Upload } from 'lucide-react'

interface ImageBlockProps {
  content: ImageBlockContent
  onContentChange?: (newContent: ImageBlockContent) => void
}

export function ImageBlock({ content, onContentChange }: ImageBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const handleImageChange = (newImageUrl: string) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        image: newImageUrl
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
    'max-w-4xl',
    'mx-auto',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
          {content.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.description}
            </p>
          )}
        </div>
        
        <div className="relative">
          {/* Contenedor de la imagen con overlay de edición */}
          <div className="relative inline-block w-full">
            <img
              src={content.image}
              alt={content.alt}
              className="rounded-lg shadow-2xl w-full h-auto"
            />
            
            {/* Overlay de edición - aparece al hacer hover o siempre visible si está seleccionado */}
            {onContentChange && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex space-x-2">
                  {/* Botón de upload de imagen */}
                  <ImageUpload
                    currentImage={content.image}
                    onImageChange={handleImageChange}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar Imagen
                    </Button>
                  </ImageUpload>
                  
                  {/* Botón de edición (abre el panel derecho) */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-black"
                    onClick={() => {
                      // Esto activará el panel de edición derecho
                      const blockElement = document.querySelector('[data-block-id]') as HTMLElement
                      if (blockElement) {
                        blockElement.click()
                      }
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Indicador de imagen no cargada */}
          {!content.image && (
            <div className="w-full h-64 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-muted-foreground mb-4">No hay imagen seleccionada</p>
                <ImageUpload
                  currentImage={content.image}
                  onImageChange={handleImageChange}
                >
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Imagen
                  </Button>
                </ImageUpload>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="image"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}