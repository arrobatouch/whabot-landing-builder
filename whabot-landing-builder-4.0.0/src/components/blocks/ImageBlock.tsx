'use client'

import { ImageBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { ImageUpload } from '@/components/ui/image-upload'
import { Edit, Upload } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useState, useEffect } from 'react'

interface ImageBlockProps {
  content: ImageBlockContent
  onContentChange?: (newContent: ImageBlockContent) => void
}

export function ImageBlock({ content, onContentChange }: ImageBlockProps) {
  const [imageLoadTime, setImageLoadTime] = useState<number | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const blockId = `image-block-${Date.now()}` // ID único para este bloque

  // Loggear cuando el componente se monta
  useEffect(() => {
    logger.logBlock('image', 'mount', {
      blockId,
      isActive: true,
      hasImages: !!content.image,
      imageCount: content.image ? 1 : 0,
      imageUrls: content.image ? [content.image] : [],
      content
    })
  }, [])

  // Loggear cuando cambia el contenido
  useEffect(() => {
    logger.logBlock('image', 'content_change', {
      blockId,
      isActive: true,
      hasImages: !!content.image,
      imageCount: content.image ? 1 : 0,
      imageUrls: content.image ? [content.image] : [],
      content
    })
  }, [content])

  const handleAIImprovement = (newContent: any) => {
    logger.logBlock('image', 'ai_improvement', {
      blockId,
      isActive: true,
      metadata: {
        improvementType: 'ai_suggested',
        originalContent: content,
        newContent
      }
    })

    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const handleImageChange = (newImageUrl: string) => {
    const startTime = Date.now()
    
    logger.logBlockImageOperation('image', blockId, 'change', newImageUrl, true)
    
    if (onContentChange) {
      onContentChange({
        ...content,
        image: newImageUrl
      })
    }

    // Loggear el tiempo que tomó el cambio
    const duration = Date.now() - startTime
    logger.logBlock('image', 'image_change_complete', {
      blockId,
      isActive: true,
      hasImages: !!newImageUrl,
      imageCount: newImageUrl ? 1 : 0,
      imageUrls: newImageUrl ? [newImageUrl] : [],
      duration,
      metadata: {
        operation: 'user_initiated_change',
        newImageUrl
      }
    })
  }

  // Manejar carga de imagen
  const handleImageLoad = () => {
    const loadTime = imageLoadTime || 0
    setImageError(null)
    
    logger.logImageLoad(content.image, 'image', blockId, true, loadTime)
    logger.logBlock('image', 'image_load_success', {
      blockId,
      isActive: true,
      hasImages: true,
      imageCount: 1,
      imageUrls: [content.image],
      metadata: {
        loadTime,
        imageUrl: content.image
      }
    })
  }

  // Manejar error de carga de imagen
  const handleImageError = () => {
    const error = 'No se pudo cargar la imagen'
    setImageError(error)
    
    logger.logImageLoad(content.image, 'image', blockId, false, imageLoadTime || 0, error)
    logger.logBlock('image', 'image_load_error', {
      blockId,
      isActive: true,
      hasImages: false,
      imageCount: 0,
      imageUrls: content.image ? [content.image] : [],
      error,
      metadata: {
        imageUrl: content.image,
        loadTime: imageLoadTime || 0
      }
    })
  }

  // Iniciar medición de tiempo de carga
  const handleImageLoadStart = () => {
    setImageLoadTime(Date.now())
    logger.logBlock('image', 'image_load_start', {
      blockId,
      isActive: true,
      hasImages: true,
      imageCount: 1,
      imageUrls: [content.image],
      metadata: {
        imageUrl: content.image,
        loadStartTime: Date.now()
      }
    })
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
            {content.image ? (
              <img
                src={content.image}
                alt={content.alt}
                className="rounded-lg shadow-2xl w-full h-auto"
                onLoadStart={handleImageLoadStart}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              /* Indicador de imagen no cargada */
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
            
            {/* Overlay de edición - aparece al hacer hover o siempre visible si está seleccionado */}
            {onContentChange && content.image && (
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
                      logger.logBlock('image', 'edit_panel_open', {
                        blockId,
                        isActive: true,
                        hasImages: !!content.image,
                        imageCount: content.image ? 1 : 0,
                        imageUrls: content.image ? [content.image] : [],
                        metadata: {
                          action: 'open_edit_panel',
                          trigger: 'button_click'
                        }
                      })
                      
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
            
            {/* Indicador de error de carga */}
            {imageError && (
              <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-red-700">
                  <p className="font-semibold">Error al cargar imagen</p>
                  <p className="text-sm">{imageError}</p>
                </div>
              </div>
            )}
          </div>
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