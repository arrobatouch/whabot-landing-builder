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
  const [blocks, setBlocks] = useState<BlockType[]>([
    {
      id: 'block-hero',
      type: 'hero-slide',
      content: {
        title: '🏖️ Alquileres Temporarios Las Gaviotas',
        subtitle: 'Complejos Océano & Médano 29 — Tu descanso frente al mar',
        description: 'En Las Gaviotas, entre Mar Azul y Mar de las Pampas, te esperan nuestros complejos Océano y Médano 29, dos espacios diseñados para que disfrutes la naturaleza, el confort y la tranquilidad de la costa todo el año.',
        backgroundImage: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1920&h=1080&fit=crop',
        primaryButtonText: 'Ver Complejos',
        primaryButtonUrl: '#complejos',
        secondaryButtonText: 'Reservar Ahora',
        secondaryButtonUrl: '#contacto',
        styles: {
          backgroundColor: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
          paddingY: 'py-20',
          paddingX: 'px-6',
          textAlign: 'text-center'
        }
      },
      position: 0
    },
    {
      id: 'block-complejos',
      type: 'product-features',
      content: {
        title: 'Nuestros Complejos',
        subtitle: 'Dos opciones únicas para tu descanso perfecto',
        features: [
          {
            id: 'oceano',
            title: '🌊 Complejo Océano',
            description: 'Elegancia y confort a pasos del mar. Ideal para parejas o familias pequeñas.',
            features: [
              '📍 50 metros del mar, sobre Calle 32',
              '🛏️ Departamentos para 2-4 personas',
              '🌞 Balcones con vista al mar y parrilla',
              '❄️ Aire acondicionado frío/calor',
              '📺 Smart TV + WiFi fibra óptica',
              '🏊‍♂️ Piscina climatizada exterior',
              '🚗 Estacionamiento privado seguro'
            ],
            price: 'Desde $95.000 por noche',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            buttonText: 'Ver Detalles',
            buttonUrl: '#oceano'
          },
          {
            id: 'medano',
            title: '🏝️ Complejo Médano 29',
            description: 'Diseño moderno rodeado de pinos, a solo tres cuadras de la playa.',
            features: [
              '📍 Calle 29 entre Punta del Este y Copacabana',
              '🛋️ Cabañas dúplex para 4-6 personas',
              '🍖 Deck privado y parrilla individual',
              '🧺 Zona de juegos para niños',
              '🐶 Pet Friendly (con reserva)',
              '📡 WiFi + Smart TV + calefacción',
              '🧼 Servicio de limpieza opcional'
            ],
            price: 'Desde $115.000 por noche',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
            buttonText: 'Ver Detalles',
            buttonUrl: '#medano'
          }
        ],
        styles: {
          backgroundColor: 'bg-white',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      },
      position: 1
    },
    {
      id: 'block-promocion',
      type: 'countdown',
      content: {
        title: '🎁 Promoción de Lanzamiento — Temporada 2025',
        subtitle: 'No te pierdas esta oportunidad única',
        description: 'Reservando desde el 1 al 30 de noviembre de 2025, obtené increíbles beneficios en cualquiera de nuestros complejos.',
        offer: '15% OFF + Desayuno Artesanal Incluido',
        conditions: 'Válido para estadías de 4 noches o más',
        ctaText: 'Reservar Ahora',
        ctaUrl: '#contacto',
        styles: {
          backgroundColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
          paddingY: 'py-16',
          paddingX: 'px-6',
          textAlign: 'text-center'
        }
      },
      position: 2
    },
    {
      id: 'block-diferencias',
      type: 'features',
      content: {
        title: '🧭 Qué nos diferencia',
        subtitle: 'Por qué elegir nuestros complejos',
        features: [
          {
            id: 'ubicacion',
            title: '🌊 Ubicación privilegiada',
            description: 'A pocos pasos de la playa y cerca del centro de Mar de las Pampas'
          },
          {
            id: 'departamentos',
            title: '🏡 Departamentos amplios y equipados',
            description: 'Diseño moderno y detalles cuidados para tu comodidad'
          },
          {
            id: 'atencion',
            title: '💬 Atención personalizada',
            description: 'Trato directo con los dueños para una experiencia única'
          },
          {
            id: 'seguridad',
            title: '🔒 Seguridad y tranquilidad',
            description: 'Ambiente seguro y pacífico para disfrutar tus vacaciones'
          },
          {
            id: 'sustentable',
            title: '🌱 Respeto por el entorno natural',
            description: 'Energía eficiente y gestión sustentable del complejo'
          }
        ],
        styles: {
          backgroundColor: 'bg-slate-50',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      },
      position: 3
    },
    {
      id: 'block-contacto',
      type: 'whatsapp-contact',
      content: {
        title: '📅 Reservas & Contacto',
        description: 'Consultá disponibilidad y tarifas actualizadas. ¡Estamos para ayudarte!',
        whatsappNumber: '+54 9 11 5555-9000',
        defaultMessage: 'Hola, estoy interesado en reservar en sus complejos en Las Gaviotas. ¿Podrían darme más información?',
        buttonText: 'Contactar por WhatsApp',
        leftImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        leftImageAlt: 'Playa Las Gaviotas',
        styles: {
          backgroundColor: 'bg-white',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      },
      position: 4
    },
    {
      id: 'block-footer',
      type: 'footer',
      content: {
        companyName: 'Alquileres Las Gaviotas',
        description: 'Complejos Océano & Médano 29 - Tu descanso frente al mar',
        address: 'Las Gaviotas, Partido de Villa Gesell, Buenos Aires',
        email: 'reservas@lasgaviotasoceano.com.ar',
        phone: '+54 9 11 5555-9000',
        socialLinks: [
          { platform: 'facebook', url: '#' },
          { platform: 'instagram', url: '#' }
        ],
        quickLinks: [
          { text: 'Complejo Océano', url: '#oceano' },
          { text: 'Complejo Médano 29', url: '#medano' },
          { text: 'Promociones', url: '#promociones' },
          { text: 'Contacto', url: '#contacto' }
        ],
        styles: {
          backgroundColor: 'bg-slate-900',
          textColor: 'text-white',
          paddingY: 'py-12',
          paddingX: 'px-6'
        }
      },
      position: 5
    }
  ])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('blank')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAssistant, setShowAssistant] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<any>(null)
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
  const handleGenerateLanding = async (prompt: string, processedContent?: any) => {
    try {
      console.log('handleGenerateLanding called with prompt:', prompt)
      console.log('Processed content:', processedContent)
      console.log('Current state - isGenerating:', isGenerating, 'showGenerator:', showGenerator)
      
      setIsGenerating(true)
      setShowGenerator(true)
      
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
            setBlocks(result.blocks)
            setBusinessInfo(result.businessInfo)
            
            // Enviar evento de finalización
            dispatchProgressEvent('finalizing', 100, '¡Landing generada con éxito!', 'complete')
            
            // Esperar un momento antes de finalizar
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Importante: Asegurarse de que el estado de generación se detenga correctamente
            setIsGenerating(false)
            
            // Ocultar el asistente automáticamente después de la generación para mostrar los bloques
            setShowAssistant(false)
            
            // NO ocultar automáticamente el generador después de la finalización
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
        showBackButton={!showAssistant && blocks.length === 0}
        blocks={blocks}
        setBlocks={setBlocks}
      />

      {/* Landing Generator Modal */}
      <LandingGenerator 
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
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
                {selectedBlock && (
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
                          blocks={blocks}
                          setBlocks={setBlocks}
                          selectedBlock={selectedBlock}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Desktop Editor Panel */}
                <div className="hidden lg:block">
                  <EditorPanel 
                    blocks={blocks}
                    setBlocks={setBlocks}
                    selectedBlock={selectedBlock}
                  />
                </div>
              </div>
              
              <DragOverlay>
                {activeId ? (
                  <div className="p-3 border border-border rounded-lg bg-card shadow-lg opacity-90">
                    {modules.find(m => m.type === activeId)?.name || 'Bloque'}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </>
      )}

      {/* Overlay de generación progresiva */}
      {showGenerator && (
        <LandingGenerator
          blocks={blocks}
          onBlocksChange={setBlocks}
          onEditMode={() => {
            setShowGenerator(false)
            setShowAssistant(false)
          }}
          isGenerating={isGenerating}
          businessInfo={businessInfo}
        />
      )}

      {/* Landing Preview Modal */}
      <LandingPreview 
        blocks={blocks}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}

function getDefaultContent(type: string): any {
  switch (type) {
    case 'navigation':
      return {
        logoPosition: 'left' as const,
        menuPosition: 'right' as const,
        companyName: 'Mi Empresa',
        logoUrl: '',
        logoUpload: null,
        customButtons: [
          { id: 'btn-1', label: 'Inicio', url: '#' },
          { id: 'btn-2', label: 'Servicios', url: '#' },
          { id: 'btn-3', label: 'Contacto', url: '#' }
        ],
        showLandings: true,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        paddingY: 'py-4',
        paddingX: 'px-6',
        border: 'border-b',
        borderColor: '#e5e7eb',
        shadow: 'shadow-sm',
        borderRadius: 'rounded-none',
        opacity: 'opacity-100',
        hoverTransform: 'none'
      }
    case 'hero-slide':
      return {
        title: 'Título Principal',
        subtitle: 'Subtítulo Atractivo',
        description: 'Descripción detallada de tu producto o servicio.',
        backgroundImage: '',
        primaryButtonText: 'Comenzar',
        primaryButtonUrl: '#',
        secondaryButtonText: 'Más Información',
        secondaryButtonUrl: '#',
        styles: {
          backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-600',
          paddingY: 'py-20',
          paddingX: 'px-6',
          textAlign: 'text-center'
        }
      }
    case 'features':
      return {
        title: 'Características',
        subtitle: 'Lo que nos hace únicos',
        features: [
          {
            id: 'feature-1',
            title: 'Característica 1',
            description: 'Descripción de la característica principal'
          },
          {
            id: 'feature-2',
            title: 'Característica 2',
            description: 'Descripción de la segunda característica'
          },
          {
            id: 'feature-3',
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
    case 'testimonials':
      return {
        title: 'Testimonios',
        subtitle: 'Lo que dicen nuestros clientes',
        testimonials: [
          {
            id: 'testimonial-1',
            name: 'Cliente Satisfecho',
            role: 'Profesional',
            company: 'Empresa',
            avatar: '',
            content: 'Excelente servicio, muy recomendado.'
          }
        ],
        styles: {
          backgroundColor: 'bg-muted/20',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'cta':
      return {
        title: '¿Listo para comenzar?',
        subtitle: 'Únete a nosotros hoy mismo',
        buttonText: 'Comenzar Ahora',
        buttonUrl: '#',
        styles: {
          backgroundColor: 'bg-primary',
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
            id: 'plan-1',
            name: 'Básico',
            price: '$99',
            frequency: '/mes',
            features: ['Característica 1', 'Característica 2', 'Característica 3'],
            buttonText: 'Seleccionar',
            buttonUrl: '#',
            highlighted: false
          },
          {
            id: 'plan-2',
            name: 'Profesional',
            price: '$199',
            frequency: '/mes',
            features: ['Característica 1', 'Característica 2', 'Característica 3', 'Característica 4'],
            buttonText: 'Seleccionar',
            buttonUrl: '#',
            highlighted: true
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
        title: 'Contacto',
        description: '¿Tenés preguntas? Contactanos',
        whatsappNumber: '+54 9 11 1234-5678',
        defaultMessage: 'Hola, estoy interesado en sus servicios.',
        buttonText: 'Contactar por WhatsApp',
        leftImage: '',
        leftImageAlt: 'Contacto',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'footer':
      return {
        companyName: 'Mi Empresa',
        description: 'Descripción de la empresa',
        address: 'Dirección de la empresa',
        email: 'contacto@empresa.com',
        phone: '+54 9 11 1234-5678',
        socialLinks: [
          { platform: 'facebook', url: '#' },
          { platform: 'instagram', url: '#' }
        ],
        quickLinks: [
          { text: 'Inicio', url: '#' },
          { text: 'Servicios', url: '#' },
          { text: 'Contacto', url: '#' }
        ],
        styles: {
          backgroundColor: 'bg-slate-900',
          textColor: 'text-white',
          paddingY: 'py-12',
          paddingX: 'px-6'
        }
      }
    case 'image':
      return {
        imageUrl: '',
        imageAlt: 'Imagen',
        caption: 'Pie de imagen',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-8',
          paddingX: 'px-6'
        }
      }
    case 'stats':
      return {
        title: 'Nuestros Números',
        subtitle: 'Estadísticas que hablan por sí solas',
        stats: [
          {
            id: 'stat-1',
            value: '100+',
            label: 'Clientes Felices'
          },
          {
            id: 'stat-2',
            value: '50+',
            label: 'Proyectos Completados'
          },
          {
            id: 'stat-3',
            value: '5+',
            label: 'Años de Experiencia'
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
        subtitle: 'El camino que nos trajo hasta aquí',
        events: [
          {
            id: 'event-1',
            date: '2020',
            title: 'Inicio del Proyecto',
            description: 'Comenzamos con una visión clara'
          },
          {
            id: 'event-2',
            date: '2021',
            title: 'Primeros Clientes',
            description: 'Logramos nuestros primeros clientes satisfechos'
          },
          {
            id: 'event-3',
            date: '2022',
            title: 'Expansión',
            description: 'Creímos y mejoramos nuestros servicios'
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
        subtitle: 'Cómo trabajamos para lograr los mejores resultados',
        steps: [
          {
            id: 'step-1',
            title: 'Paso 1',
            description: 'Descripción del primer paso'
          },
          {
            id: 'step-2',
            title: 'Paso 2',
            description: 'Descripción del segundo paso'
          },
          {
            id: 'step-3',
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
        subtitle: 'Respuestas a las dudas más comunes',
        faqs: [
          {
            id: 'faq-1',
            question: '¿Pregunta frecuente 1?',
            answer: 'Respuesta a la pregunta frecuente 1'
          },
          {
            id: 'faq-2',
            question: '¿Pregunta frecuente 2?',
            answer: 'Respuesta a la pregunta frecuente 2'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'social-media':
      return {
        title: 'Síguenos en Redes Sociales',
        subtitle: 'Mantente conectado con nosotros',
        platforms: [
          {
            id: 'social-1',
            platform: 'facebook',
            url: '#',
            followers: '1000+'
          },
          {
            id: 'social-2',
            platform: 'instagram',
            url: '#',
            followers: '2000+'
          }
        ],
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'youtube':
      return {
        title: 'Video Destacado',
        subtitle: 'Conoce más sobre nosotros',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoTitle: 'Video Presentación',
        videoDescription: 'Descripción del video',
        styles: {
          backgroundColor: 'bg-background',
          paddingY: 'py-16',
          paddingX: 'px-6'
        }
      }
    case 'product-cart':
      return {
        title: 'Productos Destacados',
        subtitle: 'Nuestra selección especial para ti',
        products: [
          {
            id: 'product-1',
            name: 'Producto 1',
            description: 'Descripción del producto 1',
            price: '$99.99',
            image: '',
            buttonText: 'Comprar',
            buttonUrl: '#'
          },
          {
            id: 'product-2',
            name: 'Producto 2',
            description: 'Descripción del producto 2',
            price: '$149.99',
            image: '',
            buttonText: 'Comprar',
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
        subtitle: 'No te pierdas esta oportunidad',
        description: 'Descripción de la oferta especial',
        offer: '50% OFF',
        conditions: 'Válido por tiempo limitado',
        ctaText: 'Aprovechar Oferta',
        ctaUrl: '#',
        styles: {
          backgroundColor: 'bg-gradient-to-r from-red-50 to-pink-50',
          paddingY: 'py-16',
          paddingX: 'px-6',
          textAlign: 'text-center'
        }
      }
    case 'reinforcement':
      return {
        title: '¿Por qué elegirnos?',
        subtitle: 'Las razones que nos hacen diferentes',
        description: 'Descripción del bloque de refuerzo',
        features: [
          {
            id: 'reinforcement-1',
            title: 'Ventaja 1',
            description: 'Descripción de la ventaja 1'
          },
          {
            id: 'reinforcement-2',
            title: 'Ventaja 2',
            description: 'Descripción de la ventaja 2'
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
    default:
      return {}
  }
}