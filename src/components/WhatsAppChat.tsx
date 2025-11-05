'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, MessageSquare, Building2, Phone, Mail, MapPin, Star, Check, CheckCheck } from 'lucide-react'

interface WhatsAppChatProps {
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

interface BusinessInfo {
  nombre_usuario: string
  nombre_negocio: string
  rubro: string
  publico_objetivo: string
  diferencial: string
  ubicacion: string
  objetivo_web: string
  estilo_marca: string
  redes: string
  cta_principal: string
}

const DISCOVERY_QUESTIONS = [
  {
    id: 'welcome',
    text: '👋 ¡Hola! Qué bueno tenerte acá 😊 ¿Con quién tengo el gusto?',
    field: 'nombre_usuario',
    type: 'text',
    prompt: 'Nombre de la persona'
  },
  {
    id: 'business_name',
    text: '¡Genial, gracias {{nombre_usuario}}! ¿Cómo se llama tu negocio o proyecto?',
    field: 'nombre_negocio',
    type: 'text',
    prompt: 'Nombre del negocio'
  },
  {
    id: 'rubro',
    text: 'Contame un poquito, ¿a qué se dedica tu negocio? (ej: alquileres, gastronomía, diseño, etc.)',
    field: 'rubro',
    type: 'text',
    prompt: 'Rubro o actividad principal del negocio'
  },
  {
    id: 'publico_objetivo',
    text: '¿A quién apuntás principalmente? (por ejemplo: turistas, familias, empresas, jóvenes...)',
    field: 'publico_objetivo',
    type: 'text',
    prompt: 'Público objetivo o clientes ideales'
  },
  {
    id: 'diferencial',
    text: '¿Qué dirías que hace único a tu negocio frente a otros del mismo rubro?',
    field: 'diferencial',
    type: 'text',
    prompt: 'Diferencial o propuesta de valor única'
  },
  {
    id: 'ubicacion',
    text: '¿Dónde están ubicados o dónde ofrecen sus servicios?',
    field: 'ubicacion',
    type: 'text',
    prompt: 'Ubicación física o área de cobertura'
  },
  {
    id: 'objetivo_web',
    text: '¿Qué te gustaría lograr con tu página? (más reservas, vender online, mostrar tus productos, etc.)',
    field: 'objetivo_web',
    type: 'text',
    prompt: 'Objetivo principal del sitio web'
  },
  {
    id: 'estilo_marca',
    text: 'Si tu marca fuera una persona, ¿cómo sería? (tranquila, moderna, elegante, divertida...)',
    field: 'estilo_marca',
    type: 'text',
    prompt: 'Estilo o identidad visual de la marca'
  },
  {
    id: 'redes',
    text: '¿Tenés redes o página actual que quieras que revisemos o usemos como referencia?',
    field: 'redes',
    type: 'text',
    prompt: 'Redes sociales o sitios web existentes'
  },
  {
    id: 'cta_principal',
    text: 'Cuando un visitante entre al sitio, ¿qué querés que haga primero? (reservar, escribirte, ver catálogo, etc.)',
    field: 'cta_principal',
    type: 'text',
    prompt: 'Acción principal que debe realizar el visitante'
  }
]

export function WhatsAppChat({ onBusinessInfoComplete, onManualMode, isGenerating = false }: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<Partial<BusinessInfo>>({})
  const [isTyping, setIsTyping] = useState(false)
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

  const analyzeWithDeepSeek = async (userInput: string, currentQuestion: any) => {
    try {
      const response = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.text,
          answer: userInput,
          context: businessInfo,
          field: currentQuestion.field
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la API de DeepSeek')
      }

      const result = await response.json()
      return result.analysis
    } catch (error) {
      console.error('Error analyzing with DeepSeek:', error)
      // Fallback a procesamiento local mejorado
      return processLocalImproved(userInput, currentQuestion)
    }
  }

