import { NextRequest, NextResponse } from 'next/server'

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices: [{
    message: {
      content: string
    }
  }]
}

// Función para limpiar contenido JSON de la IA
function cleanJsonContent(content: string): string {
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

export async function POST(request: NextRequest) {
  try {
    const { messages, temperature = 0.7 } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: 'Messages inválidos' },
        { status: 400 }
      )
    }

    const openaiKey = process.env.OPENAI_API_KEY
    const deepseekKey = process.env.DEEPSEEK_API_KEY
    
    if (!openaiKey && !deepseekKey) {
      return NextResponse.json(
        { success: false, error: 'No hay API keys configuradas' },
        { status: 500 }
      )
    }

    console.log('Making request to AI APIs...')

    // Intentar con DeepSeek primero si hay key
    if (deepseekKey) {
      try {
        const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: messages,
            temperature: temperature,
            max_tokens: 2000,
            response_format: { type: "json_object" }
          }),
        })

        if (deepseekResponse.ok) {
          const data = await deepseekResponse.json()
          const content = data.choices[0]?.message?.content

          if (content) {
            console.log('✅ DeepSeek response successful')
            return NextResponse.json({
              success: true,
              content: cleanJsonContent(content),
              rawContent: content,
              provider: 'deepseek'
            })
          }
        }
      } catch (deepseekError) {
        console.log('DeepSeek failed, trying OpenAI...')
      }
    }

    // Fallback a OpenAI si hay key
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: temperature,
            max_tokens: 2000,
            response_format: { type: "json_object" }
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const content = data.choices[0]?.message?.content

          if (content) {
            console.log('✅ OpenAI response successful')
            return NextResponse.json({
              success: true,
              content: cleanJsonContent(content),
              rawContent: content,
              provider: 'openai'
            })
          }
        }
      } catch (openaiError) {
        console.log('OpenAI also failed')
      }
    }

    throw new Error('Ningún servicio de IA disponible')

  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error en servicio de IA',
        details: error.message 
      },
      { status: 500 }
    )
  }
}