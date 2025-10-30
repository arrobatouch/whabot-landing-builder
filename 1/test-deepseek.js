// Test script for DeepSeek API integration
const testDeepSeekAPI = async () => {
  try {
    console.log('Testing DeepSeek API integration...')
    
    const response = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hola, ¿cómo estás?',
        type: 'content',
        provider: 'deepseek'
      })
    })

    const result = await response.json()
    console.log('DeepSeek API Response:', result)
    
    if (result.success) {
      console.log('✅ DeepSeek API integration successful!')
      console.log('Generated content:', result.content)
    } else {
      console.log('❌ DeepSeek API integration failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Error testing DeepSeek API:', error.message)
  }
}

testDeepSeekAPI()