  const processLocalImproved = (userInput: string, currentQuestion: any) => {
    let processedValue = userInput.trim()
    
    // Función para detectar si el usuario está proporcionando información espontánea
    const isSpontaneousInfo = (text: string, field: string) => {
      // Si el usuario responde con información que no es directamente la respuesta esperada
      // pero contiene datos relevantes, lo detectamos
      const spontaneousPatterns = {
        nombre_negocio: /se llama|negocio|empresa|proyecto/i,
        rubro: /alquiler|departamentos?|restaurante|gastronomía|consultoría|diseño|tienda|servicios/i,
        ubicacion: /ubicado?|en\s+[A-Z]|ciudad|país|dirección/i,
        publico_objetivo: /público|clientes|turistas|familias|empresas|jóvenes|adultos/i,
        diferencial: /único|especial|diferente|mejor|calidad|profesional/i,
        objetivo_web: /web|página|sitio|reservar|vender|mostrar|contactar/i,
        estilo_marca: /estilo|marca|personalidad|imagen|elegante|moderna|divertida/i,
        redes: /redes|facebook|instagram|whatsapp|web|sitio/i,
        cta_principal: /contactar|comprar|reservar|ver|saber|conocer|llamar|escribir/i
      }
      
      const pattern = spontaneousPatterns[field as keyof typeof spontaneousPatterns]
      return pattern ? pattern.test(text) : false
    }
    
    // Extracción inteligente de información basada en el contexto
    const extractBusinessInfo = (text: string) => {
      const info: any = {}
      
      // Detectar nombre de negocio (palabras clave como "se llama", "negocio", "empresa", "proyecto")
      const namePatterns = [
        /se llama\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
        /negocio\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
        /empresa\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
        /proyecto\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i
      ]
      
      for (const pattern of namePatterns) {
        const match = text.match(pattern)
        if (match) {
          info.nombre_negocio = match[1].trim()
          break
        }
      }
      
      // Detectar rubro/actividad - mejorado para alquiler de departamentos
      const rubroPatterns = [
        /alquiler\s+de\s+departamentos?/i,
        /alquiler\s+temporario\s+de\s+departamentos?/i,
        /departamentos?\s+alquiler/i,
        /alquiler\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
        /restaurante/i,
        /gastronomía/i,
        /consultoría/i,
        /diseño/i,
        /tienda\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
        /servicios?\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i
      ]
      
      for (const pattern of rubroPatterns) {
        const match = text.match(pattern)
        if (match) {
          info.rubro = match[0].trim()
          break
        }
      }
      
      // Detectar ubicación
      const ubicacionPatterns = [
        /([A-Z][a-z]+),\s*([A-Z][a-z]+)/, // Ciudad, País
        /ubicado?\s+en\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
        /en\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?=\.|$)/i
      ]
      
      for (const pattern of ubicacionPatterns) {
        const match = text.match(pattern)
        if (match) {
          info.ubicacion = match[1].trim()
          break
        }
      }
      
      return info
    }

    // Extraer información adicional si el usuario proporciona más datos
    const additionalInfo = extractBusinessInfo(userInput)
    
    // Función de validación mejorada
    const needsClarification = (response: string, field: string) => {
      const clarificationRules = {
        nombre_usuario: (text: string) => text.length < 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(text),
        rubro: (text: string) => text.length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(text),
        ubicacion: (text: string) => text.length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9,.-]+$/.test(text),
        objetivo_web: (text: string) => text.length < 3 || !/(reservar|vender|mostrar|contactar|informar|comprar|promocionar)/i.test(text),
        publico_objetivo: (text: string) => text.length < 3 || !/(jóvenes|adultos|familias|empresas|niños|mujeres|hombres|turistas|clientes)/i.test(text),
        cta_principal: (text: string) => text.length < 3 || !/(contactar|comprar|reservar|ver|saber|conocer|llamar|escribir)/i.test(text)
      }

