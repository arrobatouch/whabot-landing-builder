import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log(`AI Generation Request - Type: ${type}, Prompt: ${prompt.substring(0, 100)}...`)

    const zai = await ZAI.create()

    if (type === 'content') {
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en marketing y creación de contenido para landing pages. Genera contenido atractivo y profesional en español.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })

      const generatedContent = completion.choices[0]?.message?.content

      return NextResponse.json({
        success: true,
        content: generatedContent,
        provider: 'zai'
      })
    }

    if (type === 'image') {
      const response = await zai.images.generations.create({
        prompt: prompt,
        size: '1024x1024'
      })

      const imageBase64 = response.data[0].base64

      return NextResponse.json({
        success: true,
        image: imageBase64,
        provider: 'zai'
      })
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 })

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: `Failed to generate content: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}