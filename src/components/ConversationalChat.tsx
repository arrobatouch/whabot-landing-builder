'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Send, MessageSquare, Building2, Phone, Mail, MapPin, Star, Check, CheckCheck, BarChart3, Activity, ThumbsUp, Edit } from 'lucide-react'

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
  nombre_emprendimiento?: string
  rubro?: string
  ubicacion?: string
  publico_objetivo?: string
  productos_servicios?: string
  diferenciales?: string
  promociones?: string
  contacto?: string
  redes_sociales?: string
  estado_chat?: string
}

export function ConversationalChat({ onBusinessInfoComplete, onManualMode, isGenerating = false }: ConversationalChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [businessData, setBusinessData] = useState<BusinessData>({})
  const [isTyping, setIsTyping] = useState(false)
  const [showMonitoring, setShowMonitoring] = useState(false)
  const [landingResult, setLandingResult] = useState<string | null>(null)
  const [showApproval, setShowApproval] = useState(false)
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
      text: `👋 ¡Hola! Soy tu asistente de AnythingLLM. Estoy aquí para ayudarte con cualquier consulta sobre tu negocio o proyecto. ¿En qué puedo ayudarte hoy?`,
      sender: 'assistant',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

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
      // Send message to AnythingLLM API
      console.log('Sending request to AnythingLLM...')
      const response = await fetch('/api/knowledge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputValue,
          sessionId: 'landing-assistant-session'
        }),
      })

      console.log('AnythingLLM API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('AnythingLLM API Error:', errorData)
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('AnythingLLM API result:', data)
      
      const aiReply = data.content

      if (aiReply) {
        const assistantMessage: Message = {
          id: 'assistant-' + Date.now(),
          text: aiReply,
          sender: 'assistant',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])

        // Verificar si la respuesta contiene un landing completo (palabras clave)
        const landingKeywords = [
          'landing generada', 'contenido completo', 'bloques', 'módulos',
          'hero slide', 'bloque de refuerzo', 'características principales',
          'testimonios', 'cta', 'precios', 'contacto whatsapp', 'pie de página'
        ]
        
        const isLandingComplete = landingKeywords.some(keyword => 
          aiReply.toLowerCase().includes(keyword.toLowerCase())
        )

        if (isLandingComplete) {
          // Mostrar el resultado en la columna derecha para aprobación
          setLandingResult(aiReply)
          setShowApproval(true)
        }
      } else {
        console.error('No AI reply found in response:', data)
        // Use fallback response
        const fallbackMessage: Message = {
          id: 'assistant-' + Date.now(),
          text: 'Entiendo. Para continuar, podrías decirme más sobre tu negocio o qué tipo de página web te gustaría crear?',
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, fallbackMessage])
      }

    } catch (error) {
      console.error('Error processing message:', error)
      
      let errorMessage = 'Lo siento, hubo un error al procesar tu respuesta. Por favor, intenta nuevamente.'
      
      if (error.message.includes('AnythingLLM API Error')) {
        errorMessage = 'Lo siento, el servicio de AnythingLLM no está disponible en este momento. Por favor, intenta nuevamente en unos minutos.'
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

  // Función para aprobar el landing generado
  const handleApproveLanding = () => {
    if (landingResult) {
      setShowApproval(false)
      
      // Add confirmation message
      const confirmationMessage: Message = {
        id: 'confirmation-' + Date.now(),
        text: '¡Excelente! He aprobado el contenido de tu landing. Ahora voy a crear la página con todos los bloques correspondientes.',
        sender: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, confirmationMessage])
      
      // Parse the landing result and pass to parent
      setTimeout(() => {
        onBusinessInfoComplete({
          landingContent: landingResult,
          rawContent: landingResult
        })
      }, 1500)
    }
  }

  // Función para rechazar y seguir editando
  const handleRejectLanding = () => {
    setShowApproval(false)
    setLandingResult(null)
    
    // Add message asking for more information
    const correctionMessage: Message = {
      id: 'correction-' + Date.now(),
      text: 'Entendido. Por favor, dime qué cambios o información adicional te gustaría agregar o modificar en la landing.',
      sender: 'assistant',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, correctionMessage])
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
                <p className="text-xs opacity-90">Conectado a AnythingLLM</p>
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
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
              <div className="flex flex-col space-y-3">
                <Textarea
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
                  className="flex-1 min-h-[80px] max-h-32 resize-none text-base"
                  ref={(textarea) => {
                    if (textarea && !isProcessing && !isGenerating) {
                      try {
                        textarea.focus()
                      } catch (error) {
                        console.warn('Could not focus textarea:', error)
                      }
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Presiona Enter para enviar, Shift+Enter para nueva línea
                  </span>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing || isGenerating}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Landing Result and Approval */}
          <div className="space-y-6">
            {/* Landing Result Approval Card - Takes more space */}
            {showApproval && landingResult && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg flex-1">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800 dark:text-blue-200">
                  <Edit className="h-5 w-5 mr-2" />
                  ¿Aprobas este contenido para tu landing?
                </h3>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 max-h-[500px] overflow-y-auto border border-blue-100 dark:border-blue-900">
                  <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-md font-semibold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>
                      }}
                    >
                      {landingResult}
                    </ReactMarkdown>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleApproveLanding}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Aprobar y Crear
                  </Button>
                  <Button
                    onClick={handleRejectLanding}
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Seguir Editando
                  </Button>
                </div>
              </div>
            )}

            {/* Status Card - Smaller when no approval */}
            <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg ${showApproval ? 'hidden' : ''}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Estado del Proceso
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Conexión:</span>
                  <Badge variant="outline" className="text-green-600 dark:text-green-400">
                    AnythingLLM Activo
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Estado:</span>
                  <Badge variant={showApproval ? "default" : "secondary"}>
                    {showApproval ? "Esperando Aprobación" : "En Conversación"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {showApproval ? (
                    <span>📋 Revisa el contenido generado y apruébalo para crear tu landing.</span>
                  ) : (
                    <span>💬 Conversa con el asistente para generar el contenido de tu landing.</span>
                  )}
                </div>
              </div>
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