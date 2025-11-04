'use client'

import { useEffect, useState } from 'react'

interface LandingDataBridgeProps {
  businessInfo?: any
  processedContent?: any
  blocks?: any[]
  onDataReady?: (landingData: any) => void
  onComplete?: () => void
}

export function LandingDataBridge({ 
  businessInfo, 
  processedContent, 
  blocks, 
  onDataReady,
  onComplete 
}: LandingDataBridgeProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)

  useEffect(() => {
    if (businessInfo && processedContent && blocks && blocks.length > 0) {
      processData()
    }
  }, [businessInfo, processedContent, blocks])

  const processData = async () => {
    setIsProcessing(true)
    setProcessingStep('Validando datos...')
    setProcessingProgress(10)

    console.log("🌉 BRIDGE: Iniciando procesamiento de datos")
    console.log("📊 BRIDGE: Datos recibidos:", {
      businessInfo: businessInfo?.nombre_negocio || 'Sin nombre',
      processedContent: !!processedContent,
      blocksCount: blocks?.length || 0
    })

    try {
      // Simular procesamiento de datos - aumentado el tiempo para que se vea mejor
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setProcessingStep('Organizando contenido...')
      setProcessingProgress(30)
      console.log("📋 BRIDGE: Contenido organizado")
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProcessingStep('Optimizando bloques...')
      setProcessingProgress(60)
      console.log("🔧 BRIDGE: Bloques optimizados")
      
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setProcessingStep('Preparando para construcción...')
      setProcessingProgress(90)
      console.log("🏗️ BRIDGE: Preparado para construcción")
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Preparar datos finales
      const landingData = {
        businessInfo,
        processedContent,
        blocks,
        timestamp: new Date().toISOString(),
        status: 'ready'
      }
      
      console.log("✅ BRIDGE: Datos finales preparados:", {
        businessName: landingData.businessInfo?.nombre_negocio || 'Sin nombre',
        totalBlocks: landingData.blocks?.length || 0,
        hasProcessedContent: !!landingData.processedContent,
        timestamp: landingData.timestamp
      })
      
      // Notificar que los datos están listos
      if (onDataReady) {
        console.log("📤 BRIDGE: Enviando onDataReady...")
        onDataReady(landingData)
      }
      
      setProcessingProgress(100)
      setProcessingStep('¡Listo!')
      
      // Pequeña espera antes de completar
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Notificar completado
      if (onComplete) {
        console.log("🎉 BRIDGE: Enviando onComplete...")
        onComplete()
      }
      
    } catch (error) {
      console.error('❌ BRIDGE: Error al procesar datos:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Si no hay datos, no mostrar nada
  if (!businessInfo || !processedContent || !blocks || blocks.length === 0) {
    return null
  }

  // Si está procesando, mostrar indicador de progreso
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">🌉 Procesando tu landing</h3>
            
            {/* Info del negocio */}
            {businessInfo?.nombre_negocio && (
              <div className="text-center">
                <p className="text-sm font-medium text-primary">
                  {businessInfo.nombre_negocio}
                </p>
                {businessInfo.rubro && (
                  <p className="text-xs text-muted-foreground">
                    {businessInfo.rubro}
                  </p>
                )}
              </div>
            )}
            
            {/* Progress bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              {processingStep}
            </p>
            
            {/* Detalles de procesamiento */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>📦 Bloques: {blocks?.length || 0}</p>
              <p>📄 Contenido: {processedContent ? '✅' : '❌'}</p>
              <p>🏢 Negocio: {businessInfo?.nombre_negocio || 'Sin nombre'}</p>
            </div>
            
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si no está procesando, no mostrar nada (el componente es un puente, no una UI)
  return null
}