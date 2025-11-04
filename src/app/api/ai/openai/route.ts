import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// Precios de OpenAI (actualizados a noviembre 2024)
const OPENAI_PRICING = {
  'gpt-4o-mini': {
    input: 0.00015,  // $0.15 per 1M tokens
    output: 0.0006   // $0.60 per 1M tokens
  },
  'gpt-4o': {
    input: 0.0025,   // $2.50 per 1M tokens  
    output: 0.01     // $10.00 per 1M tokens
  }
}

interface OpenAIRequest {
  systemPrompt?: string
  context?: string
  userMessage: string
  businessData?: any
  model?: 'gpt-4o-mini' | 'gpt-4o'
  temperature?: number
  maxTokens?: number
}

interface OpenAIResponse {
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
  model_used: string
  duration: number
}

async function callOpenAI(messages: Array<{ role: string; content: string }>, model: string = 'gpt-4o-mini', temperature: number = 0.7, maxTokens: number = 800): Promise<OpenAIResponse> {
  const startTime = Date.now()
  
  try {
    logger.info('openai_call_start', 'openai', {
      operation: 'call_openai',
      model,
      message_count: messages.length,
      estimated_input_tokens: messages.reduce((sum, msg) => sum + msg.content.length / 4, 0) // Estimación aproximada
    })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
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
        model_used: model,
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
    const pricing = OPENAI_PRICING[model as keyof typeof OPENAI_PRICING] || OPENAI_PRICING['gpt-4o-mini']
    const cost = {
      input: (usage.prompt_tokens / 1000000) * pricing.input,
      output: (usage.completion_tokens / 1000000) * pricing.output,
      total: ((usage.prompt_tokens / 1000000) * pricing.input) + ((usage.completion_tokens / 1000000) * pricing.output),
      currency: 'USD'
    }

    logger.info('openai_call_success', 'openai', {
      operation: 'call_openai',
      model,
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
      model_used: model,
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
      error: `Exception: ${error.message}`,
      model_used: model,
      duration
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json() as OpenAIRequest
    
    logger.info('openai_request_start', 'openai', {
      operation: 'handle_request',
      model: body.model || 'gpt-4o-mini',
      has_system_prompt: !!body.systemPrompt,
      has_context: !!body.context,
      message_length: body.userMessage?.length || 0
    })

    if (!body.userMessage) {
      logger.warn('openai_validation_error', 'openai', {
        operation: 'handle_request',
        error: 'Missing userMessage'
      })
      
      return NextResponse.json(
        { error: 'userMessage is required' },
        { status: 400 }
      )
    }

    // Preparar mensajes para OpenAI
    const messages: Array<{ role: string; content: string }> = []
    
    if (body.systemPrompt) {
      messages.push({ role: 'system', content: body.systemPrompt })
    }

    // Añadir contexto si existe
    if (body.context) {
      messages.push({ role: 'system', content: `Contexto:\n${body.context}` })
    }

    messages.push({ role: 'user', content: body.userMessage })

    // Llamar a OpenAI
    const result = await callOpenAI(
      messages,
      body.model || 'gpt-4o-mini',
      body.temperature || 0.7,
      body.maxTokens || 800
    )

    const totalDuration = Date.now() - startTime
    
    logger.info('openai_request_complete', 'openai', {
      operation: 'handle_request',
      success: result.success,
      duration: totalDuration,
      ai_duration: result.duration,
      tokens: result.usage,
      cost: result.cost
    })

    return NextResponse.json(result)

  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('openai_request_exception', 'openai', {
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

// Endpoint para obtener métricas
export async function GET() {
  try {
    const metrics = logger.getMetrics()
    
    logger.info('openai_metrics_accessed', 'openai', {
      operation: 'get_metrics'
    })
    
    return NextResponse.json({
      service: 'openai',
      metrics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('openai_metrics_error', 'openai', {
      operation: 'get_metrics',
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Failed to get metrics' },
      { status: 500 }
    )
  }
}