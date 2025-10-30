'use client'

import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { LayoutDashboard, Star, MessageSquare, Phone, Footprints, Zap, DollarSign, BarChart3, Clock, HelpCircle, ImageIcon, ListOrdered, ShoppingCart, Grid3X3, MessageCircle, Share2, Sliders, Video, Timer, Megaphone, Menu } from 'lucide-react'

interface ModuleItem {
  type: string
  name: string
  icon: React.ReactNode
  category: 'basic' | 'advanced'
}

const modules: ModuleItem[] = [
  { type: 'navigation', name: 'Barra de Navegación', icon: <Menu className="h-4 w-4" />, category: 'basic' },
  { type: 'hero-slide', name: 'Hero Slide Interactivo', icon: <Sliders className="h-4 w-4" />, category: 'basic' },
  { type: 'reinforcement', name: 'Bloque de Refuerzo', icon: <Zap className="h-4 w-4" />, category: 'basic' },
  { type: 'features', name: 'Bloque de Características', icon: <Star className="h-4 w-4" />, category: 'basic' },
  { type: 'hero-split', name: 'Bloque Hero Dividido', icon: <LayoutDashboard className="h-4 w-4" />, category: 'basic' },
  { type: 'product-features', name: 'Caract. del producto', icon: <Grid3X3 className="h-4 w-4" />, category: 'basic' },
  { type: 'countdown', name: 'Bloque Promocional', icon: <Timer className="h-4 w-4" />, category: 'basic' },
  { type: 'social-media', name: 'Redes Sociales', icon: <Share2 className="h-4 w-4" />, category: 'basic' },
  { type: 'youtube', name: 'Bloque YouTube', icon: <Video className="h-4 w-4" />, category: 'basic' },
  { type: 'product-cart', name: 'Bloque de Carrito de Productos', icon: <ShoppingCart className="h-4 w-4" />, category: 'basic' },
  { type: 'testimonials', name: 'Bloque de Testimonios', icon: <MessageSquare className="h-4 w-4" />, category: 'basic' },
  { type: 'cta', name: 'Bloque CTA', icon: <Phone className="h-4 w-4" />, category: 'basic' },
  { type: 'pricing', name: 'Bloque de Precios', icon: <DollarSign className="h-4 w-4" />, category: 'basic' },
  { type: 'whatsapp-contact', name: 'Contacto WhatsApp', icon: <MessageCircle className="h-4 w-4" />, category: 'basic' },
  { type: 'footer', name: 'Bloque de Pie de Página', icon: <Footprints className="h-4 w-4" />, category: 'basic' },
  { type: 'image', name: 'Bloque de Imagen', icon: <ImageIcon className="h-4 w-4" />, category: 'basic' },
  { type: 'stats', name: 'Bloque de Estadísticas', icon: <BarChart3 className="h-4 w-4" />, category: 'advanced' },
  { type: 'timeline', name: 'Bloque de Línea de Tiempo', icon: <Clock className="h-4 w-4" />, category: 'advanced' },
  { type: 'process', name: 'Bloque de Proceso', icon: <ListOrdered className="h-4 w-4" />, category: 'advanced' },
  { type: 'faq', name: 'Bloque de Preguntas Frecuentes', icon: <HelpCircle className="h-4 w-4" />, category: 'advanced' },
  { type: 'hero-banner', name: 'Banner Promocional', icon: <Megaphone className="h-4 w-4" />, category: 'advanced' }
]

function DraggableModule({ module }: { module: ModuleItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: module.type,
    data: { type: module.type }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors ${
        isDragging ? 'opacity-50 shadow-lg' : 'opacity-100'
      }`}
    >
      <div 
        {...listeners}
        className="flex items-center space-x-2 cursor-move select-none"
      >
        {module.icon}
        <span className="text-sm font-medium">{module.name}</span>
      </div>
    </div>
  )
}

export function ModulesPanel() {
  const basicModules = modules.filter(m => m.category === 'basic')
  const advancedModules = modules.filter(m => m.category === 'advanced')

  return (
    <div className="w-full max-w-xs border-r border-border bg-background flex flex-col h-screen">
      <div className="p-6 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Biblioteca de Bloques</h2>
        {/* Indicador visual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-blue-800">Aquí puedes mover bloques</p>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Arrastra los bloques a la zona central para construir tu landing
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar smooth-scroll">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary">Básicos</Badge>
          </div>
          <div className="space-y-2">
            {basicModules.map((module) => (
              <DraggableModule key={module.type} module={module} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline">Avanzados</Badge>
          </div>
          <div className="space-y-2">
            {advancedModules.map((module) => (
              <DraggableModule key={module.type} module={module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}