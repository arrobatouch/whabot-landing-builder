<<<<<<< HEAD
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <img
          src="/logo.svg"
          alt="Z.ai Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
=======
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { ModulesPanel } from '@/components/ModulesPanel'
import { Canvas } from '@/components/Canvas'
import { EditorPanel } from '@/components/EditorPanel'
import { Header } from '@/components/Header'
import { ModernNavigation } from '@/components/ModernNavigation'
import { LandingAssistant } from '@/components/LandingAssistant'
import { LandingGenerator } from '@/components/LandingGenerator'
import { LandingPreview } from '@/components/LandingPreview'
import { LandingDataBridge } from '@/components/LandingDataBridge'
import { Button } from '@/components/ui/button'
import { BlockType, TemplateType } from '@/types'
import { demoTemplates, getDemoTemplateWithCacheBust } from '@/data/demoTemplates'

const modules = [
  { type: 'navigation', name: 'Menú barra de Navegación' },
  { type: 'hero-slide', name: 'Hero Slide Interactivo' },
  { type: 'reinforcement', name: 'Bloque de Refuerzo' },
  { type: 'features', name: 'Bloque de Características' },
  { type: 'hero-split', name: 'Bloque Hero Dividido' },
  { type: 'product-features', name: 'Caract. del producto' },
  { type: 'countdown', name: 'Bloque Promocional' },
  { type: 'social-media', name: 'Redes Sociales' },
  { type: 'youtube', name: 'Bloque YouTube' },
  { type: 'product-cart', name: 'Bloque de Carrito de Productos' },
  { type: 'testimonials', name: 'Bloque de Testimonios' },
  { type: 'cta', name: 'Bloque CTA' },
  { type: 'pricing', name: 'Bloque de Precios' },
  { type: 'whatsapp-contact', name: 'Contacto WhatsApp' },
  { type: 'footer', name: 'Bloque de Pie de Página' },
  { type: 'image', name: 'Bloque de Imagen' },
  { type: 'stats', name: 'Bloque de Estadísticas' },
  { type: 'timeline', name: 'Bloque de Línea de Tiempo' },
  { type: 'process', name: 'Bloque de Proceso' },
  { type: 'faq', name: 'Bloque de Preguntas Frecuentes' }
]