      const rule = clarificationRules[field as keyof typeof clarificationRules]
      return rule ? rule(response) : false
    }

    // Generar preguntas de clarificación más específicas
    const getClarificationQuestion = (field: string) => {
      const clarificationQuestions = {
        nombre_usuario: '¿Podrías decirme tu nombre para poder personalizar mejor la conversación?',
        rubro: '¿Podrías ser más específico? Por ejemplo: restaurante de comida italiana, consultoría de marketing, tienda de ropa deportiva, etc.',
        ubicacion: '¿Podrías indicar la ciudad y país donde operas? Por ejemplo: Buenos Aires, Argentina o Madrid, España.',
        objetivo_web: '¿Qué objetivo concreto tiene tu web? Por ejemplo: conseguir más reservas, vender productos online, mostrar tu portafolio, etc.',
        publico_objetivo: '¿A qué público específico te diriges? Por ejemplo: jóvenes profesionales, familias con niños, empresas medianas, etc.',
        cta_principal: '¿Qué acción específica querés que realicen los visitantes? Por ejemplo: reservar ahora, comprar online, contactarte por WhatsApp, etc.'
      }

      return clarificationQuestions[field as keyof typeof clarificationQuestions] || '¿Podrías dar más detalles, por favor?'
    }

    // Si el usuario proporciona información espontánea, adaptar la respuesta
    if (isSpontaneousInfo(userInput, currentQuestion.field) && currentQuestion.field !== 'nombre_usuario') {
      // Para respuestas espontáneas, extraer la información relevante y devolverla como procesada
      const extractedInfo = extractBusinessInfo(userInput)
      if (extractedInfo[currentQuestion.field]) {
        return {
          value: extractedInfo[currentQuestion.field],
          confidence: 0.9,
          needsClarification: false,
          suggestions: [],
          additionalInfo: extractedInfo,
          isSpontaneous: true
        }
      }
    }

    // Verificar si necesita clarificación
    if (needsClarification(processedValue, currentQuestion.field)) {
      return {
        value: processedValue,
        confidence: 0.3,
        needsClarification: true,
        clarificationQuestion: getClarificationQuestion(currentQuestion.field),
        suggestions: [],
        additionalInfo: {} // No incluir info adicional si la respuesta principal no es válida
      }
    }

    return {
      value: processedValue,
      confidence: 0.8,
      needsClarification: false,
      suggestions: [],
      additionalInfo: additionalInfo // Incluir información adicional detectada
    }
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

    // Simular tiempo de "escritura" del asistente
    await new Promise(resolve => setTimeout(resolve, 1000))

    const currentQuestion = DISCOVERY_QUESTIONS[currentQuestionIndex]
    
    try {
      // Analizar con DeepSeek
      const analysis = await analyzeWithDeepSeek(inputValue, currentQuestion)
      
      // Verificar si necesita clarificación
      if (analysis.needsClarification) {
        const clarificationMessage: Message = {
          id: 'clarification-' + Date.now(),
          text: `🤔 Para entender mejor, ${analysis.clarificationQuestion}`,
          sender: 'assistant',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, clarificationMessage])
        setIsTyping(false)
        setIsProcessing(false)
        return
      }
      
      // Actualizar información del negocio
      const updatedBusinessInfo = { ...businessInfo }
      updatedBusinessInfo[currentQuestion.field as keyof BusinessInfo] = analysis.value
      
      // Si hay información adicional, actualizarla también
      if (analysis.additionalInfo) {
        Object.keys(analysis.additionalInfo).forEach(key => {
          if (analysis.additionalInfo[key] && !updatedBusinessInfo[key as keyof BusinessInfo]) {
            updatedBusinessInfo[key as keyof BusinessInfo] = analysis.additionalInfo[key]
          }
        })
      }
      
      setBusinessInfo(updatedBusinessInfo)

      // Si la respuesta fue espontánea, enviar un mensaje más natural
      if (analysis.isSpontaneous) {
        const spontaneousMessage: Message = {
          id: 'spontaneous-' + Date.now(),
          text: `¡Entendido! ${analysis.additionalInfo.nombre_negocio ? `He registrado que tu negocio se llama "${analysis.additionalInfo.nombre_negocio}"` : ''} ${analysis.additionalInfo.rubro ? `y que se dedica al ${analysis.additionalInfo.rubro}.` : '.'} ¡Gracias por la información!`,
          sender: 'assistant',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, spontaneousMessage])
        setIsTyping(false)
        
        // Esperar un momento antes de la siguiente pregunta
        await new Promise(resolve => setTimeout(resolve, 800))
      } else {
        // NO enviar mensaje de confirmación - pasar directamente a la siguiente pregunta
        setIsTyping(false)
        
        // Esperar un momento antes de la siguiente pregunta
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      // Pasar a la siguiente pregunta o finalizar
      if (currentQuestionIndex < DISCOVERY_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        
        const nextQuestion = DISCOVERY_QUESTIONS[currentQuestionIndex + 1]
        
        // Reemplazar variables en el texto de la pregunta si es necesario
        let questionText = nextQuestion.text
        if (questionText.includes('{{nombre_usuario}}') && updatedBusinessInfo.nombre_usuario) {
          questionText = questionText.replace('{{nombre_usuario}}', updatedBusinessInfo.nombre_usuario)
        }
        
        // Si ya tenemos información que responde a la siguiente pregunta, saltarla
        if (updatedBusinessInfo[nextQuestion.field as keyof BusinessInfo]) {
          // Saltar esta pregunta y pasar a la siguiente
          await new Promise(resolve => setTimeout(resolve, 200))
          setCurrentQuestionIndex(prev => prev + 2) // Saltar la siguiente pregunta
          
          if (currentQuestionIndex + 2 < DISCOVERY_QUESTIONS.length) {
            const nextNextQuestion = DISCOVERY_QUESTIONS[currentQuestionIndex + 2]
            let nextNextQuestionText = nextNextQuestion.text
            if (nextNextQuestionText.includes('{{nombre_usuario}}') && updatedBusinessInfo.nombre_usuario) {
              nextNextQuestionText = nextNextQuestionText.replace('{{nombre_usuario}}', updatedBusinessInfo.nombre_usuario)
            }
            
            const nextNextMessage: Message = {
              id: 'question-' + Date.now(),
              text: nextNextQuestionText,
              sender: 'assistant',
              timestamp: new Date()
            }
            
            setMessages(prev => [...prev, nextNextMessage])
          } else {
            // Si saltamos a la última pregunta, finalizar
            const summaryMessage: Message = {
              id: 'summary-' + Date.now(),
              text: `🎉 ¡Excelente, ${updatedBusinessInfo.nombre_usuario || 'amigo'}! Ya tengo toda la información necesaria.

---

## 📋 **RESUMEN DE TU PROYECTO**

✅ **Negocio**: ${updatedBusinessInfo.nombre_negocio || 'Por definir'}  
✅ **Rubro**: ${updatedBusinessInfo.rubro || 'Por definir'}  
✅ **Ubicación**: ${updatedBusinessInfo.ubicacion || 'Por definir'}  
✅ **Público objetivo**: ${updatedBusinessInfo.publico_objetivo || 'Por definir'}  
✅ **Objetivo web**: ${updatedBusinessInfo.objetivo_web || 'Por definir'}  
✅ **Estilo de marca**: ${updatedBusinessInfo.estilo_marca || 'Por definir'}  

---

🚀 **¡Ahora estoy listo para generar tu landing page profesional!**`,
              sender: 'assistant',
              timestamp: new Date()
            }
            
            setMessages(prev => [...prev, summaryMessage])
            
            // Notificar que la información está completa
            setTimeout(() => {
              onBusinessInfoComplete(updatedBusinessInfo)
            }, 1000)
          }
        } else {
          const nextMessage: Message = {
            id: 'question-' + Date.now(),
            text: questionText,
            sender: 'assistant',
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, nextMessage])
        }
      } else {
        // Finalizar el chat con resumen
        const summaryMessage: Message = {
          id: 'summary-' + Date.now(),
          text: `🎉 ¡Excelente, ${updatedBusinessInfo.nombre_usuario || 'amigo'}! Ya tengo toda la información necesaria.

---

## 📋 **RESUMEN DE TU PROYECTO**

✅ **Negocio**: ${updatedBusinessInfo.nombre_negocio || 'Por definir'}  
✅ **Rubro**: ${updatedBusinessInfo.rubro || 'Por definir'}  
✅ **Ubicación**: ${updatedBusinessInfo.ubicacion || 'Por definir'}  
✅ **Público objetivo**: ${updatedBusinessInfo.publico_objetivo || 'Por definir'}  
✅ **Objetivo web**: ${updatedBusinessInfo.objetivo_web || 'Por definir'}  
✅ **Estilo de marca**: ${updatedBusinessInfo.estilo_marca || 'Por definir'}  

---

🚀 **¡Ahora estoy listo para generar tu landing page profesional!**`,
          sender: 'assistant',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, summaryMessage])
        
        // Notificar que la información está completa
        setTimeout(() => {
          onBusinessInfoComplete(updatedBusinessInfo)
        }, 1000)
      }

    } catch (error) {
      console.error('Error processing message:', error)
      
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        text: 'Lo siento, hubo un error al procesar tu respuesta. Por favor, intenta nuevamente.',
        sender: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    }

    setIsProcessing(false)
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
    return ((currentQuestionIndex + 1) / DISCOVERY_QUESTIONS.length) * 100
  }

  const getModuleInfo = (field: string) => {
    const moduleMap: { [key: string]: string } = {
      nombre_usuario: 'Información de contacto',
      nombre_negocio: 'Hero Slide Interactivo',
      rubro: 'Hero Slide Interactivo',
      publico_objetivo: 'Bloque de Características',
      diferencial: 'Bloque de Refuerzo',
      ubicacion: 'Contacto WhatsApp',
      objetivo_web: 'Bloque CTA',
      estilo_marca: 'Estilo visual general',
      redes: 'Redes Sociales',
      cta_principal: 'Bloque CTA'
    }
    
    return moduleMap[field] || 'Información del Negocio'
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-gray-900 dark:text-slate-100 p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
            Hablemos de tu Negocio
          </h1>
          <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed">
            Charla con nuestro asistente y descubrí cómo crear tu landing page profesional en minutos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 h-full overflow-hidden">
          {/* Left Section - WhatsApp Chat */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl flex flex-col overflow-hidden shadow-lg">
            {/* WhatsApp Header */}
            <div className="bg-green-600 dark:bg-green-700 text-white p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-700" />
              </div>
              <div>
                <h2 className="font-semibold">Asistente de Descubrimiento</h2>
                <p className="text-xs opacity-90">Conectado y listo para ayudarte</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-slate-300 mb-1">
                <span>Progreso de nuestra conversación</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900">
              {messages.map(renderMessage)}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm border border-gray-200 dark:border-slate-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-slate-800 p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isProcessing || isGenerating}
                  autoFocus
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing || isGenerating}
                  className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Business Info Preview */}
          <div className="flex flex-col gap-6 h-full overflow-hidden">
            {/* Business Info Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 flex-1 flex flex-col min-h-0 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold">📊 Información del Negocio</h3>
                </div>
                <Badge variant="outline" className="text-xs border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300">
                  {Object.keys(businessInfo).length} / {DISCOVERY_QUESTIONS.length} campos
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {businessInfo.nombre_usuario && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">👤 Usuario</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.nombre_usuario}</p>
                  </div>
                )}

                {businessInfo.nombre_negocio && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🏢 Nombre del Negocio</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.nombre_negocio}</p>
                  </div>
                )}

                {businessInfo.rubro && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">🎯 Rubro</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.rubro}</p>
                  </div>
                )}

                {businessInfo.ubicacion && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">📍 Ubicación</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.ubicacion}</p>
                  </div>
                )}

                {businessInfo.diferencial && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-pink-600 dark:text-pink-400 mb-2">⭐ Diferencial</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.diferencial}</p>
                  </div>
                )}

                {businessInfo.publico_objetivo && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">👥 Público Objetivo</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.publico_objetivo}</p>
                  </div>
                )}

                {businessInfo.objetivo_web && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">🎯 Objetivo Web</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.objetivo_web}</p>
                  </div>
                )}

                {businessInfo.estilo_marca && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">🎨 Estilo de Marca</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.estilo_marca}</p>
                  </div>
                )}

                {businessInfo.redes && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">📱 Redes Sociales</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.redes}</p>
                  </div>
                )}

                {businessInfo.cta_principal && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">🎯 CTA Principal</h4>
                    <p className="text-gray-800 dark:text-gray-200">{businessInfo.cta_principal}</p>
                  </div>
                )}
              </div>

                {Object.keys(businessInfo).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-slate-400">
                    <Building2 className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Comienza el chat</p>
                    <p className="text-sm text-center max-w-xs">
                      Responde las preguntas específicas y verás la información de tu negocio aquí
                    </p>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={onManualMode}
                disabled={isGenerating}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Modo Manual
              </Button>
              
              {Object.keys(businessInfo).length >= DISCOVERY_QUESTIONS.length - 2 && (
                <Button
                  onClick={() => onBusinessInfoComplete(businessInfo)}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white dark:from-green-700 dark:to-emerald-600"
                >
                  Generar Landing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}