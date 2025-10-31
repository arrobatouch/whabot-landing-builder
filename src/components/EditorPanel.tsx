'use client'

import { BlockType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmojiPicker } from '@/components/ui/emoji-picker'
import { useState } from 'react'
import { Settings, Trash2, Edit, Sparkles, Loader2, Plus, Minus, Palette, Play, Monitor, Settings2, Eye, RotateCcw, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabContent } from '@/components/ui/tabs'
import { DesignHistory } from '@/components/DesignHistory'
import { useDesignHistory } from '@/hooks/useDesignHistory'

interface EditorPanelProps {
  blocks: BlockType[]
  setBlocks: (blocks: BlockType[]) => void
  selectedBlock: string | null
}

export function EditorPanel({ blocks, setBlocks, selectedBlock }: EditorPanelProps) {
  const selectedBlockData = blocks.find(block => block.id === selectedBlock)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isImproving, setIsImproving] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'zai' | 'deepseek'>('zai')
  const [activeTab, setActiveTab] = useState<'settings' | 'designs'>('settings')
  
  const { designs, saveDesign, loadDesign, deleteDesign, duplicateDesign } = useDesignHistory()

  const updateBlockContent = (content: any) => {
    if (!selectedBlock) return
    
    const updatedBlocks = blocks.map(block =>
      block.id === selectedBlock ? { ...block, content } : block
    )
    setBlocks(updatedBlocks)
  }

  const deleteSelectedBlock = () => {
    if (!selectedBlock) return
    
    const updatedBlocks = blocks.filter(block => block.id !== selectedBlock)
    setBlocks(updatedBlocks)
  }

  // Handlers para el historial de diseños
  const handleLoadDesign = (id: string) => {
    const designBlocks = loadDesign(id)
    if (designBlocks) {
      setBlocks(designBlocks)
      setActiveTab('settings') // Volver a la pestaña de configuración
    }
  }

  const handleSaveCurrentDesign = (name: string) => {
    saveDesign(blocks, name)
  }

  const handleDeleteDesign = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este diseño?')) {
      deleteDesign(id)
    }
  }

  const handleDuplicateDesign = (id: string) => {
    duplicateDesign(id)
  }

  const handleAIImprove = async () => {
    if (!aiPrompt.trim() || !selectedBlockData) return

    setIsImproving(true)
    try {
      console.log('Sending AI improvement request...')
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Mejora el siguiente contenido para un bloque de tipo ${selectedBlockData.type} con esta instrucción: ${aiPrompt}. Contenido actual: ${JSON.stringify(selectedBlockData.content)}`,
          type: 'content',
          provider: selectedProvider
        })
      })

      console.log('AI improvement response status:', response.status)
      const result = await response.json()
      console.log('AI improvement result:', result)
      
      if (result.success) {
        alert(`Contenido mejorado con ${result.provider === 'deepseek' ? 'DeepSeek' : 'Z-AI'}: ${result.content}`)
        // Aquí podrías parsear el contenido mejorado y aplicarlo al bloque
      } else {
        alert(`Error al mejorar contenido: ${result.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('AI improvement error:', error)
      alert(`Error al conectar con el servicio de IA: ${error.message || 'Error de conexión'}`)
    } finally {
      setIsImproving(false)
    }
  }

  return (
    <div className="w-full max-w-xs border-l border-border bg-background h-screen overflow-hidden flex flex-col">
      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'settings', label: 'Configuraciones', icon: <Settings className="h-4 w-4" /> },
          { id: 'designs', label: 'Mis diseños', icon: <Eye className="h-4 w-4" /> }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Tab de Configuraciones */}
        <TabContent active={activeTab === 'settings'}>
          <div className="h-full overflow-y-auto custom-scrollbar smooth-scroll">
            {!selectedBlockData ? (
              <div className="p-6">
                {/* Indicador visual */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-green-800">Aquí puedes editar</p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Selecciona un bloque en la zona central para personalizar su contenido
                  </p>
                </div>
                
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Selecciona un bloque para editar</p>
                    <p className="text-xs mt-1">Los bloques se configuran aquí</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Indicador visual persistente */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-green-800">Aquí puedes editar</p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Personaliza el contenido y estilos del bloque seleccionado
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Editar Bloque</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedBlockData.type}</Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={deleteSelectedBlock}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Configuración del Bloque</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderEditorFields(selectedBlockData.type, selectedBlockData.content, updateBlockContent)}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estilos del Bloque</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderStyleFields(selectedBlockData.type, selectedBlockData.content, updateBlockContent)}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Asistente IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={selectedProvider} onValueChange={(value: 'zai' | 'deepseek') => setSelectedProvider(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zai">Z-AI (con imágenes)</SelectItem>
                        <SelectItem value="deepseek">DeepSeek (texto)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea 
                      placeholder="Describe cómo quieres mejorar este bloque..."
                      className="text-sm"
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={handleAIImprove}
                      disabled={isImproving || !aiPrompt.trim()}
                    >
                      {isImproving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Mejorar con {selectedProvider === 'deepseek' ? 'DeepSeek' : 'IA'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabContent>

        {/* Tab de Mis Diseños */}
        <TabContent active={activeTab === 'designs'}>
          <div className="h-full overflow-y-auto custom-scrollbar smooth-scroll p-6">
            <DesignHistory
              designs={designs}
              onLoadDesign={handleLoadDesign}
              onDeleteDesign={handleDeleteDesign}
              onDuplicateDesign={handleDuplicateDesign}
              onSaveCurrentDesign={handleSaveCurrentDesign}
              currentBlocksLength={blocks.length}
            />
          </div>
        </TabContent>
      </div>
    </div>
  )
}

function renderEditorFields(type: string, content: any, updateContent: (content: any) => void) {
  switch (type) {
    case 'hero':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateContent({ ...content, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Texto Botón Primario</label>
              <Input
                value={content.primaryButtonText || ''}
                onChange={(e) => updateContent({ ...content, primaryButtonText: e.target.value })}
                className="mt-1"
                placeholder="Empezar Ahora"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL Botón Primario</label>
              <Input
                value={content.primaryButtonLink || ''}
                onChange={(e) => updateContent({ ...content, primaryButtonLink: e.target.value })}
                className="mt-1"
                placeholder="#"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Texto Botón Secundario</label>
              <Input
                value={content.secondaryButtonText || ''}
                onChange={(e) => updateContent({ ...content, secondaryButtonText: e.target.value })}
                className="mt-1"
                placeholder="Explorar Más"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL Botón Secundario</label>
              <Input
                value={content.secondaryButtonLink || ''}
                onChange={(e) => updateContent({ ...content, secondaryButtonLink: e.target.value })}
                className="mt-1"
                placeholder="#"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Imagen de Fondo</label>
            <Input
              value={content.backgroundImage || ''}
              onChange={(e) => updateContent({ ...content, backgroundImage: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {content.backgroundImage && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Vista previa:
                </div>
                <div className="w-full h-20 bg-muted rounded-md overflow-hidden border">
                  {content.backgroundImage.trim() !== '' ? (
                    <img 
                      src={content.backgroundImage} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement
                        if (fallback) {
                          fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      🎨 Se usará gradiente por defecto
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )
    case 'features':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Características</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newFeature = {
                    icon: '⭐',
                    title: 'Nueva Característica',
                    description: 'Descripción de la característica'
                  }
                  updateContent({
                    ...content,
                    features: [...(content.features || []), newFeature]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Característica
              </Button>
            </div>
            {(content.features || []).map((feature, featureIndex) => (
              <Card key={featureIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Característica {featureIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedFeatures = (content.features || []).filter((_, index) => index !== featureIndex)
                        updateContent({ ...content, features: updatedFeatures })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Icono (emoji)</label>
                    <EmojiPicker
                      value={feature.icon || ''}
                      onValueChange={(newIcon) => {
                        const updatedFeatures = [...(content.features || [])]
                        updatedFeatures[featureIndex] = { ...updatedFeatures[featureIndex], icon: newIcon }
                        updateContent({ ...content, features: updatedFeatures })
                      }}
                      placeholder="⭐"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Título</label>
                    <Input
                      value={feature.title || ''}
                      onChange={(e) => {
                        const updatedFeatures = [...(content.features || [])]
                        updatedFeatures[featureIndex] = { ...updatedFeatures[featureIndex], title: e.target.value }
                        updateContent({ ...content, features: updatedFeatures })
                      }}
                      className="mt-1"
                      placeholder="Título de la característica"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Textarea
                      value={feature.description || ''}
                      onChange={(e) => {
                        const updatedFeatures = [...(content.features || [])]
                        updatedFeatures[featureIndex] = { ...updatedFeatures[featureIndex], description: e.target.value }
                        updateContent({ ...content, features: updatedFeatures })
                      }}
                      className="mt-1"
                      rows={2}
                      placeholder="Descripción breve"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'hero-split':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateContent({ ...content, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Texto Botón Primario</label>
              <Input
                value={content.primaryButtonText || ''}
                onChange={(e) => updateContent({ ...content, primaryButtonText: e.target.value })}
                className="mt-1"
                placeholder="Empezar Ahora"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL Botón Primario</label>
              <Input
                value={content.primaryButtonLink || ''}
                onChange={(e) => updateContent({ ...content, primaryButtonLink: e.target.value })}
                className="mt-1"
                placeholder="#"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Texto Botón Secundario</label>
              <Input
                value={content.secondaryButtonText || ''}
                onChange={(e) => updateContent({ ...content, secondaryButtonText: e.target.value })}
                className="mt-1"
                placeholder="Explorar Más"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL Botón Secundario</label>
              <Input
                value={content.secondaryButtonLink || ''}
                onChange={(e) => updateContent({ ...content, secondaryButtonLink: e.target.value })}
                className="mt-1"
                placeholder="#"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Imagen</label>
            <Input
              value={content.image || ''}
              onChange={(e) => updateContent({ ...content, image: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {content.image && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Vista previa:
                </div>
                <div className="w-full h-20 bg-muted rounded-md overflow-hidden border">
                  {content.image.trim() !== '' ? (
                    <img 
                      src={content.image} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement
                        if (fallback) {
                          fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      🖼️ Se usará imagen por defecto
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )
    case 'testimonials':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Testimonios</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newTestimonial = {
                    name: 'Nombre del Cliente',
                    role: 'Cargo',
                    company: 'Empresa',
                    content: 'Excelente servicio, superó todas nuestras expectativas.',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
                  }
                  updateContent({
                    ...content,
                    testimonials: [...(content.testimonials || []), newTestimonial]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Testimonio
              </Button>
            </div>
            {(content.testimonials || []).map((testimonial, testimonialIndex) => (
              <Card key={testimonialIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Testimonio {testimonialIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedTestimonials = (content.testimonials || []).filter((_, index) => index !== testimonialIndex)
                        updateContent({ ...content, testimonials: updatedTestimonials })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Nombre</label>
                      <Input
                        value={testimonial.name || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...(content.testimonials || [])]
                          updatedTestimonials[testimonialIndex] = { ...updatedTestimonials[testimonialIndex], name: e.target.value }
                          updateContent({ ...content, testimonials: updatedTestimonials })
                        }}
                        className="mt-1"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Cargo</label>
                      <Input
                        value={testimonial.role || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...(content.testimonials || [])]
                          updatedTestimonials[testimonialIndex] = { ...updatedTestimonials[testimonialIndex], role: e.target.value }
                          updateContent({ ...content, testimonials: updatedTestimonials })
                        }}
                        className="mt-1"
                        placeholder="CEO, Director, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Empresa</label>
                    <Input
                      value={testimonial.company || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...(content.testimonials || [])]
                        updatedTestimonials[testimonialIndex] = { ...updatedTestimonials[testimonialIndex], company: e.target.value }
                        updateContent({ ...content, testimonials: updatedTestimonials })
                      }}
                      className="mt-1"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Testimonio</label>
                    <Textarea
                      value={testimonial.content || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...(content.testimonials || [])]
                        updatedTestimonials[testimonialIndex] = { ...updatedTestimonials[testimonialIndex], content: e.target.value }
                        updateContent({ ...content, testimonials: updatedTestimonials })
                      }}
                      className="mt-1"
                      rows={3}
                      placeholder="Excelente servicio, superó todas nuestras expectativas."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">URL del Avatar</label>
                    <Input
                      value={testimonial.avatar || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...(content.testimonials || [])]
                        updatedTestimonials[testimonialIndex] = { ...updatedTestimonials[testimonialIndex], avatar: e.target.value }
                        updateContent({ ...content, testimonials: updatedTestimonials })
                      }}
                      className="mt-1"
                      placeholder="https://ejemplo.com/avatar.jpg"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'cta':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateContent({ ...content, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Texto del Botón</label>
            <Input
              value={content.buttonText || ''}
              onChange={(e) => updateContent({ ...content, buttonText: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Enlace del Botón</label>
            <Input
              value={content.buttonLink || ''}
              onChange={(e) => updateContent({ ...content, buttonLink: e.target.value })}
              className="mt-1"
              placeholder="#"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Imagen de Fondo</label>
            <Input
              value={content.backgroundImage || ''}
              onChange={(e) => updateContent({ ...content, backgroundImage: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {content.backgroundImage && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Vista previa:
                </div>
                <div className="w-full h-20 bg-muted rounded-md overflow-hidden border">
                  {content.backgroundImage.trim() !== '' ? (
                    <img 
                      src={content.backgroundImage} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement
                        if (fallback) {
                          fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      🎨 Se usará gradiente por defecto
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )
    case 'footer':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Logo</label>
            <Input
              value={content.logo || ''}
              onChange={(e) => updateContent({ ...content, logo: e.target.value })}
              className="mt-1"
              placeholder="/logo.svg"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nombre de Empresa</label>
            <Input
              value={content.company || ''}
              onChange={(e) => updateContent({ ...content, company: e.target.value })}
              className="mt-1"
              placeholder="Tu Empresa"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateContent({ ...content, description: e.target.value })}
              className="mt-1"
              rows={3}
              placeholder="Descripción breve de tu empresa"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enlaces</label>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newLinkGroup = {
                    title: 'Nuevo Grupo',
                    items: [
                      { text: 'Nuevo Enlace', url: '#' }
                    ]
                  }
                  updateContent({
                    ...content,
                    links: [...(content.links || []), newLinkGroup]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Grupo
              </Button>
            </div>
            {(content.links || []).map((linkGroup, groupIndex) => (
              <Card key={groupIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grupo {groupIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedLinks = (content.links || []).filter((_, index) => index !== groupIndex)
                        updateContent({ ...content, links: updatedLinks })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Título del Grupo</label>
                    <Input
                      value={linkGroup.title || ''}
                      onChange={(e) => {
                        const updatedLinks = [...(content.links || [])]
                        updatedLinks[groupIndex] = { ...updatedLinks[groupIndex], title: e.target.value }
                        updateContent({ ...content, links: updatedLinks })
                      }}
                      className="mt-1"
                      placeholder="Título del grupo"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Enlaces</label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newLink = { text: 'Nuevo Enlace', url: '#' }
                          const updatedLinks = [...(content.links || [])]
                          updatedLinks[groupIndex] = {
                            ...updatedLinks[groupIndex],
                            items: [...(updatedLinks[groupIndex].items || []), newLink]
                          }
                          updateContent({ ...content, links: updatedLinks })
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {(linkGroup.items || []).map((item, itemIndex) => (
                      <div key={itemIndex} className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.text || ''}
                          onChange={(e) => {
                            const updatedLinks = [...(content.links || [])]
                            updatedLinks[groupIndex].items[itemIndex] = {
                              ...updatedLinks[groupIndex].items[itemIndex],
                              text: e.target.value
                            }
                            updateContent({ ...content, links: updatedLinks })
                          }}
                          placeholder="Texto del enlace"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={item.url || ''}
                            onChange={(e) => {
                              const updatedLinks = [...(content.links || [])]
                              updatedLinks[groupIndex].items[itemIndex] = {
                                ...updatedLinks[groupIndex].items[itemIndex],
                                url: e.target.value
                              }
                              updateContent({ ...content, links: updatedLinks })
                            }}
                            placeholder="URL"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const updatedLinks = [...(content.links || [])]
                              updatedLinks[groupIndex].items = updatedLinks[groupIndex].items.filter((_, index) => index !== itemIndex)
                              updateContent({ ...content, links: updatedLinks })
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Redes Sociales</label>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newSocialLink = {
                    platform: 'twitter',
                    url: '#',
                    icon: '🐦'
                  }
                  updateContent({
                    ...content,
                    socialLinks: [...(content.socialLinks || []), newSocialLink]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Red Social
              </Button>
            </div>
            {(content.socialLinks || []).map((socialLink, socialIndex) => (
              <Card key={socialIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Red Social {socialIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedSocialLinks = (content.socialLinks || []).filter((_, index) => index !== socialIndex)
                        updateContent({ ...content, socialLinks: updatedSocialLinks })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Plataforma</label>
                      <Select
                        value={socialLink.platform || ''}
                        onValueChange={(value) => {
                          const updatedSocialLinks = [...(content.socialLinks || [])]
                          updatedSocialLinks[socialIndex] = { ...updatedSocialLinks[socialIndex], platform: value }
                          updateContent({ ...content, socialLinks: updatedSocialLinks })
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Icono (emoji)</label>
                      <EmojiPicker
                        value={socialLink.icon || ''}
                        onValueChange={(newIcon) => {
                          const updatedSocialLinks = [...(content.socialLinks || [])]
                          updatedSocialLinks[socialIndex] = { ...updatedSocialLinks[socialIndex], icon: newIcon }
                          updateContent({ ...content, socialLinks: updatedSocialLinks })
                        }}
                        placeholder="🐦"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">URL</label>
                    <Input
                      value={socialLink.url || ''}
                      onChange={(e) => {
                        const updatedSocialLinks = [...(content.socialLinks || [])]
                        updatedSocialLinks[socialIndex] = { ...updatedSocialLinks[socialIndex], url: e.target.value }
                        updateContent({ ...content, socialLinks: updatedSocialLinks })
                      }}
                      className="mt-1"
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'pricing':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Planes de Precios</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newPlan = {
                    icon: '💎',
                    name: 'Nuevo Plan',
                    price: '$0',
                    period: 'mes',
                    description: 'Descripción del plan',
                    features: ['Característica 1', 'Característica 2'],
                    buttonText: 'Comenzar',
                    buttonLink: '#',
                    featured: false
                  }
                  updateContent({
                    ...content,
                    plans: [...(content.plans || []), newPlan]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Plan
              </Button>
            </div>
            {(content.plans || []).map((plan, planIndex) => (
              <Card key={planIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan {planIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedPlans = (content.plans || []).filter((_, index) => index !== planIndex)
                        updateContent({ ...content, plans: updatedPlans })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Icono (emoji)</label>
                    <EmojiPicker
                      value={plan.icon || ''}
                      onValueChange={(newIcon) => {
                        const updatedPlans = [...(content.plans || [])]
                        updatedPlans[planIndex] = { ...updatedPlans[planIndex], icon: newIcon }
                        updateContent({ ...content, plans: updatedPlans })
                      }}
                      placeholder="💎"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Nombre del Plan</label>
                    <Input
                      value={plan.name || ''}
                      onChange={(e) => {
                        const updatedPlans = [...(content.plans || [])]
                        updatedPlans[planIndex] = { ...updatedPlans[planIndex], name: e.target.value }
                        updateContent({ ...content, plans: updatedPlans })
                      }}
                      className="mt-1"
                      placeholder="Ej: Básico, Pro, Premium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Precio</label>
                      <Input
                        value={plan.price || ''}
                        onChange={(e) => {
                          const updatedPlans = [...(content.plans || [])]
                          updatedPlans[planIndex] = { ...updatedPlans[planIndex], price: e.target.value }
                          updateContent({ ...content, plans: updatedPlans })
                        }}
                        className="mt-1"
                        placeholder="$29"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Período</label>
                      <Input
                        value={plan.period || ''}
                        onChange={(e) => {
                          const updatedPlans = [...(content.plans || [])]
                          updatedPlans[planIndex] = { ...updatedPlans[planIndex], period: e.target.value }
                          updateContent({ ...content, plans: updatedPlans })
                        }}
                        className="mt-1"
                        placeholder="mes"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Input
                      value={plan.description || ''}
                      onChange={(e) => {
                        const updatedPlans = [...(content.plans || [])]
                        updatedPlans[planIndex] = { ...updatedPlans[planIndex], description: e.target.value }
                        updateContent({ ...content, plans: updatedPlans })
                      }}
                      className="mt-1"
                      placeholder="Perfecto para comenzar"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Características (una por línea)</label>
                    <Textarea
                      value={(plan.features || []).join('\n')}
                      onChange={(e) => {
                        const features = e.target.value.split('\n').filter(f => f.trim())
                        const updatedPlans = [...(content.plans || [])]
                        updatedPlans[planIndex] = { ...updatedPlans[planIndex], features }
                        updateContent({ ...content, plans: updatedPlans })
                      }}
                      className="mt-1"
                      rows={3}
                      placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Texto del Botón</label>
                      <Input
                        value={plan.buttonText || ''}
                        onChange={(e) => {
                          const updatedPlans = [...(content.plans || [])]
                          updatedPlans[planIndex] = { ...updatedPlans[planIndex], buttonText: e.target.value }
                          updateContent({ ...content, plans: updatedPlans })
                        }}
                        className="mt-1"
                        placeholder="Comenzar"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Enlace del Botón</label>
                      <Input
                        value={plan.buttonLink || ''}
                        onChange={(e) => {
                          const updatedPlans = [...(content.plans || [])]
                          updatedPlans[planIndex] = { ...updatedPlans[planIndex], buttonLink: e.target.value }
                          updateContent({ ...content, plans: updatedPlans })
                        }}
                        className="mt-1"
                        placeholder="#"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`featured-${planIndex}`}
                      checked={plan.featured || false}
                      onChange={(e) => {
                        const updatedPlans = [...(content.plans || [])]
                        updatedPlans[planIndex] = { ...updatedPlans[planIndex], featured: e.target.checked }
                        updateContent({ ...content, plans: updatedPlans })
                      }}
                      className="rounded"
                    />
                    <label htmlFor={`featured-${planIndex}`} className="text-xs font-medium">
                      Plan Destacado
                    </label>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'stats':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Estadísticas</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newStat = {
                    icon: '📊',
                    value: '100+',
                    label: 'Nueva Estadística'
                  }
                  updateContent({
                    ...content,
                    stats: [...(content.stats || []), newStat]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Estadística
              </Button>
            </div>
            {(content.stats || []).map((stat, statIndex) => (
              <Card key={statIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estadística {statIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedStats = (content.stats || []).filter((_, index) => index !== statIndex)
                        updateContent({ ...content, stats: updatedStats })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Icono (emoji)</label>
                    <EmojiPicker
                      value={stat.icon || ''}
                      onValueChange={(newIcon) => {
                        const updatedStats = [...(content.stats || [])]
                        updatedStats[statIndex] = { ...updatedStats[statIndex], icon: newIcon }
                        updateContent({ ...content, stats: updatedStats })
                      }}
                      placeholder="📊"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Valor</label>
                      <Input
                        value={stat.value || ''}
                        onChange={(e) => {
                          const updatedStats = [...(content.stats || [])]
                          updatedStats[statIndex] = { ...updatedStats[statIndex], value: e.target.value }
                          updateContent({ ...content, stats: updatedStats })
                        }}
                        className="mt-1"
                        placeholder="1000+"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Etiqueta</label>
                      <Input
                        value={stat.label || ''}
                        onChange={(e) => {
                          const updatedStats = [...(content.stats || [])]
                          updatedStats[statIndex] = { ...updatedStats[statIndex], label: e.target.value }
                          updateContent({ ...content, stats: updatedStats })
                        }}
                        className="mt-1"
                        placeholder="Clientes Felices"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'timeline':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Eventos</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newEvent = {
                    icon: '📅',
                    date: '2024',
                    title: 'Nuevo Evento',
                    description: 'Descripción del evento'
                  }
                  updateContent({
                    ...content,
                    events: [...(content.events || []), newEvent]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Evento
              </Button>
            </div>
            {(content.events || []).map((event, eventIndex) => (
              <Card key={eventIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Evento {eventIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedEvents = (content.events || []).filter((_, index) => index !== eventIndex)
                        updateContent({ ...content, events: updatedEvents })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Icono (emoji)</label>
                    <EmojiPicker
                      value={event.icon || ''}
                      onValueChange={(newIcon) => {
                        const updatedEvents = [...(content.events || [])]
                        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], icon: newIcon }
                        updateContent({ ...content, events: updatedEvents })
                      }}
                      placeholder="📅"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Fecha</label>
                    <Input
                      value={event.date || ''}
                      onChange={(e) => {
                        const updatedEvents = [...(content.events || [])]
                        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], date: e.target.value }
                        updateContent({ ...content, events: updatedEvents })
                      }}
                      className="mt-1"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Título</label>
                    <Input
                      value={event.title || ''}
                      onChange={(e) => {
                        const updatedEvents = [...(content.events || [])]
                        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], title: e.target.value }
                        updateContent({ ...content, events: updatedEvents })
                      }}
                      className="mt-1"
                      placeholder="Título del evento"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Textarea
                      value={event.description || ''}
                      onChange={(e) => {
                        const updatedEvents = [...(content.events || [])]
                        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], description: e.target.value }
                        updateContent({ ...content, events: updatedEvents })
                      }}
                      className="mt-1"
                      rows={2}
                      placeholder="Descripción del evento"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'faq':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Preguntas Frecuentes</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newFaq = {
                    question: 'Nueva Pregunta',
                    answer: 'Respuesta a la pregunta'
                  }
                  updateContent({
                    ...content,
                    faqs: [...(content.faqs || []), newFaq]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Pregunta
              </Button>
            </div>
            {(content.faqs || []).map((faq, faqIndex) => (
              <Card key={faqIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pregunta {faqIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedFaqs = (content.faqs || []).filter((_, index) => index !== faqIndex)
                        updateContent({ ...content, faqs: updatedFaqs })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Pregunta</label>
                    <Input
                      value={faq.question || ''}
                      onChange={(e) => {
                        const updatedFaqs = [...(content.faqs || [])]
                        updatedFaqs[faqIndex] = { ...updatedFaqs[faqIndex], question: e.target.value }
                        updateContent({ ...content, faqs: updatedFaqs })
                      }}
                      className="mt-1"
                      placeholder="¿Cómo funciona?"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Respuesta</label>
                    <Textarea
                      value={faq.answer || ''}
                      onChange={(e) => {
                        const updatedFaqs = [...(content.faqs || [])]
                        updatedFaqs[faqIndex] = { ...updatedFaqs[faqIndex], answer: e.target.value }
                        updateContent({ ...content, faqs: updatedFaqs })
                      }}
                      className="mt-1"
                      rows={3}
                      placeholder="Nuestra plataforma es muy fácil de usar..."
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'process':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pasos</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newStep = {
                    icon: '⭐',
                    title: 'Nuevo Paso',
                    description: 'Descripción del paso'
                  }
                  updateContent({
                    ...content,
                    steps: [...(content.steps || []), newStep]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Paso
              </Button>
            </div>
            {(content.steps || []).map((step, stepIndex) => (
              <Card key={stepIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Paso {stepIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedSteps = (content.steps || []).filter((_, index) => index !== stepIndex)
                        updateContent({ ...content, steps: updatedSteps })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Icono (emoji)</label>
                    <EmojiPicker
                      value={step.icon || ''}
                      onValueChange={(newIcon) => {
                        const updatedSteps = [...(content.steps || [])]
                        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], icon: newIcon }
                        updateContent({ ...content, steps: updatedSteps })
                      }}
                      placeholder="⭐"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Título</label>
                    <Input
                      value={step.title || ''}
                      onChange={(e) => {
                        const updatedSteps = [...(content.steps || [])]
                        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], title: e.target.value }
                        updateContent({ ...content, steps: updatedSteps })
                      }}
                      className="mt-1"
                      placeholder="Título del paso"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Textarea
                      value={step.description || ''}
                      onChange={(e) => {
                        const updatedSteps = [...(content.steps || [])]
                        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], description: e.target.value }
                        updateContent({ ...content, steps: updatedSteps })
                      }}
                      className="mt-1"
                      rows={3}
                      placeholder="Descripción detallada del paso"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'image':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateContent({ ...content, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium">URL de la Imagen</label>
            <Input
              value={content.image || ''}
              onChange={(e) => updateContent({ ...content, image: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {content.image && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Vista previa:
                </div>
                <div className="w-full h-32 bg-muted rounded-md overflow-hidden border">
                  {content.image.trim() !== '' ? (
                    <img 
                      src={content.image} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement
                        if (fallback) {
                          fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      🖼️ Ingresa una URL para ver la vista previa
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Texto Alternativo (ALT)</label>
            <Input
              value={content.alt || ''}
              onChange={(e) => updateContent({ ...content, alt: e.target.value })}
              className="mt-1"
              placeholder="Descripción de la imagen para accesibilidad"
            />
          </div>
        </>
      )
    case 'product-cart':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Número de WhatsApp</label>
            <Input
              value={content.whatsappNumber || ''}
              onChange={(e) => updateContent({ ...content, whatsappNumber: e.target.value })}
              className="mt-1"
              placeholder="+5491130190242"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ejemplo: +5491130190242 (con código de país)
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Productos</label>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newProduct = {
                    id: `product-${Date.now()}`,
                    name: 'Nuevo Producto',
                    description: 'Descripción del producto',
                    price: 99.99,
                    currency: 'USD',
                    image: '',
                    category: 'General',
                    inStock: true,
                    features: ['Característica 1', 'Característica 2']
                  }
                  updateContent({
                    ...content,
                    products: [...(content.products || []), newProduct]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Producto
              </Button>
            </div>
            {(content.products || []).map((product, productIndex) => (
              <Card key={productIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Producto {productIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedProducts = (content.products || []).filter((_, index) => index !== productIndex)
                        updateContent({ ...content, products: updatedProducts })
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium">Nombre</label>
                      <Input
                        value={product.name || ''}
                        onChange={(e) => {
                          const updatedProducts = [...(content.products || [])]
                          updatedProducts[productIndex] = { ...updatedProducts[productIndex], name: e.target.value }
                          updateContent({ ...content, products: updatedProducts })
                        }}
                        className="mt-1"
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Categoría</label>
                      <Input
                        value={product.category || ''}
                        onChange={(e) => {
                          const updatedProducts = [...(content.products || [])]
                          updatedProducts[productIndex] = { ...updatedProducts[productIndex], category: e.target.value }
                          updateContent({ ...content, products: updatedProducts })
                        }}
                        className="mt-1"
                        placeholder="Categoría"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Textarea
                      value={product.description || ''}
                      onChange={(e) => {
                        const updatedProducts = [...(content.products || [])]
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], description: e.target.value }
                        updateContent({ ...content, products: updatedProducts })
                      }}
                      className="mt-1"
                      rows={2}
                      placeholder="Descripción breve"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium">Precio</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={product.price || 0}
                        onChange={(e) => {
                          const updatedProducts = [...(content.products || [])]
                          updatedProducts[productIndex] = { ...updatedProducts[productIndex], price: parseFloat(e.target.value) || 0 }
                          updateContent({ ...content, products: updatedProducts })
                        }}
                        className="mt-1"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Moneda</label>
                      <Input
                        value={product.currency || ''}
                        onChange={(e) => {
                          const updatedProducts = [...(content.products || [])]
                          updatedProducts[productIndex] = { ...updatedProducts[productIndex], currency: e.target.value }
                          updateContent({ ...content, products: updatedProducts })
                        }}
                        className="mt-1"
                        placeholder="USD"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Stock</label>
                      <select
                        value={product.inStock ? 'true' : 'false'}
                        onChange={(e) => {
                          const updatedProducts = [...(content.products || [])]
                          updatedProducts[productIndex] = { ...updatedProducts[productIndex], inStock: e.target.value === 'true' }
                          updateContent({ ...content, products: updatedProducts })
                        }}
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md text-sm"
                      >
                        <option value="true">En stock</option>
                        <option value="false">Agotado</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">URL de la imagen</label>
                    <Input
                      value={product.image || ''}
                      onChange={(e) => {
                        const updatedProducts = [...(content.products || [])]
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], image: e.target.value }
                        updateContent({ ...content, products: updatedProducts })
                      }}
                      className="mt-1"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Características (separadas por comas)</label>
                    <Input
                      value={product.features ? product.features.join(', ') : ''}
                      onChange={(e) => {
                        const features = e.target.value.split(',').map(f => f.trim()).filter(f => f)
                        const updatedProducts = [...(content.products || [])]
                        updatedProducts[productIndex] = { ...updatedProducts[productIndex], features }
                        updateContent({ ...content, products: updatedProducts })
                      }}
                      className="mt-1"
                      placeholder="Característica 1, Característica 2, Característica 3"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'product-features':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          
          {/* Imagen Central */}
          <div>
            <label className="text-sm font-medium">Imagen Central</label>
            <Input
              value={content.centerImage || ''}
              onChange={(e) => updateContent({ ...content, centerImage: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <div className="mt-2">
              <label className="text-xs font-medium">Texto Alternativo</label>
              <Input
                value={content.centerImageAlt || ''}
                onChange={(e) => updateContent({ ...content, centerImageAlt: e.target.value })}
                className="mt-1"
                placeholder="Descripción de la imagen"
              />
            </div>
            {content.centerImage && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">Vista previa:</div>
                <div className="w-full h-20 bg-muted rounded-md overflow-hidden border">
                  <img 
                    src={content.centerImage} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget.parentElement
                      if (fallback) {
                        fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items Izquierdos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Items Izquierdos</label>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newItem = {
                    id: `left-item-${Date.now()}`,
                    icon: '⭐',
                    title: 'Nuevo Item',
                    description: 'Descripción del item'
                  }
                  updateContent({
                    ...content,
                    leftItems: [...(content.leftItems || []), newItem]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {(content.leftItems || []).map((item, itemIndex) => (
              <Card key={itemIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Item {itemIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedItems = (content.leftItems || []).filter((_, index) => index !== itemIndex)
                        updateContent({ ...content, leftItems: updatedItems })
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium">Icono</label>
                      <Input
                        value={item.icon || ''}
                        onChange={(e) => {
                          const updatedItems = [...(content.leftItems || [])]
                          updatedItems[itemIndex] = { ...updatedItems[itemIndex], icon: e.target.value }
                          updateContent({ ...content, leftItems: updatedItems })
                        }}
                        className="mt-1"
                        placeholder="⭐"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium">Título</label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => {
                          const updatedItems = [...(content.leftItems || [])]
                          updatedItems[itemIndex] = { ...updatedItems[itemIndex], title: e.target.value }
                          updateContent({ ...content, leftItems: updatedItems })
                        }}
                        className="mt-1"
                        placeholder="Título del item"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedItems = [...(content.leftItems || [])]
                        updatedItems[itemIndex] = { ...updatedItems[itemIndex], description: e.target.value }
                        updateContent({ ...content, leftItems: updatedItems })
                      }}
                      className="mt-1"
                      rows={2}
                      placeholder="Descripción breve"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Items Derechos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Items Derechos</label>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newItem = {
                    id: `right-item-${Date.now()}`,
                    icon: '⭐',
                    title: 'Nuevo Item',
                    description: 'Descripción del item'
                  }
                  updateContent({
                    ...content,
                    rightItems: [...(content.rightItems || []), newItem]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {(content.rightItems || []).map((item, itemIndex) => (
              <Card key={itemIndex} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Item {itemIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedItems = (content.rightItems || []).filter((_, index) => index !== itemIndex)
                        updateContent({ ...content, rightItems: updatedItems })
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium">Icono</label>
                      <Input
                        value={item.icon || ''}
                        onChange={(e) => {
                          const updatedItems = [...(content.rightItems || [])]
                          updatedItems[itemIndex] = { ...updatedItems[itemIndex], icon: e.target.value }
                          updateContent({ ...content, rightItems: updatedItems })
                        }}
                        className="mt-1"
                        placeholder="⭐"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium">Título</label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => {
                          const updatedItems = [...(content.rightItems || [])]
                          updatedItems[itemIndex] = { ...updatedItems[itemIndex], title: e.target.value }
                          updateContent({ ...content, rightItems: updatedItems })
                        }}
                        className="mt-1"
                        placeholder="Título del item"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Descripción</label>
                    <Textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedItems = [...(content.rightItems || [])]
                        updatedItems[itemIndex] = { ...updatedItems[itemIndex], description: e.target.value }
                        updateContent({ ...content, rightItems: updatedItems })
                      }}
                      className="mt-1"
                      rows={2}
                      placeholder="Descripción breve"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Botón */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Texto del Botón</label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => updateContent({ ...content, buttonText: e.target.value })}
                className="mt-1"
                placeholder="Ir al producto"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Enlace del Botón</label>
              <Input
                value={content.buttonLink || ''}
                onChange={(e) => updateContent({ ...content, buttonLink: e.target.value })}
                className="mt-1"
                placeholder="#"
              />
            </div>
          </div>
        </>
      )
    case 'whatsapp-contact':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
              placeholder="¿Querés hablar con nosotros?"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={content.description || ''}
              onChange={(e) => updateContent({ ...content, description: e.target.value })}
              className="mt-1"
              rows={3}
              placeholder="Respondemos tus consultas por WhatsApp de lunes a viernes de 9 a 18 hs."
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Número de WhatsApp</label>
            <Input
              value={content.whatsappNumber || ''}
              onChange={(e) => updateContent({ ...content, whatsappNumber: e.target.value })}
              className="mt-1"
              placeholder="+5491122334455"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ejemplo: +5491122334455 (con código de país)
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Mensaje por Defecto</label>
            <Input
              value={content.defaultMessage || ''}
              onChange={(e) => updateContent({ ...content, defaultMessage: e.target.value })}
              className="mt-1"
              placeholder="Necesito hablar con ustedes"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Este mensaje se enviará automáticamente al hacer clic en el botón
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Texto del Botón</label>
            <Input
              value={content.buttonText || ''}
              onChange={(e) => updateContent({ ...content, buttonText: e.target.value })}
              className="mt-1"
              placeholder="Necesito hablar con ustedes"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Imagen Lateral</label>
            <Input
              value={content.leftImage || ''}
              onChange={(e) => updateContent({ ...content, leftImage: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <div className="mt-2">
              <label className="text-xs font-medium">Texto Alternativo</label>
              <Input
                value={content.leftImageAlt || ''}
                onChange={(e) => updateContent({ ...content, leftImageAlt: e.target.value })}
                className="mt-1"
                placeholder="Descripción de la imagen"
              />
            </div>
            {content.leftImage && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">Vista previa:</div>
                <div className="w-full h-20 bg-muted rounded-md overflow-hidden border">
                  <img 
                    src={content.leftImage} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget.parentElement
                      if (fallback) {
                        fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )
    case 'social-media':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Posición del Botón</label>
            <Select
              value={content.buttonPosition || 'right'}
              onValueChange={(value: 'right' | 'left') => updateContent({ ...content, buttonPosition: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Derecha</SelectItem>
                <SelectItem value="left">Izquierda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Margen desde el Borde (px)</label>
            <Input
              type="number"
              value={content.buttonMargin || 20}
              onChange={(e) => updateContent({ ...content, buttonMargin: parseInt(e.target.value) || 20 })}
              className="mt-1"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Color del Botón</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { name: 'Azul', value: '#3b82f6' },
                { name: 'Verde', value: '#10b981' },
                { name: 'Rojo', value: '#ef4444' },
                { name: 'Morado', value: '#8b5cf6' },
                { name: 'Naranja', value: '#f97316' },
                { name: 'Rosa', value: '#ec4899' }
              ].map((color) => (
                <button
                  key={color.value}
                  className={`p-2 rounded border text-xs ${
                    (content.buttonColor || '#3b82f6') === color.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                      : 'border-border hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => updateContent({ ...content, buttonColor: color.value })}
                  style={{ backgroundColor: color.value + '20' }}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Tipo de Animación</label>
            <Select
              value={content.animationType || 'vertical'}
              onValueChange={(value: 'vertical' | 'radial') => updateContent({ ...content, animationType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Redes Sociales</label>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newNetwork = {
                    id: Date.now().toString(),
                    name: 'Nueva Red',
                    icon: '🌐',
                    url: 'https://',
                    order: (content.socialNetworks || []).length
                  }
                  updateContent({
                    ...content,
                    socialNetworks: [...(content.socialNetworks || []), newNetwork]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Red
              </Button>
            </div>
            
            {(content.socialNetworks || []).map((network, networkIndex) => (
              <Card key={network.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Red {networkIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedNetworks = (content.socialNetworks || []).filter((_, index) => index !== networkIndex)
                        updateContent({ ...content, socialNetworks: updatedNetworks })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Nombre</label>
                    <Input
                      value={network.name || ''}
                      onChange={(e) => {
                        const updatedNetworks = [...(content.socialNetworks || [])]
                        updatedNetworks[networkIndex] = { ...updatedNetworks[networkIndex], name: e.target.value }
                        updateContent({ ...content, socialNetworks: updatedNetworks })
                      }}
                      className="mt-1"
                      placeholder="Facebook, Instagram, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Icono (emoji)</label>
                    <EmojiPicker
                      value={network.icon || ''}
                      onValueChange={(newIcon) => {
                        const updatedNetworks = [...(content.socialNetworks || [])]
                        updatedNetworks[networkIndex] = { ...updatedNetworks[networkIndex], icon: newIcon }
                        updateContent({ ...content, socialNetworks: updatedNetworks })
                      }}
                      placeholder="🌐"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">URL</label>
                    <Input
                      value={network.url || ''}
                      onChange={(e) => {
                        const updatedNetworks = [...(content.socialNetworks || [])]
                        updatedNetworks[networkIndex] = { ...updatedNetworks[networkIndex], url: e.target.value }
                        updateContent({ ...content, socialNetworks: updatedNetworks })
                      }}
                      className="mt-1"
                      placeholder="https://facebook.com/tu-pagina"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Orden</label>
                    <Input
                      type="number"
                      value={network.order || 0}
                      onChange={(e) => {
                        const updatedNetworks = [...(content.socialNetworks || [])]
                        updatedNetworks[networkIndex] = { ...updatedNetworks[networkIndex], order: parseInt(e.target.value) || 0 }
                        updateContent({ ...content, socialNetworks: updatedNetworks })
                      }}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )
    case 'hero-slide':
      return (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Slides</label>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  const newSlide = {
                    id: Date.now().toString(),
                    backgroundImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
                    title: 'Nuevo Slide',
                    subtitle: 'Subtítulo del slide',
                    buttonText: 'Acción',
                    buttonType: 'external' as const,
                    buttonTarget: '#',
                    textColor: 'light' as const,
                    imageFilter: 'none' as const
                  }
                  updateContent({
                    ...content,
                    slides: [...(content.slides || []), newSlide]
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Slide
              </Button>
            </div>
            
            {(content.slides || []).map((slide, slideIndex) => (
              <Card key={slide.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Slide {slideIndex + 1}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const updatedSlides = (content.slides || []).filter((_, index) => index !== slideIndex)
                        updateContent({ ...content, slides: updatedSlides })
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Imagen de Fondo</label>
                    <Input
                      value={slide.backgroundImage || ''}
                      onChange={(e) => {
                        const updatedSlides = [...(content.slides || [])]
                        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], backgroundImage: e.target.value }
                        updateContent({ ...content, slides: updatedSlides })
                      }}
                      className="mt-1"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Título</label>
                    <Input
                      value={slide.title || ''}
                      onChange={(e) => {
                        const updatedSlides = [...(content.slides || [])]
                        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], title: e.target.value }
                        updateContent({ ...content, slides: updatedSlides })
                      }}
                      className="mt-1"
                      placeholder="Título principal"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Subtítulo</label>
                    <Textarea
                      value={slide.subtitle || ''}
                      onChange={(e) => {
                        const updatedSlides = [...(content.slides || [])]
                        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], subtitle: e.target.value }
                        updateContent({ ...content, slides: updatedSlides })
                      }}
                      className="mt-1"
                      rows={2}
                      placeholder="Subtítulo descriptivo"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Texto del Botón</label>
                    <Input
                      value={slide.buttonText || ''}
                      onChange={(e) => {
                        const updatedSlides = [...(content.slides || [])]
                        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], buttonText: e.target.value }
                        updateContent({ ...content, slides: updatedSlides })
                      }}
                      className="mt-1"
                      placeholder="Ver más"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Tipo de Botón</label>
                      <Select
                        value={slide.buttonType || 'external'}
                        onValueChange={(value: 'external' | 'internal' | 'block') => {
                          const updatedSlides = [...(content.slides || [])]
                          updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], buttonType: value }
                          updateContent({ ...content, slides: updatedSlides })
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="external">URL Externa</SelectItem>
                          <SelectItem value="internal">Página Interna</SelectItem>
                          <SelectItem value="block">Bloque del Sitio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium">Destino</label>
                      <Input
                        value={slide.buttonTarget || ''}
                        onChange={(e) => {
                          const updatedSlides = [...(content.slides || [])]
                          updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], buttonTarget: e.target.value }
                          updateContent({ ...content, slides: updatedSlides })
                        }}
                        className="mt-1"
                        placeholder="https://ejemplo.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Color de Texto</label>
                      <Select
                        value={slide.textColor || 'light'}
                        onValueChange={(value: 'light' | 'dark' | 'custom') => {
                          const updatedSlides = [...(content.slides || [])]
                          updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], textColor: value }
                          updateContent({ ...content, slides: updatedSlides })
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium">Filtro de Imagen</label>
                      <Select
                        value={slide.imageFilter || 'none'}
                        onValueChange={(value: 'none' | 'blur' | 'shadow' | 'gradient') => {
                          const updatedSlides = [...(content.slides || [])]
                          updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], imageFilter: value }
                          updateContent({ ...content, slides: updatedSlides })
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                          <SelectItem value="blur">Desenfoque</SelectItem>
                          <SelectItem value="shadow">Sombra</SelectItem>
                          <SelectItem value="gradient">Degradado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div>
            <label className="text-sm font-medium">Estilo de Navegación</label>
            <Select
              value={content.navigationStyle || 'arrows'}
              onValueChange={(value: 'arrows' | 'dots' | 'progress') => updateContent({ ...content, navigationStyle: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrows">Flechas Laterales</SelectItem>
                <SelectItem value="dots">Bolitas Inferiores</SelectItem>
                <SelectItem value="progress">Línea de Progreso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Transición</label>
              <Select
                value={content.transitionType || 'fade'}
                onValueChange={(value: 'fade' | 'slide' | 'parallax' | 'zoom') => updateContent({ ...content, transitionType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Desvanecimiento</SelectItem>
                  <SelectItem value="slide">Deslizamiento</SelectItem>
                  <SelectItem value="parallax">Parallax</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Velocidad (ms)</label>
              <Input
                type="number"
                value={content.transitionSpeed || 500}
                onChange={(e) => updateContent({ ...content, transitionSpeed: parseInt(e.target.value) || 500 })}
                className="mt-1"
                min="100"
                max="2000"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Altura</label>
              <Select
                value={content.height || 'viewport'}
                onValueChange={(value: 'fixed' | 'viewport') => updateContent({ ...content, height: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewport">Toda la Pantalla</SelectItem>
                  <SelectItem value="fixed">Altura Fija</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {content.height === 'fixed' && (
              <div>
                <label className="text-sm font-medium">Altura Fija (px)</label>
                <Input
                  type="number"
                  value={content.fixedHeight || 600}
                  onChange={(e) => updateContent({ ...content, fixedHeight: parseInt(e.target.value) || 600 })}
                  className="mt-1"
                  min="200"
                  max="1200"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Margen Superior (px)</label>
              <Input
                type="number"
                value={content.marginTop || 0}
                onChange={(e) => updateContent({ ...content, marginTop: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="0"
                max="200"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Margen Inferior (px)</label>
              <Input
                type="number"
                value={content.marginBottom || 0}
                onChange={(e) => updateContent({ ...content, marginBottom: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="0"
                max="200"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoplay"
                checked={content.autoPlay || false}
                onChange={(e) => updateContent({ ...content, autoPlay: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="autoplay" className="text-sm font-medium">Auto-reproducción</label>
            </div>
            
            {content.autoPlay && (
              <div>
                <label className="text-sm font-medium">Intervalo (ms)</label>
                <Input
                  type="number"
                  value={content.autoPlayInterval || 5000}
                  onChange={(e) => updateContent({ ...content, autoPlayInterval: parseInt(e.target.value) || 5000 })}
                  className="mt-1"
                  min="1000"
                  max="30000"
                />
              </div>
            )}
          </div>
        </>
      )
    case 'youtube':
      return (
        <>
          {/* Configuración Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configuración Básica
            </h3>
            
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                value={content.title || ''}
                onChange={(e) => updateContent({ ...content, title: e.target.value })}
                className="mt-1"
                placeholder="Título del video"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => updateContent({ ...content, description: e.target.value })}
                className="mt-1"
                rows={2}
                placeholder="Descripción breve del video"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">URL del Video</label>
              <div className="flex gap-2">
                <Input
                  value={content.videoUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value
                    // Extract video ID from URL
                    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
                    const match = url.match(regex)
                    const videoId = match ? match[1] : ''
                    updateContent({ 
                      ...content, 
                      videoUrl: url,
                      videoId: videoId
                    })
                  }}
                  className="mt-1 flex-1"
                  placeholder="https://www.youtube.com/watch?v=xxxxxx"
                />
                <Button 
                  size="sm" 
                  className="mt-1"
                  onClick={() => {
                    // Validate URL
                    const url = content.videoUrl
                    console.log('🔍 Validating URL:', url)
                    
                    if (!url || !url.trim()) {
                      alert('❌ Por favor, ingresa una URL de YouTube')
                      return
                    }
                    
                    // Multiple regex patterns for different YouTube URL formats
                    const regexes = [
                      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
                      /(?:youtube\.com\/watch\?.*?v=)([^&\n?#]+)/
                    ]
                    
                    let isValid = false
                    let videoId = ''
                    
                    for (const regex of regexes) {
                      const match = url.match(regex)
                      if (match && match[1]) {
                        isValid = true
                        videoId = match[1]
                        break
                      }
                    }
                    
                    if (isValid) {
                      alert(`✅ URL válida\nVideo ID: ${videoId}\n\nEl video debería mostrarse correctamente.`)
                    } else {
                      alert('❌ URL inválida\n\nPor favor, ingresa una URL válida de YouTube como:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n• https://www.youtube.com/shorts/VIDEO_ID')
                    }
                  }}
                >
                  Validar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                El sistema convertirá automáticamente al formato embed
              </p>
            </div>
          </div>

          {/* Configuraciones de Reproducción */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Configuraciones de Reproducción
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoPlay"
                  checked={content.controls?.autoPlay || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      autoPlay: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="autoPlay" className="text-sm">🔁 Reproducción automática</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="loop"
                  checked={content.controls?.loop || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      loop: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="loop" className="text-sm">🔁 Repetir video</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hideControls"
                  checked={content.controls?.hideControls || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      hideControls: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="hideControls" className="text-sm">⛔ Ocultar controles</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hideTitle"
                  checked={content.controls?.hideTitle || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      hideTitle: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="hideTitle" className="text-sm">⛔ Ocultar información del video</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="muteOnStart"
                  checked={content.controls?.muteOnStart || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      muteOnStart: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="muteOnStart" className="text-sm">🔇 Silenciar al inicio</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showRelatedVideos"
                  checked={content.controls?.showRelatedVideos || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      showRelatedVideos: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="showRelatedVideos" className="text-sm">📺 Mostrar videos relacionados</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="modestBranding"
                  checked={content.controls?.modestBranding || false}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    controls: { 
                      ...content.controls, 
                      modestBranding: e.target.checked 
                    }
                  })}
                  className="rounded"
                />
                <label htmlFor="modestBranding" className="text-sm">🎯 Modo modesto</label>
              </div>
            </div>
          </div>

          {/* Configuraciones de Visualización */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Configuraciones de Visualización
            </h3>
            
            <div>
              <label className="text-sm font-medium">Modo Visual</label>
              <Select 
                value={content.visualMode || 'light'} 
                onValueChange={(value) => updateContent({ ...content, visualMode: value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">💡 Claro</SelectItem>
                  <SelectItem value="dark">🌑 Oscuro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tamaño del Reproductor</label>
              <Select 
                value={content.size?.preset || 'medium'} 
                onValueChange={(value) => updateContent({ 
                  ...content, 
                  size: { 
                    ...content.size, 
                    preset: value 
                  }
                })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">📱 Pequeño (240px)</SelectItem>
                  <SelectItem value="medium">💻 Mediano (400px)</SelectItem>
                  <SelectItem value="large">🖥️ Grande (600px)</SelectItem>
                  <SelectItem value="custom">⚙️ Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {content.size?.preset === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Altura</label>
                  <Input
                    type="number"
                    value={content.size?.height || '400'}
                    onChange={(e) => updateContent({ 
                      ...content, 
                      size: { 
                        ...content.size, 
                        height: e.target.value 
                      }
                    })}
                    className="mt-1"
                    min="200"
                    max="1000"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium">Unidad</label>
                  <Select 
                    value={content.size?.heightUnit || 'px'} 
                    onValueChange={(value) => updateContent({ 
                      ...content, 
                      size: { 
                        ...content.size, 
                        heightUnit: value 
                      }
                    })}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="px">px</SelectItem>
                      <SelectItem value="vh">vh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Alineación</label>
              <Select 
                value={content.alignment || 'center'} 
                onValueChange={(value) => updateContent({ ...content, alignment: value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">📍 Centro</SelectItem>
                  <SelectItem value="left">⬅️ Izquierda</SelectItem>
                  <SelectItem value="right">➡️ Derecha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Margen Superior (px)</label>
                <Input
                  type="number"
                  value={content.size?.marginTop || 0}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    size: { 
                      ...content.size, 
                      marginTop: parseInt(e.target.value) || 0 
                    }
                  })}
                  className="mt-1"
                  min="0"
                  max="200"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Margen Inferior (px)</label>
                <Input
                  type="number"
                  value={content.size?.marginBottom || 0}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    size: { 
                      ...content.size, 
                      marginBottom: parseInt(e.target.value) || 0 
                    }
                  })}
                  className="mt-1"
                  min="0"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* Configuraciones Avanzadas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Settings2 className="h-5 w-5 mr-2" />
              Configuraciones Avanzadas
            </h3>
            
            <div>
              <label className="text-sm font-medium">Inicio en tiempo específico (segundos)</label>
              <Input
                type="number"
                value={content.advanced?.startTime || 0}
                onChange={(e) => updateContent({ 
                  ...content, 
                  advanced: { 
                    ...content.advanced, 
                    startTime: parseInt(e.target.value) || 0 
                  }
                })}
                className="mt-1"
                min="0"
                max="3600"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Idioma del Reproductor</label>
              <Select 
                value={content.advanced?.language || 'es'} 
                onValueChange={(value) => updateContent({ 
                  ...content, 
                  advanced: { 
                    ...content.advanced, 
                    language: value 
                  }
                })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="pt">🇵🇹 Português</SelectItem>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                  <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                  <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                  <SelectItem value="zh">🇨🇳 中文</SelectItem>
                  <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                  <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botoneras de Control */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Button className="h-5 w-5 mr-2" />
              Acciones
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  // Preview functionality
                  alert('🎬 Vista previa del video configurada')
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Previsualizar
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Reset to defaults
                  updateContent({
                    ...content,
                    controls: {
                      hideControls: false,
                      hideTitle: false,
                      autoPlay: false,
                      muteOnStart: true,
                      loop: false,
                      showRelatedVideos: false,
                      modestBranding: true
                    },
                    size: {
                      preset: 'medium',
                      height: '400',
                      heightUnit: 'px',
                      marginTop: 0,
                      marginBottom: 0
                    },
                    alignment: 'center',
                    advanced: {
                      startTime: 0,
                      language: 'es'
                    }
                  })
                  alert('🔄 Configuración restablecida')
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restablecer
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Close panel functionality
                  if (onClose) onClose()
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cerrar
              </Button>
            </div>
          </div>
        </>
      )
    case 'countdown':
      return (
        <>
          {/* Configuración Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configuración Básica
            </h3>
            
            <div>
              <label className="text-sm font-medium">Título Principal</label>
              <Input
                value={content.title || ''}
                onChange={(e) => updateContent({ ...content, title: e.target.value })}
                className="mt-1"
                placeholder="30% OFF"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Subtítulo</label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
                className="mt-1"
                placeholder="Friends & Fam Finale"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Fecha y Hora de Finalización</label>
              <Input
                type="datetime-local"
                value={content.endDate ? new Date(content.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  updateContent({ ...content, endDate: date.toISOString() })
                }}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El temporizador se detendrá en esta fecha y hora
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Imagen de Fondo (opcional)</label>
              <Input
                value={content.backgroundImage || ''}
                onChange={(e) => updateContent({ ...content, backgroundImage: e.target.value })}
                className="mt-1"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          {/* Configuración del Botón */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Button className="h-5 w-5 mr-2" />
              Configuración del Botón
            </h3>
            
            <div>
              <label className="text-sm font-medium">Texto del Botón</label>
              <Input
                value={content.button?.text || ''}
                onChange={(e) => updateContent({ 
                  ...content, 
                  button: { 
                    ...content.button, 
                    text: e.target.value 
                  }
                })}
                className="mt-1"
                placeholder="SHOP NOW"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Enlace del Botón</label>
              <Input
                value={content.button?.link || ''}
                onChange={(e) => updateContent({ 
                  ...content, 
                  button: { 
                    ...content.button, 
                    link: e.target.value 
                  }
                })}
                className="mt-1"
                placeholder="https://ejemplo.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Tipo de Enlace</label>
              <Select 
                value={content.button?.linkType || 'external'} 
                onValueChange={(value) => updateContent({ 
                  ...content, 
                  button: { 
                    ...content.button, 
                    linkType: value 
                  }
                })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">🌐 URL Externa</SelectItem>
                  <SelectItem value="internal">📄 Página Interna</SelectItem>
                  <SelectItem value="block">🎯 Bloque del Sitio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Color del Botón</label>
                <Input
                  type="color"
                  value={content.button?.color || '#ffffff'}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    button: { 
                      ...content.button, 
                      color: e.target.value 
                    }
                  })}
                  className="mt-1 h-10"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Color Hover</label>
                <Input
                  type="color"
                  value={content.button?.hoverColor || '#f3f4f6'}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    button: { 
                      ...content.button, 
                      hoverColor: e.target.value 
                    }
                  })}
                  className="mt-1 h-10"
                />
              </div>
            </div>
          </div>

          {/* Configuración del Temporizador */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              ⏰ Configuración del Temporizador
            </h3>
            
            <div>
              <label className="text-sm font-medium">Estilo del Temporizador</label>
              <Select 
                value={content.timerStyle || 'digital'} 
                onValueChange={(value) => updateContent({ ...content, timerStyle: value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">🔢 Digital</SelectItem>
                  <SelectItem value="classic">🎨 Clásico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Alineación del Contenido</label>
              <Select 
                value={content.alignment || 'center'} 
                onValueChange={(value) => updateContent({ ...content, alignment: value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">📍 Centro</SelectItem>
                  <SelectItem value="left">⬅️ Izquierda</SelectItem>
                  <SelectItem value="right">➡️ Derecha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Color Números</label>
                <Input
                  type="color"
                  value={content.timerColors?.numbers || '#ffffff'}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    timerColors: { 
                      ...content.timerColors, 
                      numbers: e.target.value 
                    }
                  })}
                  className="mt-1 h-10"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Color Etiquetas</label>
                <Input
                  type="color"
                  value={content.timerColors?.labels || '#ffffff'}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    timerColors: { 
                      ...content.timerColors, 
                      labels: e.target.value 
                    }
                  })}
                  className="mt-1 h-10"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Color Fondo</label>
                <Input
                  type="color"
                  value={content.timerColors?.background || '#00000033'}
                  onChange={(e) => updateContent({ 
                    ...content, 
                    timerColors: { 
                      ...content.timerColors, 
                      background: e.target.value 
                    }
                  })}
                  className="mt-1 h-10"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Expiración */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              ⏰ Configuración de Expiración
            </h3>
            
            <div>
              <label className="text-sm font-medium">Acción al Expirar</label>
              <Select 
                value={content.expiredAction || 'show-message'} 
                onValueChange={(value) => updateContent({ ...content, expiredAction: value })}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hide">🙈 Ocultar Bloque</SelectItem>
                  <SelectItem value="show-message">💬 Mostrar Mensaje</SelectItem>
                  <SelectItem value="change-color">🎨 Cambiar Color</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {content.expiredAction === 'show-message' && (
              <div>
                <label className="text-sm font-medium">Mensaje de Expiración</label>
                <Input
                  value={content.expiredMessage || 'La promoción ha finalizado'}
                  onChange={(e) => updateContent({ ...content, expiredMessage: e.target.value })}
                  className="mt-1"
                  placeholder="La promoción ha finalizado"
                />
              </div>
            )}
          </div>
        </>
      )
    case 'hero-banner':
      return (
        <>
          <div>
            <label className="text-sm font-medium">Imagen de Fondo</label>
            <Input
              value={content.backgroundImage || ''}
              onChange={(e) => updateContent({ ...content, backgroundImage: e.target.value })}
              className="mt-1"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {content.backgroundImage && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Vista previa:
                </div>
                <div className="w-full h-20 bg-muted rounded-md overflow-hidden border">
                  {content.backgroundImage.trim() !== '' ? (
                    <img 
                      src={content.backgroundImage} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement
                        if (fallback) {
                          fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      🎨 Se usará gradiente por defecto
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium">Título Principal</label>
            <Input
              value={content.title || ''}
              onChange={(e) => updateContent({ ...content, title: e.target.value })}
              className="mt-1"
              placeholder="UP TO 90% OFF"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ ...content, subtitle: e.target.value })}
              className="mt-1"
              placeholder="Shein Deals Week"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Configuración del Botón</label>
            <div>
              <label className="text-xs font-medium">Texto del Botón</label>
              <Input
                value={content.button?.text || ''}
                onChange={(e) => updateContent({ 
                  ...content, 
                  button: { ...content.button, text: e.target.value }
                })}
                className="mt-1"
                placeholder="SAVE NOW"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Enlace del Botón</label>
              <Input
                value={content.button?.link || ''}
                onChange={(e) => updateContent({ 
                  ...content, 
                  button: { ...content.button, link: e.target.value }
                })}
                className="mt-1"
                placeholder="#"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Tipo de Enlace</label>
              <Select 
                value={content.button?.linkType || 'external'} 
                onValueChange={(value: 'external' | 'internal' | 'block') => 
                  updateContent({ 
                    ...content, 
                    button: { ...content.button, linkType: value }
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">URL Externa</SelectItem>
                  <SelectItem value="internal">Página Interna</SelectItem>
                  <SelectItem value="block">Bloque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium">Color del Botón</label>
              <Input
                value={content.button?.color || '#3B82F6'}
                onChange={(e) => updateContent({ 
                  ...content, 
                  button: { ...content.button, color: e.target.value }
                })}
                className="mt-1"
                type="color"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Color al Hover</label>
              <Input
                value={content.button?.hoverColor || '#2563EB'}
                onChange={(e) => updateContent({ 
                  ...content, 
                  button: { ...content.button, hoverColor: e.target.value }
                })}
                className="mt-1"
                type="color"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Alineación del Contenido</label>
            <Select 
              value={content.alignment || 'center'} 
              onValueChange={(value: 'left' | 'center' | 'right') => 
                updateContent({ ...content, alignment: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Izquierda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Derecha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Opacidad del Overlay</label>
            <div className="mt-2">
              <Slider
                value={[content.overlayOpacity || 50]}
                onValueChange={([value]) => updateContent({ ...content, overlayOpacity: value })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>{content.overlayOpacity || 50}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Color del Texto</label>
            <Select 
              value={content.textColor || 'light'} 
              onValueChange={(value: 'light' | 'dark' | 'custom') => 
                updateContent({ ...content, textColor: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro (blanco)</SelectItem>
                <SelectItem value="dark">Oscuro (negro)</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            {content.textColor === 'custom' && (
              <div className="mt-2">
                <label className="text-xs font-medium">Color Personalizado</label>
                <Input
                  value={content.customTextColor || '#FFFFFF'}
                  onChange={(e) => updateContent({ ...content, customTextColor: e.target.value })}
                  className="mt-1"
                  type="color"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium">Animación</label>
            <Select 
              value={content.animation || 'none'} 
              onValueChange={(value: 'none' | 'fade' | 'slide' | 'zoom') => 
                updateContent({ ...content, animation: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin animación</SelectItem>
                <SelectItem value="fade">Desvanecer</SelectItem>
                <SelectItem value="slide">Deslizar</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )
    default:
      return <p className="text-sm text-muted-foreground">No hay opciones de edición disponibles para este tipo de bloque.</p>
  }
}

function renderStyleFields(type: string, content: any, updateContent: (content: any) => void) {
  const updateStyle = (path: string, value: any) => {
    const currentStyles = content.styles || {}
    const newStyles = { ...currentStyles, [path]: value }
    updateContent({ ...content, styles: newStyles })
  }

  const getStyleValue = (path: string, defaultValue: any) => {
    return (content.styles && content.styles[path]) || defaultValue
  }

  // Función para convertir opacidad de texto a número
  const opacityToNumber = (opacityValue: string): number => {
    const match = opacityValue.match(/opacity-(\d+)/)
    return match ? parseInt(match[1]) : 100
  }

  // Función para convertir número a opacidad en formato CSS
  const numberToOpacity = (number: number): string => {
    return `opacity-${number}`
  }

  return (
    <>
      <div>
        <label className="text-sm font-medium flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          Color de Fondo
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { name: 'Transparente', value: 'transparent' },
            { name: 'Blanco', value: 'bg-white' },
            { name: 'Gris Claro', value: 'bg-muted' },
            { name: 'Azul Claro', value: 'bg-blue-50' },
            { name: 'Verde Claro', value: 'bg-green-50' },
            { name: 'Morado Claro', value: 'bg-purple-50' },
            { name: 'Gris Oscuro', value: 'bg-gray-900 dark:bg-gray-800' },
            { name: 'Azul Oscuro', value: 'bg-blue-900 dark:bg-blue-800' },
            { name: 'Gradiente Azul', value: 'bg-gradient-to-r from-blue-500 to-purple-600' },
            { name: 'Gradiente Verde', value: 'bg-gradient-to-r from-green-500 to-teal-600' }
          ].map((color) => (
            <button
              key={color.value}
              className={`p-2 rounded border text-xs ${
                getStyleValue('backgroundColor', 'transparent') === color.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                  : 'border-border hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => updateStyle('backgroundColor', color.value)}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Espaciado Vertical</label>
        <Select 
          value={getStyleValue('paddingY', 'py-20')} 
          onValueChange={(value) => updateStyle('paddingY', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="py-0">Sin Espaciado</SelectItem>
            <SelectItem value="py-4">Compacto (16px)</SelectItem>
            <SelectItem value="py-8">Normal (32px)</SelectItem>
            <SelectItem value="py-12">Espaciado (48px)</SelectItem>
            <SelectItem value="py-16">Amplio (64px)</SelectItem>
            <SelectItem value="py-20">Extra Amplio (80px)</SelectItem>
            <SelectItem value="py-24">Muy Amplio (96px)</SelectItem>
            <SelectItem value="py-32">Máximo (128px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Espaciado Horizontal</label>
        <Select 
          value={getStyleValue('paddingX', 'px-6')} 
          onValueChange={(value) => updateStyle('paddingX', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="px-0">Sin Espaciado</SelectItem>
            <SelectItem value="px-4">Compacto (16px)</SelectItem>
            <SelectItem value="px-6">Normal (24px)</SelectItem>
            <SelectItem value="px-8">Amplio (32px)</SelectItem>
            <SelectItem value="px-12">Extra Amplio (48px)</SelectItem>
            <SelectItem value="px-16">Muy Amplio (64px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Alineación del Texto</label>
        <Select 
          value={getStyleValue('textAlign', 'text-center')} 
          onValueChange={(value) => updateStyle('textAlign', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text-left">Izquierda</SelectItem>
            <SelectItem value="text-center">Centro</SelectItem>
            <SelectItem value="text-right">Derecha</SelectItem>
            <SelectItem value="text-justify">Justificado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Borde</label>
        <Select 
          value={getStyleValue('border', 'none')} 
          onValueChange={(value) => updateStyle('border', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin Borde</SelectItem>
            <SelectItem value="border">Borde Simple</SelectItem>
            <SelectItem value="border-2">Borde Grueso</SelectItem>
            <SelectItem value="border-4">Borde Extra Grueso</SelectItem>
            <SelectItem value="border-t border-b">Borde Superior e Inferior</SelectItem>
            <SelectItem value="border-l border-r">Borde Izquierdo y Derecho</SelectItem>
            <SelectItem value="border-t">Solo Borde Superior</SelectItem>
            <SelectItem value="border-b">Solo Borde Inferior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Color del Borde</label>
        <Select 
          value={getStyleValue('borderColor', 'border-border')} 
          onValueChange={(value) => updateStyle('borderColor', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="border-border">Por Defecto</SelectItem>
            <SelectItem value="border-gray-300">Gris Claro</SelectItem>
            <SelectItem value="border-gray-500">Gris</SelectItem>
            <SelectItem value="border-blue-500">Azul</SelectItem>
            <SelectItem value="border-green-500">Verde</SelectItem>
            <SelectItem value="border-purple-500">Morado</SelectItem>
            <SelectItem value="border-red-500">Rojo</SelectItem>
            <SelectItem value="border-yellow-500">Amarillo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Sombra</label>
        <Select 
          value={getStyleValue('shadow', 'none')} 
          onValueChange={(value) => updateStyle('shadow', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin Sombra</SelectItem>
            <SelectItem value="shadow-sm">Sombra Suave</SelectItem>
            <SelectItem value="shadow">Sombra Normal</SelectItem>
            <SelectItem value="shadow-md">Sombra Media</SelectItem>
            <SelectItem value="shadow-lg">Sombra Grande</SelectItem>
            <SelectItem value="shadow-xl">Sombra Extra Grande</SelectItem>
            <SelectItem value="shadow-2xl">Sombra Doble Extra Grande</SelectItem>
            <SelectItem value="shadow-inner">Sombra Interior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Radio de Borde</label>
        <Select 
          value={getStyleValue('borderRadius', 'rounded-none')} 
          onValueChange={(value) => updateStyle('borderRadius', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rounded-none">Sin Redondeo</SelectItem>
            <SelectItem value="rounded-sm">Redondeo Suave</SelectItem>
            <SelectItem value="rounded">Redondeo Normal</SelectItem>
            <SelectItem value="rounded-md">Redondeo Medio</SelectItem>
            <SelectItem value="rounded-lg">Redondeo Grande</SelectItem>
            <SelectItem value="rounded-xl">Redondeo Extra Grande</SelectItem>
            <SelectItem value="rounded-2xl">Redondeo Doble Extra Grande</SelectItem>
            <SelectItem value="rounded-3xl">Redondeo Triple Extra Grande</SelectItem>
            <SelectItem value="rounded-full">Completamente Redondeado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Margen Externo</label>
        <Select 
          value={getStyleValue('margin', 'mb-0')} 
          onValueChange={(value) => updateStyle('margin', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mb-0">Sin Margen</SelectItem>
            <SelectItem value="mb-2">Margen Muy Pequeño</SelectItem>
            <SelectItem value="mb-4">Margen Pequeño</SelectItem>
            <SelectItem value="mb-6">Margen Normal</SelectItem>
            <SelectItem value="mb-8">Margen Grande</SelectItem>
            <SelectItem value="mb-12">Margen Extra Grande</SelectItem>
            <SelectItem value="mb-16">Margen Muy Grande</SelectItem>
            <SelectItem value="mb-20">Margen Máximo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Opacidad</label>
        <div className="mt-2 space-y-2">
          <Slider
            value={[opacityToNumber(getStyleValue('opacity', 'opacity-100'))]}
            onValueChange={(value) => updateStyle('opacity', numberToOpacity(value[0]))}
            max={100}
            min={10}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span className="font-medium">
              {opacityToNumber(getStyleValue('opacity', 'opacity-100'))}%
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Transformación al Hover</label>
        <Select 
          value={getStyleValue('hoverTransform', 'none')} 
          onValueChange={(value) => updateStyle('hoverTransform', value)}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin Transformación</SelectItem>
            <SelectItem value="hover:scale-105">Escalar 5%</SelectItem>
            <SelectItem value="hover:scale-110">Escalar 10%</SelectItem>
            <SelectItem value="hover:-translate-y-1">Elevar ligeramente</SelectItem>
            <SelectItem value="hover:-translate-y-2">Elevar moderadamente</SelectItem>
            <SelectItem value="hover:rotate-1">Rotar ligeramente</SelectItem>
            <SelectItem value="hover:shadow-lg">Añadir sombra</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}