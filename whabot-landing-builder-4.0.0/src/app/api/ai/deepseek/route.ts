import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = 'sk-153b8d4e9a934698b3906e6fe8126dd1'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface AnalysisRequest {
  question: string
  answer: string
  context: any
  field: string
}

interface ConversationalRequest {
  systemPrompt: string
  context: string
  userMessage: string
  businessData: any
}

interface AnalysisResponse {
  value: any
  confidence: number
  suggestions: string[]
}

async function callDeepSeekAPI(messages: Array<{ role: string; content: string }>) {
  try {
    console.log('Calling DeepSeek API with messages:', messages)
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    console.log('DeepSeek API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API Error:', errorText)
      console.error('Response status:', response.status)
      console.error('Response headers:', response.headers)
      throw new Error(`DeepSeek API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('DeepSeek API response data:', data)
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error calling DeepSeek API:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    throw error
  }
}

function parseAnalysisResponse(response: string, fieldType: string): AnalysisResponse {
  try {
    // Intentar parsear como JSON primero
    try {
      const parsed = JSON.parse(response)
      return {
        value: parsed.value || response,
        confidence: parsed.confidence || 0.8,
        suggestions: parsed.suggestions || []
      }
    } catch {
      // Si no es JSON, procesar como texto
      const lines = response.split('\n').filter(line => line.trim())
      
      if (fieldType === 'array') {
        // Para campos de array, dividir por comas o líneas
        const items = response
          .split(/[,|]/)
          .map(item => item.trim())
          .filter(item => item.length > 0)
        
        return {
          value: items,
          confidence: 0.8,
          suggestions: []
        }
      } else {
        // Para campos de texto, limpiar y devolver
        const cleanText = response
          .replace(/^["']|["']$/g, '') // Quitar comillas
          .replace(/\n/g, ' ') // Reemplazar saltos de línea
          .trim()
        
        return {
          value: cleanText,
          confidence: 0.8,
          suggestions: []
        }
      }
    }
  } catch (error) {
    console.error('Error parsing analysis response:', error)
    return {
      value: response,
      confidence: 0.5,
      suggestions: []
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Detectar si es una solicitud conversacional o de análisis
    if ('systemPrompt' in body) {
      // Es una solicitud conversacional
      const { systemPrompt, context, userMessage, businessData } = body as ConversationalRequest

      if (!systemPrompt || !userMessage) {
        return NextResponse.json(
          { error: 'System prompt and user message are required' },
          { status: 400 }
        )
      }

      // Crear el prompt para DeepSeek en modo conversacional
      const enhancedPrompt = `${systemPrompt}

${context}

Mensaje del usuario: "${userMessage}"

Instrucciones adicionales:
- Responde de manera natural y conversacional
- No muestres datos estructurados ni confirmaciones de campos
- Si el usuario ya proporcionó información, no repitas preguntas
- Sé empático y amigable, como un asesor de negocios
- Mantén un tono profesional pero cercano
- Si tienes suficiente información, sugiere naturalmente pasar a la creación de la landing`

      const messages = [
        { role: 'system', content: enhancedPrompt },
        { role: 'user', content: userMessage }
      ]

      // Llamar a la API de DeepSeek
      const aiResponse = await callDeepSeekAPI(messages)

      return NextResponse.json({
        success: true,
        reply: aiResponse,
        content: aiResponse
      })

    } else {
      // Es una solicitud de análisis (formato antiguo para compatibilidad)
      const { question, answer, context, field } = body as AnalysisRequest

      if (!question || !answer) {
        return NextResponse.json(
          { error: 'Question and answer are required' },
          { status: 400 }
        )
      }

      // Crear el prompt para DeepSeek
      const systemPrompt = `Eres un asistente experto en analizar información de negocios para crear páginas web. 
Tu tarea es analizar las respuestas de los usuarios y extraer información estructurada.

Contexto del negocio actual:
${JSON.stringify(context, null, 2)}

Pregunta actual: "${question}"
Respuesta del usuario: "${answer}"

Instrucciones específicas para el campo "${field}":
- Extrae la información relevante y limpia
- Si es un array (como características o productos), separa los elementos correctamente
- Proporciona un valor limpio y estructurado
- Responde SOLO en formato JSON con la siguiente estructura:
{
  "value": "valor_extraído",
  "confidence": 0.8,
  "suggestions": ["sugerencia1", "sugerencia2"]
}

Ejemplos:
- Para nombre: {"value": "Mi Empresa S.A.", "confidence": 0.9, "suggestions": []}
- Para características: {"value": ["Calidad", "Rapidez", "Precio"], "confidence": 0.8, "suggestions": []}
- Para ubicación: {"value": "Buenos Aires, Argentina", "confidence": 0.9, "suggestions": []}

IMPORTANTE: Tu respuesta debe ser ÚNICAMENTE el JSON válido, sin texto adicional antes o después.`

      const userPrompt = `Analiza la siguiente respuesta y extrae la información para el campo "${field}":

Pregunta: "${question}"
Respuesta: "${answer}"

Proporciona el resultado en formato JSON como se solicita. Responde únicamente con el JSON, sin texto adicional.`

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]

      // Llamar a la API de DeepSeek
      const aiResponse = await callDeepSeekAPI(messages)
      
      // Parsear la respuesta
      const analysis = parseAnalysisResponse(aiResponse, field)

      return NextResponse.json({
        success: true,
        analysis: analysis,
        rawResponse: aiResponse
      })
    }

  } catch (error) {
    console.error('Error in DeepSeek API:', error)
    
    return NextResponse.json(
      { 
        error: 'Error processing request',
        details: error.message 
      },
      { status: 500 }
    )
  }
}