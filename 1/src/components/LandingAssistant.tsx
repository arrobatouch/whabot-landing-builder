'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2, Settings, FileText, Edit, Save, Building2, Star, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

interface LandingAssistantProps {
  onGenerateLanding: (prompt: string, processedContent?: any) => void
  onManualMode: () => void
  isGenerating?: boolean
}

interface ProcessedContent {
  businessInfo: {
    name: string
    type: string
    location: string
    description: string
  }
  features: Array<{
    icon: string
    title: string
    description: string
  }>
  products: Array<{
    name: string
    description: string
    price?: string
  }>
  contact: {
    phone?: string
    email?: string
    address?: string
  }
  cta: {
    primary: string
    secondary?: string
  }
}

type Step = 'input' | 'processing' | 'editing'

export function LandingAssistant({ onGenerateLanding, onManualMode, isGenerating = false }: LandingAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState<ProcessedContent | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>('input')
  const [isProcessing, setIsProcessing] = useState(false)

  const processBusinessInput = (userPrompt: string) => {
    // Convertir a minúsculas para mejor coincidencia
    const prompt = userPrompt.toLowerCase()
    
    // Mapeo de industrias
    const industryMap = {
      'restaurante': { industry: 'restaurant', businessType: 'Restaurante', mainGoal: 'mostrar menú y tomar reservas', targetAudience: 'clientes locales' },
      'comida': { industry: 'food', businessType: 'Negocio de Comida', mainGoal: 'vender productos alimenticios', targetAudience: 'amantes de la buena comida' },
      'nutricionista': { industry: 'health', businessType: 'Consultorio de Nutrición', mainGoal: 'mostrar servicios y citas', targetAudience: 'personas saludables' },
      'cursos': { industry: 'education', businessType: 'Academia Online', mainGoal: 'vender cursos online', targetAudience: 'estudiantes' },
      'programación': { industry: 'technology', businessType: 'Academia de Programación', mainGoal: 'enseñar habilidades técnicas', targetAudience: 'desarrolladores' },
      'diseño': { industry: 'design', businessType: 'Estudio de Diseño', mainGoal: 'mostrar portafolio', targetAudience: 'empresas y clientes' },
      'tienda': { industry: 'retail', businessType: 'Tienda Online', mainGoal: 'vender productos', targetAudience: 'compradores online' },
      'servicios': { industry: 'services', businessType: 'Empresa de Servicios', mainGoal: 'ofrecer servicios profesionales', targetAudience: 'empresas' },
      'consultoría': { industry: 'consulting', businessType: 'Consultora', mainGoal: 'asesorar a clientes', targetAudience: 'empresas' },
      'fotografía': { industry: 'photography', businessType: 'Estudio de Fotografía', mainGoal: 'mostrar trabajo fotográfico', targetAudience: 'clientes' },
      'skincare': { industry: 'beauty', businessType: 'Marca de Skincare', mainGoal: 'vender productos de belleza', targetAudience: 'mujeres' },
      'zapatería': { industry: 'fashion', businessType: 'Zapatería', mainGoal: 'vender calzado', targetAudience: 'clientes de moda' },
      'alquiler': { industry: 'hospitality', businessType: 'Alquileres Temporarios', mainGoal: 'alquilar propiedades vacacionales', targetAudience: 'turistas y familias' },
      'temporario': { industry: 'hospitality', businessType: 'Alquileres Temporarios', mainGoal: 'alquilar propiedades vacacionales', targetAudience: 'turistas y familias' },
      'costa': { industry: 'hospitality', businessType: 'Complejos Turísticos', mainGoal: 'ofrecer alojamiento en la playa', targetAudience: 'veraneantes' },
      'gaviotas': { industry: 'hospitality', businessType: 'Alquileres Las Gaviotas', mainGoal: 'alquilar departamentos en la costa', targetAudience: 'turistas y familias' },
      'departamento': { industry: 'hospitality', businessType: 'Alquiler de Departamentos', mainGoal: 'alquilar propiedades equipadas', targetAudience: 'turistas y familias' },
      'complejo': { industry: 'hospitality', businessType: 'Complejos Turísticos', mainGoal: 'ofrecer alojamiento con amenities', targetAudience: 'familias y parejas' },
      'playa': { industry: 'hospitality', businessType: 'Alojamiento en la Playa', mainGoal: 'ofrecer alojamiento cerca del mar', targetAudience: 'veraneantes' },
      'vacacional': { industry: 'hospitality', businessType: 'Alquileres Vacacionales', mainGoal: 'alquilar para temporadas', targetAudience: 'turistas' }
    }

    // Detectar industria y tipo de negocio
    let industry = 'general'
    let businessType = 'Mi Negocio'
    let mainGoal = 'promocionar productos y servicios'
    let targetAudience = 'clientes potenciales'

    for (const [keyword, info] of Object.entries(industryMap)) {
      if (prompt.includes(keyword)) {
        industry = info.industry
        businessType = info.businessType
        mainGoal = info.mainGoal
        targetAudience = info.targetAudience
        break
      }
    }

    // Detectar ubicación
    let location = null
    const coastCities = [
      'las gaviotas', 'villa gesell', 'mar del plata', 'pinamar', 'cariló',
      'monte hermoso', 'necochea', 'miramar', 'san clemente del tuyú',
      'santa teresita', 'mar de las pampas', 'mar azul'
    ]

    for (const city of coastCities) {
      if (prompt.includes(city)) {
        if (city === 'las gaviotas') {
          location = 'Las Gaviotas, Partido de Villa Gesell, Buenos Aires'
        } else if (city === 'villa gesell') {
          location = 'Villa Gesell, Buenos Aires'
        } else if (city === 'mar del plata') {
          location = 'Mar del Plata, Buenos Aires'
        } else if (city === 'pinamar') {
          location = 'Pinamar, Buenos Aires'
        } else {
          location = `${city.charAt(0).toUpperCase() + city.slice(1)}, Buenos Aires`
        }
        break
      }
    }

    // Detectar nombres de complejos
    if (prompt.includes('océano') || prompt.includes('oceano')) {
      businessType = businessType.includes('Océano') ? businessType : `Complejo Océano - ${businessType}`
    }
    if (prompt.includes('médano') || prompt.includes('medano')) {
      businessType = businessType.includes('Médano') ? businessType : `Complejo Médano 29 - ${businessType}`
    }

    return {
      industry,
      businessType,
      location,
      mainGoal,
      targetAudience
    }
  }

  const generateContentForBusiness = (businessInfo: any) => {
    if (businessInfo.industry === 'hospitality') {
      return {
        businessInfo: {
          name: businessInfo.businessType,
          type: businessInfo.businessType,
          location: businessInfo.location || 'Zona costera, Argentina',
          description: businessInfo.location 
            ? `Complejo turístico especializado en alquileres temporarios en ${businessInfo.location}. Propiedades equipadas con todas las comodidades para unas vacaciones inolvidables.`
            : 'Complejo turístico especializado en alquileres temporarios. Propiedades equipadas con todas las comodidades para unas vacaciones inolvidables.'
        },
        features: [
          {
            icon: '🌊',
            title: 'Ubicación privilegiada',
            description: businessInfo.location && businessInfo.location.includes('Las Gaviotas') 
              ? 'A pocos pasos de la playa y cerca del centro de Mar de las Pampas' 
              : 'Ubicaciones estratégicas en las mejores zonas'
          },
          {
            icon: '🏡',
            title: 'Propiedades equipadas',
            description: 'Departamentos amplios y equipados, con diseño moderno y detalles cuidados'
          },
          {
            icon: '💬',
            title: 'Atención personalizada',
            description: 'Trato directo con los dueños para una experiencia única'
          },
          {
            icon: '🔒',
            title: 'Seguridad y tranquilidad',
            description: 'Ambiente seguro y pacífico para disfrutar tus vacaciones'
          }
        ],
        products: businessInfo.businessType.includes('Océano') || businessInfo.businessType.includes('Médano') ? [
          {
            name: '🌊 Complejo Océano',
            description: 'Elegancia y confort a pasos del mar. Ideal para parejas o familias pequeñas.',
            price: 'Desde $95.000 por noche'
          },
          {
            name: '🏝️ Complejo Médano 29',
            description: 'Diseño moderno rodeado de pinos, a solo tres cuadras de la playa.',
            price: 'Desde $115.000 por noche'
          }
        ] : [
          {
            name: 'Departamento Estándar',
            description: 'Amplio y equipado, ideal para familias.',
            price: 'Desde $85.000 por noche'
          }
        ],
        contact: {
          phone: businessInfo.location && businessInfo.location.includes('Las Gaviotas') ? '(02255) 15-123456' : '(011) 15-12345678',
          email: 'reservas@complejo.com.ar',
          address: businessInfo.location || 'Costa Atlántica, Argentina'
        },
        cta: {
          primary: 'Ver Propiedades',
          secondary: 'Reservar Ahora'
        }
      }
    }

    // Contenido por defecto para otros tipos de negocios
    return {
      businessInfo: {
        name: businessInfo.businessType,
        type: businessInfo.businessType,
        location: businessInfo.location || 'Argentina',
        description: `Empresa especializada en ${businessInfo.industry} con atención personalizada y servicio de calidad.`
      },
      features: [
        {
          icon: '⭐',
          title: 'Calidad Superior',
          description: `Productos de ${businessInfo.industry} de la más alta calidad`
        },
        {
          icon: '🚀',
          title: 'Rápido y Eficiente',
          description: 'Servicio ágil y resultados inmediatos'
        },
        {
          icon: '💎',
          title: 'Profesionalismo',
          description: 'Equipo experto dedicado a tu satisfacción'
        }
      ],
      products: [
        {
          name: 'Producto Destacado',
          description: 'Nuestro producto más popular con excelente relación calidad-precio.',
          price: 'Consultar precio'
        }
      ],
      contact: {
        phone: '(011) 1234-5678',
        email: 'contacto@negocio.com.ar',
        address: businessInfo.location || 'Argentina'
      },
      cta: {
        primary: 'Ver Más',
        secondary: 'Contactar'
      }
    }
  }

  const simulateAIProcessing = async (userPrompt: string) => {
    setIsProcessing(true)
    setCurrentStep('processing')
    
    // Simular diferentes etapas de procesamiento
    const stages = [
      { message: 'Analizando tipo de negocio...', duration: 800 },
      { message: 'Identificando productos y servicios...', duration: 1000 },
      { message: 'Extrayendo información de contacto...', duration: 600 },
      { message: 'Generando estructura de contenido...', duration: 1200 },
      { message: 'Optimizando texto para conversión...', duration: 800 }
    ]

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.duration))
    }

    // Procesar el input del usuario para detectar el tipo de negocio
    const businessInfo = processBusinessInput(userPrompt)
    
    // Generar contenido basado en el tipo de negocio detectado
    const content = generateContentForBusiness(businessInfo)
    
    setProcessedContent(content)
    setEditedContent(content)
    setIsProcessing(false)
    setCurrentStep('editing')
  }

  const handleGenerate = async () => {
    if (prompt.trim()) {
      await simulateAIProcessing(prompt.trim())
    }
  }

  const handleContinueToBuilder = () => {
    if (editedContent) {
      onGenerateLanding(prompt, editedContent)
    }
  }

  const handleEditContent = () => {
    setIsEditing(true)
  }

  const handleSaveContent = () => {
    if (editedContent) {
      setProcessedContent(editedContent)
      setIsEditing(false)
    }
  }

  const updateBusinessInfo = (field: string, value: string) => {
    if (editedContent) {
      setEditedContent({
        ...editedContent,
        businessInfo: {
          ...editedContent.businessInfo,
          [field]: value
        }
      })
    }
  }

  const handleBackToInput = () => {
    setCurrentStep('input')
    setProcessedContent(null)
    setEditedContent(null)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100 p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full overflow-hidden">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 h-full overflow-hidden">
          {/* Left Section - Input */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                Constructor de Landing IA
              </h1>
              <p className="text-base text-slate-300 leading-relaxed">
                Crea una landing page profesional en minutos usando nuestra inteligencia artificial. 
                Solo describe tu negocio y deja que la IA haga el resto.
              </p>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-xl font-bold mb-2">👋 ¡Hola! Bienvenido al Constructor</h2>
              <p className="text-slate-400 mb-2 text-sm">¿Querés que la IA cree tu página por vos?</p>
              <p className="text-slate-300 text-sm">Contame un poco sobre tu negocio 👇</p>
            </div>
            
            <div className="flex-1 mb-6 overflow-hidden">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Tengo una mueblería en Buenos Aires, quiero vender online"
                className="w-full h-full min-h-[120px] bg-slate-900/50 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-violet-500 resize-none overflow-y-auto"
                disabled={isGenerating || isProcessing}
              />
            </div>

            {/* Fixed buttons at bottom of left column */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0">
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating || isProcessing}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-4 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analizar con IA
                  </>
                )}
              </Button>
              
              <Button
                onClick={onManualMode}
                disabled={isGenerating || isProcessing}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Modo Manual
              </Button>
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="flex flex-col gap-6 h-full overflow-hidden">
            {/* Timeline */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 flex-shrink-0">
              <div className="flex items-center gap-2 mb-6">
                {currentStep === 'input' && <FileText className="h-5 w-5 text-slate-400" />}
                {currentStep === 'processing' && <Loader2 className="h-5 w-5 text-violet-400 animate-spin" />}
                {currentStep === 'editing' && <Edit className="h-5 w-5 text-green-400" />}
                <h3 className="text-lg font-semibold">
                  {currentStep === 'input' && '📊 Esperando Información'}
                  {currentStep === 'processing' && '⚙️ Procesando Información'}
                  {currentStep === 'editing' && '✅ Contenido Procesado'}
                </h3>
              </div>
              
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700 z-0">
                  <div 
                    className={`h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ${
                      currentStep === 'input' ? 'w-0' : 
                      currentStep === 'processing' ? 'w-1/2' : 
                      'w-full'
                    }`}
                  />
                </div>
                
                {/* Steps */}
                <div className="flex justify-between w-full relative z-10">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'input' 
                        ? 'border-violet-500 bg-violet-500/20 text-violet-400' 
                        : 'border-green-500 bg-green-500 text-white'
                    }`}>
                      {currentStep !== 'input' ? '✓' : '1'}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      currentStep === 'input' ? 'text-violet-400' : 'text-green-400'
                    }`}>
                      Información
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'processing' 
                        ? 'border-violet-500 bg-violet-500/20 text-violet-400 animate-pulse' 
                        : currentStep === 'editing' 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-slate-600 text-slate-500'
                    }`}>
                      {currentStep === 'editing' ? '✓' : '2'}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      currentStep === 'processing' ? 'text-violet-400' : 
                      currentStep === 'editing' ? 'text-green-400' : 'text-slate-500'
                    }`}>
                      Procesamiento
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      currentStep === 'editing' 
                        ? 'border-violet-500 bg-violet-500/20 text-violet-400' 
                        : 'border-slate-600 text-slate-500'
                    }`}>
                      3
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      currentStep === 'editing' ? 'text-violet-400' : 'text-slate-500'
                    }`}>
                      Edición
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Box */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <h3 className="text-lg font-semibold">
                    {currentStep === 'input' && '📄 Esperando tu descripción'}
                    {currentStep === 'processing' && '📄 Analizando contenido'}
                    {currentStep === 'editing' && '📄 Información del Negocio'}
                  </h3>
                </div>
                {processedContent && (
                  <Button
                    onClick={isEditing ? handleSaveContent : handleEditContent}
                    size="sm"
                    variant={isEditing ? "default" : "outline"}
                    className="text-xs"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-3 w-3 mr-1" />
                        Guardar
                      </>
                    ) : (
                      <>
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {currentStep === 'input' ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <FileText className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Esperando tu información</p>
                    <p className="text-sm text-center max-w-xs">
                      Ingresa la descripción de tu negocio en la columna izquierda y haz clic en "Analizar con IA" para comenzar
                    </p>
                  </div>
                ) : currentStep === 'processing' ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 text-violet-400 animate-spin mb-4" />
                    <p className="text-lg font-medium text-slate-300 mb-2">
                      Procesando tu información...
                    </p>
                    <p className="text-sm text-slate-500 text-center max-w-xs">
                      La IA está analizando y estructurando el contenido de tu negocio
                    </p>
                  </div>
                ) : processedContent ? (
                  <div className="space-y-6">
                    {/* Business Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-400" />
                        🏢 Datos Generales
                      </h3>
                      <div className="space-y-2">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={editedContent?.businessInfo.name || ''}
                              onChange={(e) => updateBusinessInfo('name', e.target.value)}
                              className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
                              placeholder="Nombre del negocio"
                            />
                            <input
                              type="text"
                              value={editedContent?.businessInfo.type || ''}
                              onChange={(e) => updateBusinessInfo('type', e.target.value)}
                              className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
                              placeholder="Tipo de negocio"
                            />
                            <textarea
                              value={editedContent?.businessInfo.description || ''}
                              onChange={(e) => updateBusinessInfo('description', e.target.value)}
                              className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100"
                              placeholder="Descripción"
                              rows={3}
                            />
                          </>
                        ) : (
                          <>
                            <div className="bg-slate-900/30 rounded-lg p-3">
                              <strong className="text-slate-300">Nombre:</strong> {processedContent.businessInfo.name}
                            </div>
                            <div className="bg-slate-900/30 rounded-lg p-3">
                              <strong className="text-slate-300">Tipo:</strong> {processedContent.businessInfo.type}
                            </div>
                            <div className="bg-slate-900/30 rounded-lg p-3">
                              <strong className="text-slate-300">Ubicación:</strong> {processedContent.businessInfo.location}
                            </div>
                            <div className="bg-slate-900/30 rounded-lg p-3">
                              <strong className="text-slate-300">Descripción:</strong> {processedContent.businessInfo.description}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        ⭐ Por Qué Elegirnos
                      </h3>
                      <div className="space-y-2">
                        {processedContent.features.map((feature, index) => (
                          <div key={index} className="bg-slate-900/30 rounded-lg p-3 flex items-start gap-3">
                            <span className="text-lg">{feature.icon}</span>
                            <div>
                              <p className="font-medium text-slate-200">{feature.title}</p>
                              <p className="text-sm text-slate-400">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Products */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        🛍️ Productos Destacados
                      </h3>
                      <div className="space-y-3">
                        {processedContent.products.map((product, index) => (
                          <div key={index} className="bg-slate-900/30 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-slate-200">{product.name}</h4>
                              {product.price && (
                                <span className="text-green-400 font-medium">{product.price}</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">{product.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-400" />
                        📞 Información de Contacto
                      </h3>
                      <div className="space-y-2">
                        {processedContent.contact.phone && (
                          <div className="bg-slate-900/30 rounded-lg p-3 flex items-center gap-2">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{processedContent.contact.phone}</span>
                          </div>
                        )}
                        {processedContent.contact.email && (
                          <div className="bg-slate-900/30 rounded-lg p-3 flex items-center gap-2">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{processedContent.contact.email}</span>
                          </div>
                        )}
                        {processedContent.contact.address && (
                          <div className="bg-slate-900/30 rounded-lg p-3 flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{processedContent.contact.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Fixed Action Buttons - Outside scroll area */}
              {currentStep === 'editing' && processedContent && (
                <div className="mt-6 pt-4 border-t border-slate-700 space-y-3 flex-shrink-0">
                  <Button
                    onClick={handleContinueToBuilder}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Continuar al Constructor
                  </Button>
                  
                  <Button
                    onClick={handleBackToInput}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Volver a editar información
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}