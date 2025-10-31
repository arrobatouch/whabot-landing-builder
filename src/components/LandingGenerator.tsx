'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, CheckCircle, X, Play, Pause } from 'lucide-react'

interface LandingGeneratorProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

interface GenerationStep {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  status: 'pending' | 'active' | 'completed'
}

interface ActivityItem {
  id: string
  icon: string
  text: string
  timestamp: Date
}

export function LandingGenerator({ isOpen, onClose, onComplete }: LandingGeneratorProps) {
  const [totalProgress, setTotalProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activities, setActivities] = useState<ActivityItem[]>([])

  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: 'analyzing',
      title: 'Analizando tu negocio',
      description: 'Nuestra IA está comprendiendo tus necesidades',
      icon: '🔍',
      progress: 0,
      status: 'pending'
    },
    {
      id: 'planning',
      title: 'Planificando estructura',
      description: 'Diseñando la arquitectura perfecta para tu landing',
      icon: '🏗️',
      progress: 0,
      status: 'pending'
    },
    {
      id: 'creating',
      title: 'Creando contenido',
      description: 'Generando textos persuasivos y profesionales',
      icon: '✍️',
      progress: 0,
      status: 'pending'
    },
    {
      id: 'designing',
      title: 'Diseñando visual',
      description: 'Seleccionando imágenes y estilos adecuados',
      icon: '🎨',
      progress: 0,
      status: 'pending'
    },
    {
      id: 'building',
      title: 'Construyendo bloques',
      description: 'Ensamblando los componentes de tu landing',
      icon: '🧩',
      progress: 0,
      status: 'pending'
    },
    {
      id: 'finalizing',
      title: 'Finalizando detalles',
      description: 'Aplicando toques finales y optimizaciones',
      icon: '✅',
      progress: 0,
      status: 'pending'
    }
  ])

  // Simulación del progreso
  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const interval = setInterval(() => {
      setTotalProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 2, 100)
        
        // Actualizar el paso actual
        if (newProgress > 0 && newProgress <= 20) {
          updateStepProgress('analyzing', newProgress * 5)
          if (prev <= 0) {
            addActivity('🔍', 'Analizando información del negocio...')
          }
        } else if (newProgress > 20 && newProgress <= 35) {
          updateStepProgress('planning', (newProgress - 20) * 6.67)
          if (prev <= 20) {
            setCurrentStep(1)
            addActivity('🏗️', 'Diseñando estructura de la landing...')
          }
        } else if (newProgress > 35 && newProgress <= 55) {
          updateStepProgress('creating', (newProgress - 35) * 5)
          if (prev <= 35) {
            setCurrentStep(2)
            addActivity('✍️', 'Generando textos persuasivos...')
          }
        } else if (newProgress > 55 && newProgress <= 75) {
          updateStepProgress('designing', (newProgress - 55) * 5)
          if (prev <= 55) {
            setCurrentStep(3)
            addActivity('🎨', 'Buscando imágenes en Unsplash...')
          }
        } else if (newProgress > 75 && newProgress <= 95) {
          updateStepProgress('building', (newProgress - 75) * 5)
          if (prev <= 75) {
            setCurrentStep(4)
            addActivity('🧩', 'Ensamblando bloques...')
          }
        } else if (newProgress > 95) {
          updateStepProgress('finalizing', (newProgress - 95) * 5)
          if (prev <= 95) {
            setCurrentStep(5)
            addActivity('✅', 'Aplicando toques finales...')
          }
        }

        // Completar la generación
        if (newProgress >= 100) {
          setTimeout(() => {
            setIsPlaying(false)
            addActivity('🎉', '¡Landing generada con éxito!')
            
            // Cerrar automáticamente después de un breve delay
            setTimeout(() => {
              if (onComplete) {
                onComplete()
              }
              onClose()
            }, 1500)
          }, 1000)
        }

        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isOpen, isPlaying])

  const updateStepProgress = (stepId: string, progress: number) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        const newProgress = Math.min(progress, 100)
        const status = newProgress >= 100 ? 'completed' : 'active'
        return { ...step, progress: newProgress, status }
      }
      return step
    }))
  }

  const addActivity = (icon: string, text: string) => {
    const newActivity: ActivityItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      icon,
      text,
      timestamp: new Date()
    }
    setActivities(prev => [newActivity, ...prev.slice(0, 4)]) // Mantener solo las últimas 5 actividades
  }

  const resetGenerator = () => {
    setTotalProgress(0)
    setCurrentStep(0)
    setIsPlaying(true)
    setActivities([])
    setSteps(prev => prev.map(step => ({
      ...step,
      progress: 0,
      status: 'pending'
    })))
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Creando tu Landing IA
              </h1>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-slate-400">Generando tu landing page inteligente...</p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Progreso Total</span>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300">
              {totalProgress.toFixed(1)}%
            </Badge>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${totalProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 p-6">
          {/* Steps Section */}
          <div className="md:col-span-2 space-y-3">
            {steps.map((step, index) => (
              <Card 
                key={step.id}
                className={`transition-all duration-300 ${
                  step.status === 'active' 
                    ? 'bg-purple-900/20 border-purple-600/50 shadow-lg shadow-purple-600/10' 
                    : step.status === 'completed'
                    ? 'bg-green-900/10 border-green-600/30'
                    : 'bg-slate-800/50 border-slate-700/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'active'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 animate-spin'
                        : step.status === 'completed'
                        ? 'bg-green-600'
                        : 'bg-slate-700 border-2 border-slate-600'
                    }`}>
                      <span className="text-lg">{step.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${
                          step.status === 'active' ? 'text-purple-400' : 
                          step.status === 'completed' ? 'text-green-400' : 'text-slate-200'
                        }`}>
                          {step.title}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            step.status === 'active' 
                              ? 'bg-purple-900/50 text-purple-300' 
                              : step.status === 'completed'
                              ? 'bg-green-900/50 text-green-300'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {step.progress.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3">{step.description}</p>
                      
                      {step.status !== 'pending' && (
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              step.status === 'completed' ? 'bg-green-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'
                            }`}
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    ⚡ Últimas acciones
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={togglePlayPause}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={resetGenerator}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      ↻
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activities.length > 0 ? (
                    activities.map(activity => (
                      <div key={activity.id} className="flex items-start gap-2 p-2 bg-slate-700/30 rounded">
                        <span className="text-sm mt-0.5">{activity.icon}</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{activity.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">
                      Esperando inicio de la generación...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Banner */}
            <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-700/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-pulse">⚙️</div>
                  <div>
                    <h3 className="font-semibold text-amber-400 mb-1">
                      {totalProgress >= 100 ? '¡Generación completada!' : 'Generación en progreso...'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {totalProgress >= 100 
                        ? 'Tu landing está lista para editar'
                        : 'El progreso avanza según se generan textos, imágenes y bloques'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Actions */}
            {totalProgress >= 100 && (
              <div className="space-y-2">
                <Button 
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ver Landing Generada
                </Button>
                <Button 
                  onClick={resetGenerator}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Generar Nueva Landing
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}