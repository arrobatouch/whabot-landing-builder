'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Send, MessageSquare, Building2, Phone, Mail, MapPin, Star, Check, CheckCheck, BarChart3, Activity } from 'lucide-react'

interface ConversationalChatProps {
  onBusinessInfoComplete: (businessInfo: any) => void
  onManualMode: () => void
  isGenerating?: boolean
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
}

interface BusinessData {
  nombre_usuario?: string
  nombre_negocio?: string
  rubro?: string
  publico_objetivo?: string
  diferencial?: string
  ubicacion?: string
  objetivo_web?: string
  estilo_marca?: string
  redes?: string
  cta_principal?: string
}

const SYSTEM_PROMPT = `
Actuás como un asistente conversacional empático que ayuda a conocer un negocio para crear una landing page profesional.
El usuario puede expresarse libremente. 
Tu objetivo es responder de manera natural, reconociendo lo que dice y extrayendo internamente los siguientes datos:
[nombre_usuario, nombre_negocio, rubro, ubicacion, objetivo_web, publico_objetivo, diferencial, estilo_marca, redes, cta_principal].
NO muestres datos internos ni confirmes campos estructurados.
Respondé siempre con tono humano, amable y contextual.
Si el usuario ya brindó un dato, no repitas la pregunta.
Sé conversacional y natural, como si estuvieras teniendo una charla real con un emprendedor.
`

