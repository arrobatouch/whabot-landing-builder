// Script para probar las imágenes de fondo en los bloques
console.log('🧪 Probando imágenes de fondo...');

// Lista de imágenes de prueba
const testImages = [
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
  'https://via.placeholder.com/1200x600/4f46e5/ffffff?text=Imagen+de+Prueba',
  '', // URL vacía para probar gradiente por defecto
  'https://url-invalida-que-no-existe.com/imagen.jpg' // URL inválida
];

// Función para probar una imagen
function testImage(url) {
  return new Promise((resolve) => {
    console.log(`\n📝 Probando imagen: ${url || '(vacío)'}`);
    
    if (!url || url.trim() === '') {
      console.log('✅ URL vacía - se usará gradiente por defecto');
      resolve({ url, success: true, message: 'Gradiente por defecto' });
      return;
    }
    
    const img = new Image();
    const startTime = Date.now();
    
    img.onload = () => {
      const loadTime = Date.now() - startTime;
      console.log(`✅ Imagen cargada exitosamente en ${loadTime}ms`);
      console.log(`   - Dimensiones: ${img.naturalWidth}x${img.naturalHeight}`);
      resolve({ url, success: true, loadTime, dimensions: `${img.naturalWidth}x${img.naturalHeight}` });
    };
    
    img.onerror = () => {
      const loadTime = Date.now() - startTime;
      console.log(`❌ Error al cargar la imagen después de ${loadTime}ms`);
      resolve({ url, success: false, loadTime, error: 'No se pudo cargar la imagen' });
    };
    
    img.src = url;
    
    // Timeout después de 10 segundos
    setTimeout(() => {
      if (!img.complete) {
        console.log(`⏰ Timeout después de 10 segundos`);
        resolve({ url, success: false, error: 'Timeout' });
      }
    }, 10000);
  });
}

// Función principal para probar todas las imágenes
async function testAllImages() {
  console.log('🚀 Iniciando pruebas de imágenes de fondo...\n');
  
  const results = [];
  
  for (const imageUrl of testImages) {
    const result = await testImage(imageUrl);
    results.push(result);
    
    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumen de resultados
  console.log('\n📊 Resumen de resultados:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Imágenes exitosas: ${successful.length}`);
  console.log(`❌ Imágenes fallidas: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n📝 Imágenes que funcionaron:');
    successful.forEach(result => {
      console.log(`   - ${result.url}: ${result.dimensions || result.message}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n⚠️  Imágenes que fallaron:');
    failed.forEach(result => {
      console.log(`   - ${result.url}: ${result.error}`);
    });
  }
  
  console.log('\n💡 Recomendaciones:');
  console.log('1. Usa URLs de imágenes confiables (Unsplash, Placeholder, etc.)');
  console.log('2. Las imágenes vacías mostrarán un gradiente por defecto');
  console.log('3. Las imágenes inválidas mostrarán un mensaje de error');
  console.log('4. Verifica que las imágenes sean accesibles desde tu navegador');
  
  console.log('\n🎯 Prueba completada');
}

// Ejecutar pruebas
testAllImages().catch(console.error);