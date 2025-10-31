import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

interface HybridRequest {
  systemPrompt?: string
  context?: string
  userMessage: string
  businessData?: any
  temperature?: number
  maxTokens?: number
}

interface HybridResponse {
  success: boolean
  reply?: string
  content?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  cost?: {
    input: number
    output: number
    total: number
    currency: string
  }
  error?: string
  provider: 'deepseek' | 'openai' | 'fallback'
  model_used: string
  duration: number
  fallback_reason?: string
}

// Configuración de distribución: Obtener desde config o usar default 80/20
async function getProviderDistribution() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/config`)
    if (response.ok) {
      const data = await response.json()
      return {
        deepseek: data.config.deepseek_percentage / 100,
        openai: data.config.openai_percentage / 100
      }
    }
  } catch (error) {
    // Si falla, usar configuración por defecto
    console.warn('Could not fetch admin config, using defaults')
  }
  
  return {
    deepseek: 0.8,  // 80% default
    openai: 0.2     // 20% default
  }
}

// Precios de los servicios
const DEEPSEEK_PRICING = {
  input: 0.00014,  // $0.14 per 1M tokens (aproximado)
  output: 0.00028  // $0.28 per 1M tokens (aproximado)
}

const OPENAI_PRICING = {
  'gpt-4o-mini': {
    input: 0.00015,  // $0.15 per 1M tokens
    output: 0.0006   // $0.60 per 1M tokens
  }
}

// Función para seleccionar proveedor basado en distribución
async function selectProvider(): Promise<'deepseek' | 'openai'> {
  const distribution = await getProviderDistribution()
  const random = Math.random()
  return random < distribution.deepseek ? 'deepseek' : 'openai'
}

// Función para llamar a DeepSeek
async function callDeepSeek(messages: Array<{ role: string; content: string }>, temperature: number = 0.7, maxTokens: number = 800): Promise<HybridResponse> {
  const startTime = Date.now()
  
  try {
    logger.info('deepseek_call_start', 'deepseek', {
      operation: 'call_deepseek',
      message_count: messages.length,
      estimated_input_tokens: messages.reduce((sum, msg) => sum + msg.content.length / 4, 0)
    })

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    })

    const duration = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('deepseek_api_error', 'deepseek', {
        operation: 'call_deepseek',
        error: errorText,
        status: response.status,
        duration
      })
      
      return {
        success: false,
        error: `DeepSeek API Error: ${response.status} - ${errorText}`,
        provider: 'deepseek',
        model_used: 'deepseek-chat',
        duration
      }
    }

    const data = await response.json()
    
    const usage = data.usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }

    // Calcular costos
    const cost = {
      input: (usage.prompt_tokens / 1000000) * DEEPSEEK_PRICING.input,
      output: (usage.completion_tokens / 1000000) * DEEPSEEK_PRICING.output,
      total: ((usage.prompt_tokens / 1000000) * DEEPSEEK_PRICING.input) + ((usage.completion_tokens / 1000000) * DEEPSEEK_PRICING.output),
      currency: 'USD'
    }

    logger.info('deepseek_call_success', 'deepseek', {
      operation: 'call_deepseek',
      duration,
      tokens: {
        input: usage.prompt_tokens,
        output: usage.completion_tokens,
        total: usage.total_tokens
      },
      cost
    })

    return {
      success: true,
      reply: data.choices[0]?.message?.content || '',
      content: data.choices[0]?.message?.content || '',
      usage,
      cost,
      provider: 'deepseek',
      model_used: 'deepseek-chat',
      duration
    }

  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('deepseek_call_exception', 'deepseek', {
      operation: 'call_deepseek',
      error: error.message,
      stack: error.stack,
      duration
    })

    return {
      success: false,
      error: `DeepSeek Exception: ${error.message}`,
      provider: 'deepseek',
      model_used: 'deepseek-chat',
      duration
    }
  }
}

// Función para llamar a OpenAI
async function callOpenAI(messages: Array<{ role: string; content: string }>, temperature: number = 0.7, maxTokens: number = 800): Promise<HybridResponse> {
  const startTime = Date.now()
  
  try {
    logger.info('openai_call_start', 'openai', {
      operation: 'call_openai',
      message_count: messages.length,
      estimated_input_tokens: messages.reduce((sum, msg) => sum + msg.content.length / 4, 0)
    })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    })

    const duration = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('openai_api_error', 'openai', {
        operation: 'call_openai',
        error: errorText,
        status: response.status,
        duration
      })
      
      return {
        success: false,
        error: `OpenAI API Error: ${response.status} - ${errorText}`,
        provider: 'openai',
        model_used: 'gpt-4o-mini',
        duration
      }
    }

    const data = await response.json()
    
    const usage = data.usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }

    // Calcular costos
    const pricing = OPENAI_PRICING['gpt-4o-mini']
    const cost = {
      input: (usage.prompt_tokens / 1000000) * pricing.input,
      output: (usage.completion_tokens / 1000000) * pricing.output,
      total: ((usage.prompt_tokens / 1000000) * pricing.input) + ((usage.completion_tokens / 1000000) * pricing.output),
      currency: 'USD'
    }

    logger.info('openai_call_success', 'openai', {
      operation: 'call_openai',
      duration,
      tokens: {
        input: usage.prompt_tokens,
        output: usage.completion_tokens,
        total: usage.total_tokens
      },
      cost
    })

    return {
      success: true,
      reply: data.choices[0]?.message?.content || '',
      content: data.choices[0]?.message?.content || '',
      usage,
      cost,
      provider: 'openai',
      model_used: 'gpt-4o-mini',
      duration
    }

  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('openai_call_exception', 'openai', {
      operation: 'call_openai',
      error: error.message,
      stack: error.stack,
      duration
    })

    return {
      success: false,
      error: `OpenAI Exception: ${error.message}`,
      provider: 'openai',
      model_used: 'gpt-4o-mini',
      duration
    }
  }
}

// Función principal híbrida con fallback
async function hybridCall(messages: Array<{ role: string; content: string }>, temperature: number = 0.7, maxTokens: number = 800): Promise<HybridResponse> {
  const selectedProvider = await selectProvider()
  let primaryResult: HybridResponse
  let fallbackResult: HybridResponse | null = null

  logger.info('hybrid_call_start', 'hybrid', {
    operation: 'hybrid_call',
    selected_provider: selectedProvider,
    message_count: messages.length
  })

  // Intentar con el proveedor seleccionado
  if (selectedProvider === 'deepseek') {
    primaryResult = await callDeepSeek(messages, temperature, maxTokens)
    
    // Si DeepSeek falla, intentar con OpenAI como fallback
    if (!primaryResult.success) {
      logger.warn('deepseek_fallback', 'hybrid', {
        operation: 'hybrid_call',
        error: primaryResult.error,
        fallback_to: 'openai'
      })
      
      fallbackResult = await callOpenAI(messages, temperature, maxTokens)
      
      if (fallbackResult.success) {
        fallbackResult.provider = 'fallback'
        fallbackResult.fallback_reason = 'deepseek_failed'
        return fallbackResult
      }
    }
  } else {
    primaryResult = await callOpenAI(messages, temperature, maxTokens)
    
    // Si OpenAI falla, intentar con DeepSeek como fallback
    if (!primaryResult.success) {
      logger.warn('openai_fallback', 'hybrid', {
        operation: 'hybrid_call',
        error: primaryResult.error,
        fallback_to: 'deepseek'
      })
      
      fallbackResult = await callDeepSeek(messages, temperature, maxTokens)
      
      if (fallbackResult.success) {
        fallbackResult.provider = 'fallback'
        fallbackResult.fallback_reason = 'openai_failed'
        return fallbackResult
      }
    }
  }

  // Si el proveedor primario tuvo éxito, devolver su resultado
  if (primaryResult.success) {
    logger.info('hybrid_call_success', 'hybrid', {
      operation: 'hybrid_call',
      provider: selectedProvider,
      duration: primaryResult.duration
    })
    
    return primaryResult
  }

  // Si ambos fallaron, devolver el error del proveedor primario
  logger.error('hybrid_call_failed', 'hybrid', {
    operation: 'hybrid_call',
    primary_provider: selectedProvider,
    primary_error: primaryResult.error,
    fallback_error: fallbackResult?.error
  })

  return {
    success: false,
    error: `Both providers failed. ${selectedProvider}: ${primaryResult.error}${fallbackResult ? `, OpenAI: ${fallbackResult.error}` : ''}`,
    provider: selectedProvider,
    model_used: selectedProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini',
    duration: Math.max(primaryResult.duration, fallbackResult?.duration || 0)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json() as HybridRequest
    
    logger.info('hybrid_request_start', 'hybrid', {
      operation: 'handle_request',
      has_system_prompt: !!body.systemPrompt,
      has_context: !!body.context,
      message_length: body.userMessage?.length || 0
    })

    if (!body.userMessage) {
      logger.warn('hybrid_validation_error', 'hybrid', {
        operation: 'handle_request',
        error: 'Missing userMessage'
      })
      
      return NextResponse.json(
        { error: 'userMessage is required' },
        { status: 400 }
      )
    }

    // Preparar mensajes
    const messages: Array<{ role: string; content: string }> = []
    
    if (body.systemPrompt) {
      messages.push({ role: 'system', content: body.systemPrompt })
    }

    if (body.context) {
      messages.push({ role: 'system', content: `Contexto:\n${body.context}` })
    }

    messages.push({ role: 'user', content: body.userMessage })

    // Llamar al sistema híbrido
    const result = await hybridCall(
      messages,
      body.temperature || 0.7,
      body.maxTokens || 800
    )

    const totalDuration = Date.now() - startTime
    
    logger.info('hybrid_request_complete', 'hybrid', {
      operation: 'handle_request',
      success: result.success,
      provider: result.provider,
      duration: totalDuration,
      tokens: result.usage,
      cost: result.cost,
      fallback_used: result.provider === 'fallback'
    })

    return NextResponse.json(result)

  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('hybrid_request_exception', 'hybrid', {
      operation: 'handle_request',
      error: error.message,
      stack: error.stack,
      duration
    })
    
    return NextResponse.json(
      { 
        success: false,
        error: `Failed to process request: ${error.message || 'Unknown error'}`,
        duration
      },
      { status: 500 }
    )
  }
}

// Endpoint para obtener métricas del sistema híbrido
export async function GET() {
  try {
    const metrics = logger.getMetrics()
    const distribution = await getProviderDistribution()
    
    logger.info('hybrid_metrics_accessed', 'hybrid', {
      operation: 'get_metrics'
    })
    
    return NextResponse.json({
      service: 'hybrid-ai',
      distribution: {
        deepseek: Math.round(distribution.deepseek * 100),
        openai: Math.round(distribution.openai * 100)
      },
      metrics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('hybrid_metrics_error', 'hybrid', {
      operation: 'get_metrics',
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Failed to get hybrid metrics' },
      { status: 500 }
    )
  }
}