export function ConversationalChat({ onBusinessInfoComplete, onManualMode, isGenerating = false }: ConversationalChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [businessData, setBusinessData] = useState<BusinessData>({})
  const [isTyping, setIsTyping] = useState(false)
  const [showMonitoring, setShowMonitoring] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Enviar mensaje de bienvenida inicial
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      text: `👋 ¡Hola! Qué bueno tenerte acá 😊 ¿Con quién tengo el gusto?`,
      sender: 'assistant',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  // Función para extraer entidades del texto del usuario
  const extractEntities = (text: string): Partial<BusinessData> => {
    const extracted: Partial<BusinessData> = {}
    
    // Patrones para extracción de entidades
    const patterns = {
      nombre_usuario: [
        /(me llamo|soy|mi nombre es)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/i,
        /([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+dice|habl[ao]|te saluda)/i
      ],
      nombre_negocio: [
        /mi\s+(negocio|empresa|proyecto)\s+(?:se llama|es)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s&]+)/i,
        /(?:se llama|es)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ0-9\s]+)/i,
        /([A-ZÁÉÍÓÚÑ]{3,})(?:\s+(?:S\.A\.|SRL|Ltda\.|Inc\.))?/i
      ],
      rubro: [
        /alquiler\s+(?:de\s+)?departamentos?/i,
        /alquiler\s+temporario/i,
        /restaurante|gastronomía|comida/i,
        /consultoría|asesoramiento/i,
        /diseño|diseñador|diseñadora/i,
        /tienda|venta|ecommerce/i,
        /servicios?\s+de\s+([a-záéíóúñ]+)/i,
        /marketing|publicidad/i,
        /turismo|hostelería/i,
        /educación|capacitación/i,
        /construcción|obras/i,
        /tecnología|software/i,
        /salud|medicina/i,
        /belleza|estética/i
      ],
      ubicacion: [
        /(?:ubicado?|en|desde)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]+),?\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)/i,
        /([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:,\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+))?/i,
        /en\s+([a-záéíóúñ\s]+)(?=\.|$)/i
      ],
      objetivo_web: [
        /(?:quiero|busco|necesito)\s+(?:que\s+)?(?:mi\s+web|sitio|página)\s+(?:genere|tenga|logre)\s+([a-záéíóúñ\s]+)/i,
        /(?:para\s+)?(?:generar|conseguir|lograr|tener)\s+(más\s+)?([a-záéíóúñ\s]+)/i,
        /reservar|vender|mostrar|contactar|informar|comprar|promocionar/i
      ],
      publico_objetivo: [
        /(?:público|clientes|mercado|target)\s+(?:es|son|dirigido?\s+a)\s+([a-záéíóúñ\s]+)/i,
        /(?:para|a)\s+([a-záéíóúñ\s]+)(?:como\s+público)?/i,
        /jóvenes|adultos|familias|empresas|niños|mujeres|hombres|turistas|clientes/i
      ],
      diferencial: [
        /(?:diferencial|ventaja|lo que\s+)?(?:nos hace|hace)\s+(?:únicos|especiales|diferentes)\s+([a-záéíóúñ\s]+)/i,
        /(?:somos|ofrecemos|tenemos)\s+([a-záéíóúñ\s]+)(?:que\s+nos\s+diferencia)?/i,
        /único|especial|diferente|mejor|calidad|profesional|exclusivo/i
      ]
    }

    // Procesar cada patrón
    Object.entries(patterns).forEach(([field, fieldPatterns]) => {
      for (const pattern of fieldPatterns) {
        const match = text.match(pattern)
        if (match) {
          // Para ubicación, capturar ciudad y país si están disponibles
          if (field === 'ubicacion' && match[2]) {
            extracted[field as keyof BusinessData] = `${match[1]}, ${match[2]}`
          } else {
            extracted[field as keyof BusinessData] = match[match.length > 1 ? 1 : 0].trim()
          }
          break
        }
      }
    })

    return extracted
  }

  // Función para generar el contexto para DeepSeek
  const generateContext = () => {
    const knownData = Object.entries(businessData)
      .filter(([_, value]) => value && value.trim() !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    const recentMessages = messages.slice(-4).map(msg => 
      `${msg.sender}: ${msg.text}`
    ).join('\n')

    return `
Datos conocidos:
${knownData}

Conversación reciente:
${recentMessages}
    `.trim()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)
    setIsTyping(true)

    try {
      // 1. Extraer entidades del mensaje del usuario
      const extractedEntities = extractEntities(inputValue)
      
      // 2. Actualizar datos del negocio
      const updatedBusinessData = { ...businessData, ...extractedEntities }
      setBusinessData(updatedBusinessData)

      // 3. Generar respuesta con el sistema híbrido (80% DeepSeek, 20% OpenAI)
      console.log('Sending request to Hybrid AI API...')
      const response = await fetch('/api/ai/hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          context: generateContext(),
          userMessage: inputValue,
          businessData: updatedBusinessData,
          temperature: 0.7,
          maxTokens: 800
        }),
      })

      console.log('Hybrid AI API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Hybrid AI API Error Response:', errorText)
        throw new Error(`Error en la API Híbrida: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Hybrid AI API result:', result)
      
      const aiReply = result.reply || result.content || result.choices?.[0]?.message?.content

      if (aiReply) {
        const assistantMessage: Message = {
          id: 'assistant-' + Date.now(),
          text: aiReply,
          sender: 'assistant',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        console.error('No AI reply found in response:', result)
        // Use fallback response
        const fallbackMessage: Message = {
          id: 'assistant-' + Date.now(),
          text: 'Entiendo. Para continuar, podrías decirme más sobre tu negocio o qué tipo de página web te gustaría crear?',
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, fallbackMessage])
      }

        // 4. Verificar si tenemos suficientes datos para generar la landing
      const hasEnoughData = checkIfEnoughData(updatedBusinessData)
      if (hasEnoughData) {
        // Agregar mensaje final indicando que se está analizando y preparando el contenido
        const finalMessage: Message = {
          id: 'final-' + Date.now(),
          text: '¡Gracias! Ya tengo toda tu información. Ahora estoy analizando y preparando el contenido para tu landing page...',
          sender: 'assistant',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, finalMessage])
        
        // Esperar un momento para que el usuario vea el mensaje
        setTimeout(() => {
          onBusinessInfoComplete(updatedBusinessData)
        }, 2000)
      } else {
        // Si no hay suficientes datos, mostrar un mensaje pidiendo la información que falta
        const missingInfo = getMissingInfo(updatedBusinessData)
        if (missingInfo) {
          const missingMessage: Message = {
            id: 'missing-' + Date.now(),
            text: missingInfo,
            sender: 'assistant',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, missingMessage])
        }
      }

    } catch (error) {
      console.error('Error processing message:', error)
      
      let errorMessage = 'Lo siento, hubo un error al procesar tu respuesta. Por favor, intenta nuevamente.'
      
      if (error.message.includes('Hybrid AI API Error')) {
        errorMessage = 'Lo siento, el servicio de IA híbrida no está disponible en este momento. Por favor, intenta nuevamente en unos minutos.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Lo siento, no puedo conectar con el servicio. Por favor, verifica tu conexión a internet.'
      }
      
      const errorResponse: Message = {
        id: 'error-' + Date.now(),
        text: errorMessage,
        sender: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorResponse])
    }

    setIsTyping(false)
    setIsProcessing(false)
  }

  // Función para verificar si tenemos suficientes datos
  const checkIfEnoughData = (data: BusinessData): boolean => {
    const requiredFields = ['nombre_negocio', 'rubro']
    const optionalFields = ['ubicacion', 'objetivo_web', 'publico_objetivo']
    
    const hasRequired = requiredFields.every(field => data[field as keyof BusinessData])
    const hasSomeOptional = optionalFields.some(field => data[field as keyof BusinessData])
    
    console.log('Checking data:', { data, hasRequired, hasSomeOptional })
    
    return hasRequired && hasSomeOptional
  }

  // Función para obtener mensaje pidiendo información faltante
  const getMissingInfo = (data: BusinessData): string | null => {
    const requiredFields = ['nombre_negocio', 'rubro']
    const optionalFields = ['ubicacion', 'objetivo_web', 'publico_objetivo']
    
    const missingRequired = requiredFields.filter(field => !data[field as keyof BusinessData])
    const hasAnyOptional = optionalFields.some(field => data[field as keyof BusinessData])
    
    if (missingRequired.length > 0) {
      const fieldNames = {
        'nombre_negocio': 'el nombre de tu negocio',
        'rubro': 'el rubro o tipo de negocio'
      }
      
      const missingNames = missingRequired.map(field => fieldNames[field as keyof typeof fieldNames]).join(' y ')
      return `Para continuar, necesito que me digas ${missingNames}. ¿Podrías proporcionarme esa información?`
    }
    
    if (!hasAnyOptional) {
      return `¡Ya tengo el nombre y rubro de tu negocio! Ahora necesito un poco más de información. Podrías decirme:\n\n• ¿Dónde está ubicado tu negocio?\n• ¿Qué objetivo tiene tu página web?\n• ¿Quién es tu público objetivo?\n\nCon solo uno de estos datos podré comenzar a crear tu landing.`
    }
    
    return null
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user'
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-2xl px-4 py-2 ${
            isUser 
              ? 'bg-green-500 text-white rounded-br-none dark:bg-green-600' 
              : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700'
          }`}>
            <div className="text-sm whitespace-pre-line">
              <ReactMarkdown 
                components={{
                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-md font-semibold mb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-1">{children}</ol>,
                  li: ({ children }) => <li className="mb-0.5">{children}</li>
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
          <div className={`flex items-center mt-1 ${isUser ? 'justify-end' : 'justify-start'} space-x-1`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            {isUser && message.status && (
              <div className="text-green-500">
                {message.status === 'sent' && <Check className="h-3 w-3" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const getProgressPercentage = () => {
    const fields = Object.keys(businessData).filter(key => businessData[key as keyof BusinessData])
    return (fields.length / 10) * 100 // 10 campos totales
  }

  // Componente de mini-dashboard de monitoreo
  const MiniMonitoringDashboard = () => {
    const [metrics, setMetrics] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchMetrics = async () => {
        try {
          const response = await fetch('/api/metrics')
          const data = await response.json()
          setMetrics(data.metrics)
        } catch (error) {
          console.error('Error fetching metrics:', error)
        } finally {
          setLoading(false)
        }
      }

      if (showMonitoring) {
        fetchMetrics()
      }
    }, [showMonitoring])

    if (!showMonitoring) return null

    return (
      <Card className="mb-4 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Activity className="h-4 w-4 mr-2 text-blue-600" />
            Monitoreo del Sistema Híbrido
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto h-6 w-6 p-0"
              onClick={() => setShowMonitoring(false)}
            >
              ×
            </Button>
          </CardTitle>
          <CardDescription className="text-xs">
            80% DeepSeek • 20% OpenAI • Fallback automático
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Solicitudes:</span>
                <Badge variant="secondary">{metrics.total_requests || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Costo:</span>
                <Badge variant="secondary">${(metrics.total_cost?.total || 0).toFixed(4)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tokens:</span>
                <Badge variant="secondary">{(metrics.total_tokens?.total || 0).toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tiempo:</span>
                <Badge variant="secondary">{(metrics.average_duration || 0).toFixed(0)}ms</Badge>
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge variant={metrics.by_level?.error > 0 ? "destructive" : "default"}>
                    {metrics.by_level?.error > 0 ? "Con errores" : "Saludable"}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Distribución:</span>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">
                      DeepSeek: {metrics.by_service?.deepseek || 0}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      OpenAI: {metrics.by_service?.openai || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No hay métricas disponibles</p>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open('/monitoring', '_blank')}
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Ver Dashboard Completo
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-gray-900 dark:text-slate-100 p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Hablemos de tu Negocio
              </h1>
              <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed">
                Charla con nuestro asistente y descubrí cómo crear tu landing page profesional en minutos.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMonitoring(!showMonitoring)}
              className="ml-4"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Monitoreo
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 h-full overflow-hidden">
          {/* Left Section - Conversational Chat */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl flex flex-col overflow-hidden shadow-lg">
            {/* WhatsApp Header */}
            <div className="bg-green-600 dark:bg-green-700 text-white p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-700" />
              </div>
              <div>
                <h2 className="font-semibold">Asistente Conversacional</h2>
                <p className="text-xs opacity-90">Conectado y listo para ayudarte</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <MiniMonitoringDashboard />
              {messages.map((message) => (
                <div key={message.id}>
                  {renderMessage(message)}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm border border-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribi tu respuesta..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isProcessing || isGenerating}
                  className="flex-1"
                  ref={(input) => {
                    if (input && !isProcessing && !isGenerating) {
                      try {
                        input.focus()
                      } catch (error) {
                        console.warn('Could not focus input:', error)
                      }
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing || isGenerating}
                  size="icon"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Progress and Info */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Progreso de nuestra conversación
              </h3>
              
              <div className="space-y-4">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(businessData).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Consejos para una buena conversación
              </h3>
              
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Expresate con libertad, como si estuvieras hablando con un amigo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Podés mencionar varios datos en un solo mensaje</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Sé específico sobre lo que hace único a tu negocio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Contá qué querés que logre tu página web</span>
                </li>
              </ul>
            </div>

            {/* Manual Mode Button */}
            <Button
              onClick={onManualMode}
              variant="outline"
              className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Prefiero construir manualmente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}