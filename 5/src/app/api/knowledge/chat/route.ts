import { NextRequest, NextResponse } from 'next/server'

const ANYTHINGLLM_BASE_URL = 'https://orus.teccia.com.ar'
const API_KEY = 'HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N'
const WORKSPACE_SLUG = 'chat-landing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, sessionId } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('Sending request to AnythingLLM...', {
      baseUrl: ANYTHINGLLM_BASE_URL,
      workspace: WORKSPACE_SLUG,
      hasApiKey: !!API_KEY,
      prompt: prompt.substring(0, 100) + '...'
    })

    // Try different API endpoint patterns
    const apiEndpoints = [
      `${ANYTHINGLLM_BASE_URL}/api/v1/workspace/${WORKSPACE_SLUG}/chat`,
      `${ANYTHINGLLM_BASE_URL}/workspace/${WORKSPACE_SLUG}/api/chat`,
      `${ANYTHINGLLM_BASE_URL}/api/workspace/${WORKSPACE_SLUG}/chat`,
    ]

    let response
    let lastError

    for (const endpoint of apiEndpoints) {
      try {
        console.log('Trying endpoint:', endpoint)
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            message: prompt,
            sessionId: sessionId || 'default-session',
            // Include any additional parameters needed by AnythingLLM
          }),
        })

        if (response.ok) {
          console.log('Success with endpoint:', endpoint)
          break
        } else {
          const errorText = await response.text()
          console.log('Endpoint failed:', endpoint, 'Status:', response.status, 'Error:', errorText)
          lastError = { status: response.status, error: errorText }
        }
      } catch (error) {
        console.log('Endpoint error:', endpoint, error)
        lastError = error
      }
    }

    if (!response || !response.ok) {
      console.error('All AnythingLLM API endpoints failed:', lastError)
      
      return NextResponse.json(
        { 
          error: 'Error from AnythingLLM API',
          details: lastError?.error || 'All endpoints failed',
          status: lastError?.status || 500 
        },
        { status: 500 }
      )
    }

    const responseText = await response.text()
    console.log('AnythingLLM response text:', responseText.substring(0, 200))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      console.log('Response text:', responseText)
      
      return NextResponse.json(
        { 
          error: 'Invalid JSON response from AnythingLLM',
          details: 'The API returned non-JSON format',
          rawResponse: responseText.substring(0, 500)
        },
        { status: 500 }
      )
    }

    console.log('AnythingLLM response:', {
      success: true,
      hasContent: !!data.textResponse || !!data.text || !!data.content || !!data.message
    })

    // Return the response in a consistent format
    return NextResponse.json({
      success: true,
      content: data.textResponse || data.text || data.content || data.message || data.response || '',
      sessionId: data.sessionId || sessionId || 'default-session',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Knowledge chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}