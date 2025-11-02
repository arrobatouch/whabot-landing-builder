'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Send, MessageSquare, Bot, User, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface AnythingLLMChatProps {
  title?: string
  placeholder?: string
  className?: string
  initialMessage?: string
  onBackToAssistant?: () => void
}

export function AnythingLLMChat({ 
  title = "Chat con AnythingLLM", 
  placeholder = "Escribe tu mensaje aquí...",
  className = "",
  initialMessage = "¡Hola! Soy tu asistente de AnythingLLM. ¿En qué puedo ayudarte hoy?",
  onBackToAssistant
}: AnythingLLMChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Generate a unique session ID when component mounts
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)

    // Add initial welcome message
    if (initialMessage) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: initialMessage,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [initialMessage])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // Send message to AnythingLLM API
      const response = await fetch('/api/knowledge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputValue,
          sessionId: sessionId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error en la respuesta de AnythingLLM')
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: 'assistant-' + Date.now(),
        content: data.content || 'Lo siento, no recibí una respuesta válida.',
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message to AnythingLLM:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)

      // Add error message to chat
      const errorChatMessage: Message = {
        id: 'error-' + Date.now(),
        content: `❌ Lo siento, hubo un error al procesar tu mensaje: ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorChatMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-none dark:bg-blue-600' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm border border-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700'
          }`}>
            <div className="flex items-start space-x-2 mb-1">
              {isUser ? (
                <User className="h-4 w-4 text-blue-100 dark:text-blue-200 mt-0.5 flex-shrink-0" />
              ) : (
                <Bot className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-sm whitespace-pre-line flex-1">
                <ReactMarkdown 
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-1 space-y-0.5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-1 space-y-0.5">{children}</ol>,
                    li: ({ children }) => <li className="mb-0.5">{children}</li>,
                    code: ({ children }) => <code className="bg-gray-200 dark:bg-slate-700 px-1 py-0.5 rounded text-xs">{children}</code>
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className={`flex items-center mt-1 ${isUser ? 'justify-end' : 'justify-start'} space-x-1`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card className="border-gray-200 dark:border-slate-700 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>{title}</span>
            {sessionId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                ID: {sessionId.substring(0, 8)}...
              </span>
            )}
            {onBackToAssistant && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToAssistant}
                className="ml-auto"
              >
                Volver al Asistente
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Error Display */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  Error: {error}
                </span>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No hay mensajes aún. ¡Comienza una conversación!</p>
                </div>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Pensando...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1"
                multiline
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}