// Test script simple para DeepSeek API
const testDeepSeek = async () => {
  console.log('🧪 Probando integración de DeepSeek...')
  
  try {
    // Test 1: Generación de contenido con DeepSeek
    console.log('\n📝 Test 1: Generación de contenido con DeepSeek')
    const response1 = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Hola, ¿cómo estás?',
        type: 'content',
        provider: 'deepseek'
      })
    })
    
    const result1 = await response1.json()
    console.log('Status:', response1.status)
    console.log('Response:', result1)
    
    if (result1.success) {
      console.log('✅ Test 1 exitoso!')
    } else {
      console.log('❌ Test 1 fallido:', result1.error)
    }
    
    // Test 2: Generación de contenido con Z-AI
    console.log('\n📝 Test 2: Generación de contenido con Z-AI')
    const response2 = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Hola, ¿cómo estás?',
        type: 'content',
        provider: 'zai'
      })
    })
    
    const result2 = await response2.json()
    console.log('Status:', response2.status)
    console.log('Response:', result2)
    
    if (result2.success) {
      console.log('✅ Test 2 exitoso!')
    } else {
      console.log('❌ Test 2 fallido:', result2.error)
    }
    
    // Test 3: Intento de generación de imagen con DeepSeek (debería fallar)
    console.log('\n🖼️ Test 3: Generación de imagen con DeepSeek (debería fallar)')
    const response3 = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Un gato bonito',
        type: 'image',
        provider: 'deepseek'
      })
    })
    
    const result3 = await response3.json()
    console.log('Status:', response3.status)
    console.log('Response:', result3)
    
    if (!result3.success && result3.error?.includes('does not support image generation')) {
      console.log('✅ Test 3 exitoso! (Error esperado)')
    } else {
      console.log('❌ Test 3 fallido: Se esperaba un error de generación de imagen')
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

// Ejecutar pruebas
testDeepSeek()