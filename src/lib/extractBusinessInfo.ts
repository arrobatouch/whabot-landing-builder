export function extractBusinessInfo(text: string) {
  const info: any = {}
  
  // Detectar nombre de negocio (palabras clave como "se llama", "negocio", "empresa", "proyecto")
  const namePatterns = [
    /se llama\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
    /negocio\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
    /empresa\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
    /proyecto\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i
  ]
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern)
    if (match) {
      info.nombre_negocio = match[1].trim()
      break
    }
  }
  
  // Detectar rubro/actividad - mejorado para alquiler de departamentos
  const rubroPatterns = [
    /alquiler\s+de\s+departamentos?/i,
    /alquiler\s+temporario\s+de\s+departamentos?/i,
    /departamentos?\s+alquiler/i,
    /alquiler\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
    /restaurante/i,
    /gastronomía/i,
    /consultoría/i,
    /diseño/i,
    /tienda\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
    /servicios?\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i
  ]
  
  for (const pattern of rubroPatterns) {
    const match = text.match(pattern)
    if (match) {
      info.rubro = match[0].trim()
      break
    }
  }
  
  // Detectar ubicación
  const ubicacionPatterns = [
    /([A-Z][a-z]+),\s*([A-Z][a-z]+)/, // Ciudad, País
    /ubicado?\s+en\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
    /en\s+([A-Z][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?=\.|$)/i
  ]
  
  for (const pattern of ubicacionPatterns) {
    const match = text.match(pattern)
    if (match) {
      info.ubicacion = match[1].trim()
      break
    }
  }
  
  // Mapear a la estructura esperada por el route.ts
  return {
    businessType: info.nombre_negocio || 'Empresa',
    name: info.nombre_negocio || 'Empresa',
    industry: info.rubro || 'general',
    location: info.ubicacion || '',
    description: text,
    // Otros campos que podrían ser necesarios
    targetAudience: '',
    mainGoal: '',
    keyFeatures: [],
    brandPersonality: '',
    uniqueSellingProposition: '',
    callToAction: ''
  }
}