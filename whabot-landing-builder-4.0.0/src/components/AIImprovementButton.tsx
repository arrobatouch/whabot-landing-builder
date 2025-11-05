'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, Wand2 } from 'lucide-react'

// Función para limpiar contenido JSON de la IA
function cleanJsonContent(content: string): string {
  // Eliminar markdown formatting común
  let cleaned = content.trim()
  
  // Eliminar ```json al inicio
  cleaned = cleaned.replace(/^```json\n?/, '')
  
  // Eliminar ``` al final
  cleaned = cleaned.replace(/\n?```$/, '')
  
  // Eliminar cualquier otro markdown formatting
  cleaned = cleaned.replace(/^```\n?/, '')
  cleaned = cleaned.replace(/\n?```$/, '')
  
  // Eliminar espacios en blanco adicionales
  cleaned = cleaned.trim()
  
  return cleaned
}

interface AIImprovementButtonProps {
  blockType: string
  content: any
  onImproved: (newContent: any) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
}

export function AIImprovementButton({ 
  blockType, 
  content, 
  onImproved, 
  className = '',
  size = 'sm',
  variant = 'outline'
}: AIImprovementButtonProps) {
  const [isImproving, setIsImproving] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'zai' | 'deepseek'>('zai')
  const [improvementType, setImprovementType] = useState<string>('general')

  const getImprovementOptions = () => {
    switch (blockType) {
      case 'hero':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'copywriting', label: 'Mejorar copywriting' },
          { value: 'persuasive', label: 'Hacer más persuasivo' },
          { value: 'modern', label: 'Estilo moderno' }
        ]
      case 'features':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'benefits', label: 'Enfocar en beneficios' },
          { value: 'technical', label: 'Detalles técnicos' },
          { value: 'concise', label: 'Más conciso' }
        ]
      case 'testimonials':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'emotional', label: 'Más emocional' },
          { value: 'professional', label: 'Más profesional' },
          { value: 'detailed', label: 'Más detallado' }
        ]
      case 'cta':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'urgent', label: 'Crear urgencia' },
          { value: 'benefit-focused', label: 'Enfocar en beneficios' },
          { value: 'action-oriented', label: 'Orientado a acción' }
        ]
      case 'pricing':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'competitive', label: 'Más competitivo' },
          { value: 'value-focused', label: 'Enfocado en valor' },
          { value: 'clear', label: 'Más claro' }
        ]
      case 'stats':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'impactful', label: 'Más impactante' },
          { value: 'detailed', label: 'Más detallado' }
        ]
      case 'timeline':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'storytelling', label: 'Mejorar narrativa' },
          { value: 'achievements', label: 'Enfocar en logros' }
        ]
      case 'faq':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'comprehensive', label: 'Más completo' },
          { value: 'customer-focused', label: 'Enfocado en cliente' }
        ]
      case 'reinforcement':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'trust-building', label: 'Generar confianza' },
          { value: 'benefit-driven', label: 'Impulsado por beneficios' }
        ]
      case 'hero-split':
        return [
          { value: 'general', label: 'Mejorar general' },
          { value: 'balanced', label: 'Mejorar equilibrio' },
          { value: 'visual-focused', label: 'Enfocado en visual' }
        ]
      case 'image':
        return [
          { value: 'general', label: 'Mejorar descripción' },
          { value: 'seo-friendly', label: 'Optimizado para SEO' },
          { value: 'engaging', label: 'Más atractivo' }
        ]
      default:
        return [
          { value: 'general', label: 'Mejorar general' }
        ]
    }
  }

  const getPromptForImprovement = () => {
    const basePrompt = `Mejora el contenido de un bloque de tipo "${blockType}"`

    switch (improvementType) {
      case 'copywriting':
        return `${basePrompt}. Mejora el copywriting para hacerlo más atractivo y profesional. Enfócate en el lenguaje persuasivo y la claridad del mensaje.`
      case 'persuasive':
        return `${basePrompt}. Haz el contenido más persuasivo y convincente. Usa técnicas de marketing y psicología del consumidor.`
      case 'modern':
        return `${basePrompt}. Actualiza el contenido a un estilo moderno y contemporáneo. Usa lenguaje actual y tendencias actuales.`
      case 'benefits':
        return `${basePrompt}. Enfócate en destacar los beneficios en lugar de las características. Hazlo más orientado al cliente.`
      case 'technical':
        return `${basePrompt}. Añade más detalles técnicos y especificaciones. Hazlo más informativo para usuarios técnicos.`
      case 'concise':
        return `${basePrompt}. Haz el contenido más conciso y directo. Elimina redundancias y ve al grano.`
      case 'emotional':
        return `${basePrompt}. Añade un toque emocional y personal. Haz que conecte mejor con los lectores.`
      case 'professional':
        return `${basePrompt}. Haz el contenido más profesional y corporativo. Usa lenguaje formal y técnico apropiado.`
      case 'detailed':
        return `${basePrompt}. Añade más detalles y profundidad al contenido. Expande las ideas con más información.`
      case 'urgent':
        return `${basePrompt}. Crea sensación de urgencia y llamada a la acción inmediata. Usa lenguaje que motive a actuar ahora.`
      case 'benefit-focused':
        return `${basePrompt}. Enfócate exclusivamente en los beneficios para el cliente. Hazlo irresistible.`
      case 'action-oriented':
        return `${basePrompt}. Haz el contenido más orientado a la acción. Usa verbos fuertes y llamados a la acción claros.`
      case 'competitive':
        return `${basePrompt}. Haz el contenido más competitivo. Destaca ventajas sobre la competencia.`
      case 'value-focused':
        return `${basePrompt}. Enfócate en el valor y retorno de inversión. Haz que valga la pena.`
      case 'clear':
        return `${basePrompt}. Haz el contenido más claro y fácil de entender. Simplifica conceptos complejos.`
      case 'impactful':
        return `${basePrompt}. Haz el contenido más impactante y memorable. Usa datos y estadísticas impresionantes.`
      case 'storytelling':
        return `${basePrompt}. Mejora la narrativa y cuenta una historia más atractiva. Hazlo más memorable.`
      case 'achievements':
        return `${basePrompt}. Enfócate en los logros y hitos importantes. Hazlo inspirador.`
      case 'comprehensive':
        return `${basePrompt}. Haz el contenido más completo y exhaustivo. Cubre todos los aspectos importantes.`
      case 'customer-focused':
        return `${basePrompt}. Enfócate en las necesidades y problemas del cliente. Hazlo empático.`
      case 'trust-building':
        return `${basePrompt}. Construye confianza y credibilidad. Usa lenguaje que genere seguridad.`
      case 'benefit-driven':
        return `${basePrompt}. Impulsa el contenido con beneficios claros y concretos.`
      case 'balanced':
        return `${basePrompt}. Mejora el equilibrio entre texto y elementos visuales.`
      case 'visual-focused':
        return `${basePrompt}. Enfócate en mejorar los aspectos visuales y la presentación.`
      case 'seo-friendly':
        return `${basePrompt}. Optimiza el contenido para SEO. Usa palabras clave relevantes de forma natural.`
      case 'engaging':
        return `${basePrompt}. Haz el contenido más atractivo e interesante. Usa lenguaje que capte la atención.`
      default:
        return `${basePrompt}. Mejora la calidad general del contenido, haciéndolo más profesional, atractivo y efectivo.`
    }
  }

  const handleImprove = async () => {
    setIsImproving(true)
    try {
      const prompt = getPromptForImprovement()
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}. Contenido actual: ${JSON.stringify(content)}`,
          type: 'content',
          provider: selectedProvider
        })
      })

      const result = await response.json()
      if (result.success) {
        try {
          // Intentar parsear el contenido mejorado como JSON
          const cleanedContent = cleanJsonContent(result.content)
          const improvedContent = JSON.parse(cleanedContent)
          onImproved(improvedContent)
        } catch (parseError) {
          // Si no es JSON, aplicar mejoras básicas basadas en el tipo de bloque
          const improvedContent = applyBasicImprovements(result.content, blockType, content)
          onImproved(improvedContent)
        }
      } else {
        alert(`Error al mejorar contenido: ${result.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('AI improvement error:', error)
      alert(`Error al conectar con el servicio de IA: ${error.message || 'Error de conexión'}`)
    } finally {
      setIsImproving(false)
      setShowOptions(false)
    }
  }

  const applyBasicImprovements = (aiText: string, blockType: string, originalContent: any) => {
    // Lógica básica para aplicar mejoras cuando la IA devuelve texto en lugar de JSON
    const lines = aiText.split('\n').filter(line => line.trim())
    
    switch (blockType) {
      case 'hero':
        return {
          ...originalContent,
          title: lines[0] || originalContent.title,
          subtitle: lines[1] || originalContent.subtitle,
          description: lines.slice(2).join(' ') || originalContent.description
        }
      case 'features':
        return {
          ...originalContent,
          title: lines[0] || originalContent.title,
          subtitle: lines[1] || originalContent.subtitle
        }
      case 'cta':
        return {
          ...originalContent,
          title: lines[0] || originalContent.title,
          description: lines.slice(1).join(' ') || originalContent.description
        }
      default:
        return {
          ...originalContent,
          title: lines[0] || originalContent.title || 'Título mejorado'
        }
    }
  }

  const improvementOptions = getImprovementOptions()

  return (
    <div className={`relative ${className}`}>
      {!showOptions ? (
        <Button
          variant={variant}
          size={size}
          onClick={() => setShowOptions(true)}
          disabled={isImproving}
          className="flex items-center gap-2"
        >
          {isImproving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Mejorar con IA
        </Button>
      ) : (
        <div className="absolute top-full right-0 z-50 bg-background border border-border rounded-lg shadow-lg p-4 min-w-[300px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mejorar con IA</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOptions(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Proveedor</label>
              <Select value={selectedProvider} onValueChange={(value: 'zai' | 'deepseek') => setSelectedProvider(value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zai">Z-AI</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Tipo de mejora</label>
              <Select value={improvementType} onValueChange={setImprovementType}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {improvementOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              size="sm"
              onClick={handleImprove}
              disabled={isImproving}
              className="w-full"
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mejorando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Aplicar mejora
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}