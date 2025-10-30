'use client'

import { TemplateType, BlockType } from '@/types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, Sparkles, ArrowLeft, Wand2, Plus, X, Eye } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Tabs, TabContent } from '@/components/ui/tabs'
import { useState } from 'react'

interface HeaderProps {
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
  onBackToAssistant?: () => void
  onPreview?: () => void
  showBackButton?: boolean
  blocks?: BlockType[]
  setBlocks?: (blocks: BlockType[]) => void
}

interface LandingPageTab {
  id: string
  name: string
  blocks: BlockType[]
  isActive: boolean
}

export function Header({ 
  selectedTemplate, 
  onTemplateChange, 
  onBackToAssistant, 
  onPreview,
  showBackButton = false,
  blocks = [],
  setBlocks = () => {}
}: HeaderProps) {
  const templates = [
    { value: 'blank', label: 'En Blanco' },
    { value: 'perfumery', label: '💐 Perfumería' },
    { value: 'saas', label: '💻 SaaS' },
    { value: 'portfolio', label: '🎨 Portfolio' },
    { value: 'event', label: '🎟️ Evento' },
    { value: 'next-gen', label: '⚡ Next-Gen' }
  ]

  const [landingTabs, setLandingTabs] = useState<LandingPageTab[]>([
    { id: 'main', name: 'Página Principal', blocks: [], isActive: true }
  ])
  const [showTabs, setShowTabs] = useState(false)

  const addNewTab = () => {
    const newTab: LandingPageTab = {
      id: `tab-${Date.now()}`,
      name: `Página ${landingTabs.length + 1}`,
      blocks: [], // Siempre empezar con bloques vacíos para una nueva página
      isActive: true // La nueva pestaña debe estar activa
    }
    
    // Desactivar todas las pestañas existentes y activar la nueva
    const updatedTabs = landingTabs.map(tab => ({
      ...tab,
      isActive: false,
      // Guardar los bloques actuales solo en la pestaña que estaba activa
      blocks: tab.isActive ? blocks : tab.blocks
    }))
    
    setLandingTabs([...updatedTabs, newTab])
    setBlocks([]) // Limpiar los bloques para la nueva página
  }

  const switchToTab = (tabId: string) => {
    // Guardar los bloques actuales en la pestaña activa actual
    const updatedTabs = landingTabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId,
      // Solo actualizar los bloques de la pestaña que estaba activa
      blocks: tab.isActive ? blocks : tab.blocks
    }))
    
    setLandingTabs(updatedTabs)
    
    // Cargar los bloques de la pestaña seleccionada (siempre empezar desde 0 para nuevas pestañas)
    const selectedTab = updatedTabs.find(tab => tab.id === tabId)
    if (selectedTab) {
      // Para nuevas pestañas, asegurar que siempre empiecen vacías
      const blocksToLoad = selectedTab.blocks.length === 0 && selectedTab.name.includes('Página') 
        ? [] 
        : selectedTab.blocks
      setBlocks(blocksToLoad)
    }
  }

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (landingTabs.length <= 1) return // No permitir cerrar la última pestaña
    
    const updatedTabs = landingTabs.filter(tab => tab.id !== tabId)
    
    // Si la pestaña cerrada estaba activa, activar la primera
    if (landingTabs.find(tab => tab.id === tabId)?.isActive) {
      updatedTabs[0].isActive = true
      setBlocks(updatedTabs[0].blocks)
    }
    
    setLandingTabs(updatedTabs)
  }

  const renameTab = (tabId: string, newName: string) => {
    setLandingTabs(prev => 
      prev.map(tab => 
        tab.id === tabId ? { ...tab, name: newName } : tab
      )
    )
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Tabs de Landing Pages */}
      {showTabs && (
        <div className="border-b border-border">
          <div className="flex items-center px-6 py-2">
            <div className="flex items-center space-x-1 flex-1">
              {landingTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-t-lg cursor-pointer transition-colors ${
                    tab.isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => switchToTab(tab.id)}
                >
                  <span className="text-sm font-medium">{tab.name}</span>
                  {landingTabs.length > 1 && (
                    <button
                      onClick={(e) => closeTab(tab.id, e)}
                      className="ml-1 hover:bg-background/20 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={addNewTab}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Constructor de Páginas Web</h1>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Botón para mostrar/ocultar tabs */}
          <Button
            onClick={() => setShowTabs(!showTabs)}
            variant={showTabs ? "default" : "outline"}
            size="sm"
          >
            {showTabs ? "Ocultar Pestañas" : "Mostrar Pestañas"}
          </Button>
          
          {/* Botón para volver al asistente */}
          {showBackButton && onBackToAssistant && (
            <Button
              onClick={onBackToAssistant}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Asistente IA</span>
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Plantilla:</span>
            <Select value={selectedTemplate} onValueChange={onTemplateChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ThemeToggle />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPreview}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>Vista Previa</span>
          </Button>
          
          <Button size="sm">
            Exportar
          </Button>
        </div>
      </div>
    </header>
  )
}