export default function Home() {
  const [blocks, setBlocks] = useState<BlockType[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('blank')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAssistant, setShowAssistant] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<any>(null)
  const [processedContent, setProcessedContent] = useState<any>(null)
  const [bridgeBlocks, setBridgeBlocks] = useState<any[]>([])
  const [showGenerator, setShowGenerator] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [customButtons, setCustomButtons] = useState<Array<{ id: string; label: string; url: string }>>([])
  const [showMobileModules, setShowMobileModules] = useState(false)
  const [showMobileEditor, setShowMobileEditor] = useState(false)

  // Ensure theme is mounted before using it
  useEffect(() => {
    setMounted(true)
  }, [])

  // Configurar sensores para drag and drop
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  })
  
  const sensors = useSensors(
    mouseSensor,
    touchSensor
  )

  // Efecto para escuchar eventos de detención de generación
  useEffect(() => {
    const handleStopGeneration = () => {
      console.log('Stop generation event received')
      setIsGenerating(false)
    }

    const handleHideGenerator = () => {
      console.log('Hide generator event received')
      setShowGenerator(false)
    }

    window.addEventListener('stop-generation', handleStopGeneration)
    window.addEventListener('hide-generator', handleHideGenerator)
    
    return () => {
      window.removeEventListener('stop-generation', handleStopGeneration)
      window.removeEventListener('hide-generator', handleHideGenerator)
    }
  }, [])

  useEffect(() => {
    if (selectedTemplate !== 'blank') {
      setBlocks(getDemoTemplateWithCacheBust(selectedTemplate) || [])
      setShowAssistant(false)
    } else {
      setBlocks([])
    }
    setSelectedBlock(null)
  }, [selectedTemplate])

  // Función para generar landing con IA
  const handleGenerateLanding = async (prompt: string, processedContent?: any, blocks?: any) => {
    try {
      console.log("🚀 PAGE.TSX: handleGenerateLanding llamado con:")
      console.log("   - Prompt:", prompt)
      console.log("   - Processed content:", processedContent)
      console.log("   - Blocks:", blocks ? `${blocks.length} bloques` : 'ninguno')
      console.log("   - Estado actual: isGenerating=", isGenerating, "showGenerator=", showGenerator)
      
      setIsGenerating(true)
      setShowGenerator(true)
      
      // Si se proporcionan bloques, usarlos directamente
      if (blocks && Array.isArray(blocks) && blocks.length > 0) {
        console.log("📦 PAGE.TSX: Usando bloques proporcionados directamente:", blocks.length, "bloques")
        
        // Parsear businessInfo del prompt (que viene como JSON string)
        let parsedBusinessInfo = {}
        try {
          if (prompt) {
            parsedBusinessInfo = JSON.parse(prompt)
            console.log("📋 PAGE.TSX: BusinessInfo parseado del prompt:", parsedBusinessInfo)
          }
        } catch (error) {
          console.warn("⚠️ PAGE.TSX: No se pudo parsear businessInfo del prompt:", error)
        }
        
        // Guardar datos para el bridge
        const finalBusinessInfo = processedContent?.businessInfo || parsedBusinessInfo
        setBusinessInfo(finalBusinessInfo)
        setProcessedContent(processedContent)
        setBridgeBlocks(blocks)
        
        console.log("💾 PAGE.TSX: Datos guardados para bridge:", {
          businessInfo: finalBusinessInfo,
          hasProcessedContent: !!processedContent,
          bridgeBlocksCount: blocks.length
        })
        
        // Establecer bloques en el canvas
        setBlocks(blocks)
        
        // Simular progreso rápido
        dispatchProgressEvent('finalizing', 100, '¡Landing generada con éxito!', 'complete')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setIsGenerating(false)
        setShowAssistant(false)
        console.log("✅ PAGE.TSX: Proceso completado con bloques directos")
        return
      }
      
      // Timeout de seguridad para evitar que el sistema se quede congelado
      const safetyTimeout = setTimeout(() => {
        console.log('[SAFETY] Safety timeout triggered, forcing generation to stop')
        setIsGenerating(false)
        setShowGenerator(false)
        alert('El proceso está tardando demasiado. Por favor, intenta nuevamente.')
      }, 120000) // 2 minutos máximo
      
      try {
        console.log('Generating landing with prompt:', prompt, 'theme:', theme)
        
        // Enviar evento de inicio de análisis
        dispatchProgressEvent('analyzing', 10, 'Analizando información del negocio...', 'text')
        
        const response = await fetch('/api/landing/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            theme: mounted ? theme : 'system',
            processedContent
          }),
        })

        // Enviar evento de planificación
        dispatchProgressEvent('planning', 30, 'Diseñando estructura de la landing...', 'block')

        // Check if response is ok before parsing JSON
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error Response:', errorText)
          throw new Error(`API Error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()
        console.log('Generation result:', result)

        // Limpiar el timeout de seguridad
        clearTimeout(safetyTimeout)

        if (result.success) {
          // Validate blocks before setting them
          if (result.blocks && Array.isArray(result.blocks)) {
            // Simular progreso de creación de contenido
            dispatchProgressEvent('creating', 50, 'Generando textos persuasivos...', 'text')
            
            // Esperar un momento para mostrar el progreso
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Simular progreso de diseño visual
            dispatchProgressEvent('designing', 70, 'Buscando imágenes en Unsplash...', 'image')
            
            // Esperar otro momento
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Mostrar progreso de imágenes encontradas
            dispatchProgressEvent('designing', 85, 'Imágenes profesionales seleccionadas', 'image')
            
            // Simular progreso de construcción
            dispatchProgressEvent('building', 90, 'Ensamblando bloques...', 'block')
            
            // Pequeña espera antes de finalizar
            await new Promise(resolve => setTimeout(resolve, 600))
            
            // Establecer los bloques generados
            console.log('Setting generated blocks:', result.blocks.length, 'blocks')
            
            // Guardar datos para el bridge
            setBlocks(result.blocks)
            setBusinessInfo(result.businessInfo)
            setProcessedContent(result.processedContent || {})
            setBridgeBlocks(result.blocks)
            
            // Enviar evento de finalización
            dispatchProgressEvent('finalizing', 100, '¡Landing generada con éxito!', 'complete')
            
            // Esperar un momento antes de finalizar
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Importante: Asegurarse de que el estado de generación se detenga correctamente
            setIsGenerating(false)
            
            // Ocultar el asistente automáticamente después de la generación para mostrar los bloques
            setShowAssistant(false)
            
            // Cerrar el generador después de un breve delay para mostrar el completion
            setTimeout(() => {
              setShowGenerator(false)
            }, 2000)
            
            // NO ocultar automáticamente el generador inmediatamente después de la finalización
            // Permitir que el usuario vea los bloques generados y decida qué hacer
          } else {
            console.error('Invalid blocks structure in response:', result)
            throw new Error('La respuesta del servidor contiene bloques inválidos')
          }
        } else {
          // Mostrar error más amigable con detalles adicionales
          const errorMessage = result.error || 'Error desconocido'
          const errorDetails = result.details || 'Por favor, intenta nuevamente'
          alert(`${errorMessage}\n\n${errorDetails}`)
          setIsGenerating(false)
          setShowGenerator(false)
        }
      } catch (error) {
        // Limpiar el timeout de seguridad
        clearTimeout(safetyTimeout)
        throw error // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('Generation error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        response: error.response
      })
      
      // Try to get more details about the error
      let errorMessage = 'Error de conexión desconocido'
      let errorDetails = 'Por favor, intenta nuevamente'
      
      if (error.message) {
        if (error.message.includes('Unexpected token')) {
          errorMessage = 'Error de comunicación con el servidor'
          errorDetails = 'Por favor, intenta nuevamente en unos momentos'
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'No se pudo conectar con el servicio'
          errorDetails = 'Verifica tu conexión a internet e intenta nuevamente'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'El servicio está tardando demasiado en responder'
          errorDetails = 'Por favor, intenta nuevamente en unos momentos'
        } else if (error.message.includes('API Error: 504')) {
          errorMessage = 'El servicio de IA no está disponible temporalmente'
          errorDetails = 'Por favor, intenta nuevamente más tarde'
        } else if (error.message.includes('API Error: 502') || error.message.includes('Bad Gateway')) {
          errorMessage = 'El servicio de IA está experimentando problemas técnicos'
          errorDetails = 'Por favor, intenta nuevamente en unos minutos'
        } else if (error.message.includes('MCP Error')) {
          errorMessage = 'El servicio de IA está en mantenimiento o actualización'
          errorDetails = 'Por favor, intenta nuevamente en unos minutos. El sistema funcionará en modo offline.'
        } else if (error.message.includes('Failed to initialize')) {
          errorMessage = 'No se pudo inicializar el servicio de IA'
          errorDetails = 'El servicio puede estar en mantenimiento, por favor intente más tarde'
        } else {
          errorMessage = error.message
          errorDetails = 'Por favor, verifica los datos e intenta nuevamente'
        }
      }
      
      alert(`Error al conectar con el servicio de IA:\n\n${errorMessage}\n\n${errorDetails}`)
      setIsGenerating(false)
      setShowGenerator(false)
    }
  }

  // Función para despachar eventos de progreso
  const dispatchProgressEvent = (step: string, progress: number, message: string, type: 'text' | 'image' | 'block' | 'complete') => {
    const event = new CustomEvent('generation-progress', {
      detail: { step, progress, message, type }
    })
    window.dispatchEvent(event)
  }

  // Función para cambiar a modo manual
  const handleManualMode = () => {
    setShowAssistant(false)
    setBlocks([])
    setSelectedTemplate('blank')
  }

  // Función para volver al modo asistente
  const handleBackToAssistant = () => {
    setShowAssistant(true)
    setBlocks([])
    setSelectedTemplate('blank')
    setBusinessInfo(null)
  }

  // Función para previsualizar la landing
  const handlePreviewLanding = () => {
    setShowPreview(true)
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
    console.log('Drag start:', event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    console.log('Drag end:', { active: active.id, over: over?.id })
    setActiveId(null)
    
    if (over && (over.id === 'canvas' || over.id === 'dropzone')) {
      const blockType = active.data.current?.type
      if (blockType) {
        const newBlock: BlockType = {
          id: `block-${Date.now()}`,
          type: blockType as any,
          content: getDefaultContent(blockType),
          position: blocks.length
        }
        setBlocks(prev => [...prev, newBlock])
      }
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleAddCustomButton = () => {
    const label = prompt('Ingrese el texto del botón:')
    if (label) {
      const url = prompt('Ingrese la URL (ej: https://ejemplo.com):')
      if (url) {
        const newButton = {
          id: `btn-${Date.now()}`,
          label,
          url
        }
        setCustomButtons(prev => [...prev, newButton])
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header con botones de modo */}
      <Header 
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        onBackToAssistant={handleBackToAssistant}
        onPreview={handlePreviewLanding}
        showBackButton={(!showAssistant) && blocks.length === 0}
        showAssistant={showAssistant}
        blocks={blocks}
        setBlocks={setBlocks}
      />

      {/* Landing Generator Modal */}
      <LandingGenerator 
        isOpen={showGenerator}
        onClose={() => {
          setShowGenerator(false)
          setIsGenerating(false)
        }}
        onComplete={() => {
          setShowGenerator(false)
          setIsGenerating(false)
        }}
      />
      
      {/* Landing Data Bridge - Conecta los datos entre pantallas */}
      <LandingDataBridge
        businessInfo={businessInfo}
        processedContent={processedContent}
        blocks={bridgeBlocks}
        onDataReady={(landingData) => {
          console.log("✅ PAGE.TSX: Bridge - Datos listos para construcción:")
          console.log("   - Business Name:", landingData.businessInfo?.nombre_negocio)
          console.log("   - Total Blocks:", landingData.blocks?.length)
          console.log("   - Timestamp:", landingData.timestamp)
          console.log("   - Status:", landingData.status)
        }}
        onComplete={() => {
          console.log("🎉 PAGE.TSX: Bridge - Proceso completado, pasando al generador")
        }}
      />
      
      {/* Mostrar Asistente IA solo si está activo y no hay bloques generados */}
      {showAssistant && blocks.length === 0 ? (
        <LandingAssistant
          onGenerateLanding={handleGenerateLanding}
          onManualMode={handleManualMode}
          isGenerating={isGenerating}
        />
      ) : (
        <>
          <div className="flex flex-1 overflow-hidden">
            <DndContext 
              sensors={sensors} 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="flex flex-1">
                {/* Mobile Modules Panel - Bottom Sheet */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full rounded-none"
                    onClick={() => setShowMobileModules(!showMobileModules)}
                  >
                    {showMobileModules ? 'Ocultar Módulos' : 'Mostrar Módulos'}
                  </Button>
                  {showMobileModules && (
                    <div className="h-64 overflow-y-auto">
                      <ModulesPanel />
                    </div>
                  )}
                </div>
                
                {/* Desktop Modules Panel */}
                <div className="hidden lg:block">
                  <ModulesPanel />
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar smooth-scroll pb-20 lg:pb-0">
                  <Canvas 
                    blocks={blocks}
                    setBlocks={setBlocks}
                    selectedBlock={selectedBlock}
                    setSelectedBlock={setSelectedBlock}
                    selectedTemplate={selectedTemplate}
                  />
                </div>
                
                {/* Mobile Editor Panel - Bottom Sheet */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full rounded-none"
                    onClick={() => setShowMobileEditor(!showMobileEditor)}
                  >
                    {showMobileEditor ? 'Ocultar Editor' : 'Mostrar Editor'}
                  </Button>
                  {showMobileEditor && (
                    <div className="h-96 overflow-y-auto">
                      <EditorPanel 
                        selectedBlock={selectedBlock}
                        blocks={blocks}
                        setBlocks={setBlocks}
                        onAddCustomButton={handleAddCustomButton}
                        customButtons={customButtons}
                        setCustomButtons={setCustomButtons}
                      />
                    </div>
                  )}
                </div>
                
                {/* Desktop Editor Panel */}
                <div className="hidden lg:block">
                  <EditorPanel 
                    selectedBlock={selectedBlock}
                    blocks={blocks}
                    setBlocks={setBlocks}
                    onAddCustomButton={handleAddCustomButton}
                    customButtons={customButtons}
                    setCustomButtons={setCustomButtons}
                  />
                </div>
              </div>
              
              <DragOverlay>
                {activeId ? (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm text-primary-foreground">
                    Arrastrando módulo...
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </>
      )}

      {/* Landing Preview Modal */}
      <LandingPreview 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        blocks={blocks}
        businessInfo={businessInfo}
      />
    </div>
  )
}

// Función para obtener contenido por defecto para cada tipo de bloque
function getDefaultContent(type: string): any {
  switch (type) {
    case 'navigation':
      return {
        logo: '',
        logoAlt: 'Logo',
        menuItems: [
          { id: '1', label: 'Inicio', url: '#' },
          { id: '2', label: 'Servicios', url: '#' },
          { id: '3', label: 'Sobre Nosotros', url: '#' },
          { id: '4', label: 'Contacto', url: '#' }
        ],
        ctaButton: {
          label: 'Comenzar',
          url: '#'
        },
        styles: {
          backgroundColor: 'bg-background',
          textColor: 'text-foreground',
          paddingY: 'py-4'
        }
      }
    case 'hero-slide':
      return {
        slides: [
          {
            id: 'slide-1',
            backgroundImage: '',
            title: 'Título Principal',
            subtitle: 'Subtítulo Atractivo',
            buttonText: 'Comenzar',
            buttonType: 'external' as const,
            buttonTarget: '#',
            textColor: 'light' as const,
            imageFilter: 'none' as const
          }
        ],
        navigationStyle: 'arrows' as const,
        autoPlay: true,
        autoPlayInterval: 5000,
        transitionType: 'fade' as const,
        transitionSpeed: 500,
        height: 'viewport' as const,
        marginTop: 0,
        marginBottom: 0,
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-0',
          paddingX: 'px-0'
        }
      }
    case 'reinforcement':
      return {
        title: 'Título de Refuerzo',
        description: 'Descripción detallada del valor que ofreces.',
        features: [
          {
            title: 'Característica 1',
            description: 'Descripción de la primera característica'
          },
          {
            title: 'Característica 2',
            description: 'Descripción de la segunda característica'
          },
          {
            title: 'Característica 3',
            description: 'Descripción de la tercera característica'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'features':
      return {
        title: 'Nuestras Características',
        subtitle: 'Descubre lo que nos hace únicos',
        features: [
          {
            icon: '',
            title: 'Característica 1',
            description: 'Descripción de la primera característica'
          },
          {
            icon: '',
            title: 'Característica 2',
            description: 'Descripción de la segunda característica'
          },
          {
            icon: '',
            title: 'Característica 3',
            description: 'Descripción de la tercera característica'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'hero-split':
      return {
        title: 'Título Principal',
        subtitle: 'Subtítulo Atractivo',
        description: 'Descripción detallada de tu producto o servicio.',
        leftImage: '',
        leftImageAlt: 'Imagen izquierda',
        primaryButtonText: 'Comenzar',
        primaryButtonUrl: '#',
        secondaryButtonText: 'Más Información',
        secondaryButtonUrl: '#',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-20',
          paddingX: 'px-6'
        }
      }
    case 'product-features':
      return {
        title: 'Nuestros Productos',
        subtitle: 'Características únicas de cada producto',
        features: [
          {
            id: 'product-1',
            title: 'Producto 1',
            description: 'Descripción del producto 1',
            features: ['Característica 1', 'Característica 2'],
            price: '$99.99',
            image: '',
            buttonText: 'Ver más',
            buttonUrl: '#'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'countdown':
      return {
        title: 'Oferta Especial',
        subtitle: 'No te pierdas esta oportunidad única',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
        backgroundImage: '',
        button: {
          text: 'Aprovechar Oferta',
          link: '#',
          linkType: 'external' as const,
          color: 'bg-primary',
          hoverColor: 'bg-primary/90'
        },
        alignment: 'center' as const,
        timerStyle: 'digital' as const,
        timerColors: {
          numbers: '#ffffff',
          labels: '#ffffff',
          background: '#000000'
        },
        expiredAction: 'show-message' as const,
        expiredMessage: 'La oferta ha finalizado',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'social-media':
      return {
        buttonPosition: 'right' as const,
        buttonMargin: 20,
        buttonColor: '#25D366',
        socialLinks: [
          {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: '',
            url: 'https://wa.me/',
            order: 1
          },
          {
            id: 'facebook',
            name: 'Facebook',
            icon: '',
            url: 'https://facebook.com/',
            order: 2
          },
          {
            id: 'instagram',
            name: 'Instagram',
            icon: '',
            url: 'https://instagram.com/',
            order: 3
          }
        ],
        animationType: 'vertical' as const,
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-4',
          paddingX: 'px-4'
        }
      }
    case 'youtube':
      return {
        title: 'Video Destacado',
        description: 'Mira nuestro video para conocer más sobre nosotros',
        videoUrl: 'https://youtube.com/watch?v=example',
        videoId: 'example',
        visualMode: 'light' as const,
        controls: {
          hideControls: false,
          hideTitle: false,
          autoPlay: false,
          muteOnStart: false,
          loop: false,
          showRelatedVideos: true,
          modestBranding: true
        },
        size: {
          preset: 'medium' as const,
          height: '400',
          heightUnit: 'px' as const,
          marginTop: 0,
          marginBottom: 0
        },
        alignment: 'center' as const,
        advanced: {
          startTime: 0,
          language: 'es'
        },
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'product-cart':
      return {
        title: 'Nuestros Productos',
        subtitle: 'Selecciona los productos que deseas adquirir',
        whatsappNumber: '+1234567890',
        products: [
          {
            id: 'product-1',
            name: 'Producto 1',
            description: 'Descripción del producto 1',
            price: 99.99,
            currency: 'USD',
            image: '',
            category: 'Categoría 1',
            inStock: true,
            features: ['Característica 1', 'Característica 2']
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'testimonials':
      return {
        title: 'Testimonios',
        subtitle: 'Lo que dicen nuestros clientes',
        testimonials: [
          {
            name: 'Cliente 1',
            role: 'Profesión',
            company: 'Empresa',
            content: 'Excelente servicio, muy recomendado.',
            avatar: ''
          },
          {
            name: 'Cliente 2',
            role: 'Profesión',
            company: 'Empresa',
            content: 'La mejor experiencia que he tenido.',
            avatar: ''
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'cta':
      return {
        title: '¿Listo para comenzar?',
        description: 'Únete a miles de clientes satisfechos.',
        buttonText: 'Comenzar Ahora',
        buttonLink: '#',
        backgroundImage: '',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'pricing':
      return {
        title: 'Planes y Precios',
        subtitle: 'Elige el plan que mejor se adapte a tus necesidades',
        plans: [
          {
            icon: '',
            name: 'Básico',
            price: '$9.99',
            period: '/mes',
            description: 'Perfecto para comenzar',
            features: ['Característica 1', 'Característica 2'],
            buttonText: 'Comenzar',
            buttonLink: '#',
            featured: false
          },
          {
            icon: '',
            name: 'Profesional',
            price: '$19.99',
            period: '/mes',
            description: 'Para profesionales',
            features: ['Todas las características', 'Soporte prioritario'],
            buttonText: 'Comenzar',
            buttonLink: '#',
            featured: true
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'whatsapp-contact':
      return {
        title: 'Contacto vía WhatsApp',
        description: 'Habla con nosotros directamente por WhatsApp',
        whatsappNumber: '+1234567890',
        defaultMessage: 'Hola, estoy interesado en sus servicios.',
        buttonText: 'Contactar por WhatsApp',
        leftImage: '',
        leftImageAlt: 'Imagen de contacto',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'footer':
      return {
        logo: '',
        company: 'Tu Empresa',
        description: 'Descripción de tu empresa',
        links: [
          {
            title: 'Enlaces Rápidos',
            items: [
              { text: 'Inicio', url: '#' },
              { text: 'Servicios', url: '#' },
              { text: 'Sobre Nosotros', url: '#' },
              { text: 'Contacto', url: '#' }
            ]
          }
        ],
        socialLinks: [
          {
            platform: 'Facebook',
            url: 'https://facebook.com/',
            icon: ''
          },
          {
            platform: 'Twitter',
            url: 'https://twitter.com/',
            icon: ''
          },
          {
            platform: 'Instagram',
            url: 'https://instagram.com/',
            icon: ''
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-8',
          paddingX: 'px-6'
        }
      }
    case 'image':
      return {
        title: 'Título de la Imagen',
        description: 'Descripción de la imagen',
        image: '',
        alt: 'Imagen descriptiva',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'stats':
      return {
        title: 'Nuestros Logros',
        stats: [
          {
            icon: '',
            value: '100+',
            label: 'Clientes Satisfechos'
          },
          {
            icon: '',
            value: '50+',
            label: 'Proyectos Completados'
          },
          {
            icon: '',
            value: '5+',
            label: 'Años de Experiencia'
          },
          {
            icon: '',
            value: '24/7',
            label: 'Soporte Disponible'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'timeline':
      return {
        title: 'Nuestra Historia',
        events: [
          {
            icon: '',
            date: '2020',
            title: 'Fundación',
            description: 'Iniciamos nuestra empresa con una visión clara.'
          },
          {
            icon: '',
            date: '2021',
            title: 'Crecimiento',
            description: 'Expandimos nuestros servicios y reached new milestones.'
          },
          {
            icon: '',
            date: '2022',
            title: 'Innovación',
            description: 'Lanzamos nuevos productos y servicios innovadores.'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'process':
      return {
        title: 'Nuestro Proceso',
        subtitle: 'Cómo trabajamos para lograr tus objetivos',
        steps: [
          {
            icon: '',
            title: 'Paso 1',
            description: 'Descripción del primer paso'
          },
          {
            icon: '',
            title: 'Paso 2',
            description: 'Descripción del segundo paso'
          },
          {
            icon: '',
            title: 'Paso 3',
            description: 'Descripción del tercer paso'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'faq':
      return {
        title: 'Preguntas Frecuentes',
        faqs: [
          {
            question: '¿Cuál es el tiempo de entrega?',
            answer: 'El tiempo de entrega varía según el proyecto, pero generalmente es de 2-4 semanas.'
          },
          {
            question: '¿Ofrecen soporte técnico?',
            answer: 'Sí, ofrecemos soporte técnico 24/7 para todos nuestros clientes.'
          },
          {
            question: '¿Aceptan proyectos personalizados?',
            answer: 'Sí, aceptamos proyectos personalizados según las necesidades del cliente.'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    default:
      return {}
  }
>>>>>>> 1738e6cdd56ec36c3db0b938f85d9822554f81df
}