'use client'

import { BlockRendererProps } from '@/components/BlockRenderer'
import { ModernNavigation } from '@/components/ModernNavigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, ExternalLink, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface NavigationBlockContent {
  logoPosition: 'left' | 'center' | 'right'
  menuPosition: 'left' | 'right'
  companyName: string
  logoUrl: string
  logoUpload: File | null
  customButtons: Array<{ id: string; label: string; url: string }>
  showLandings: boolean
  backgroundColor: string
  textColor: string
  sticky: boolean
  shadow: boolean
}

interface NavigationBlockProps extends BlockRendererProps {
  blocks?: any[] // Para pasar los bloques actuales de la página
}

export function NavigationBlock({ block, onContentChange, blocks = [] }: NavigationBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const content = block.content as NavigationBlockContent || {
    logoPosition: 'left',
    menuPosition: 'right',
    companyName: 'Mi Empresa',
    logoUrl: '',
    logoUpload: null,
    customButtons: [
      { id: 'btn-1', label: 'Inicio', url: '#' },
      { id: 'btn-2', label: 'Servicios', url: '#' },
      { id: 'btn-3', label: 'Contacto', url: '#' }
    ],
    showLandings: true,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    sticky: false,
    shadow: true
  }

  const handleAddCustomButton = () => {
    const label = prompt('Ingrese el texto del botón:')
    if (label) {
      const url = prompt('Ingrese la URL (ej: https://ejemplo.com):')
      if (url) {
        const newButton = {
          id: `btn-${Date.now()}`,
          label,
          url
        }
        const updatedButtons = [...(content.customButtons || []), newButton]
        onContentChange({
          ...content,
          customButtons: updatedButtons
        })
      }
    }
  }

  const handleRemoveButton = (buttonId: string) => {
    const updatedButtons = (content.customButtons || []).filter(btn => btn.id !== buttonId)
    onContentChange({
      ...content,
      customButtons: updatedButtons
    })
  }

  const handleUpdateButton = (buttonId: string, field: 'label' | 'url', value: string) => {
    const updatedButtons = (content.customButtons || []).map(btn =>
      btn.id === buttonId ? { ...btn, [field]: value } : btn
    )
    onContentChange({
      ...content,
      customButtons: updatedButtons
    })
  }

  if (isEditing) {
    return (
      <div className="space-y-6 p-6 bg-card border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Navegación
          </h3>
          <Button onClick={() => setIsEditing(false)} variant="outline">
            Vista Previa
          </Button>
        </div>

        {/* Posición del Logo */}
        <div className="space-y-2">
          <Label>Posición del Logo</Label>
          <Select 
            value={content.logoPosition} 
            onValueChange={(value: 'left' | 'center' | 'right') => 
              onContentChange({ ...content, logoPosition: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Izquierda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Derecha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posición del Menú */}
        <div className="space-y-2">
          <Label>Posición del Menú</Label>
          <Select 
            value={content.menuPosition} 
            onValueChange={(value: 'left' | 'right') => 
              onContentChange({ ...content, menuPosition: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Izquierda</SelectItem>
              <SelectItem value="right">Derecha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nombre de la Empresa */}
        <div className="space-y-2">
          <Label>Nombre de la Empresa</Label>
          <Input 
            value={content.companyName} 
            onChange={(e) => onContentChange({ ...content, companyName: e.target.value })}
            placeholder="Mi Empresa"
          />
        </div>

        {/* Logo URL */}
        <div className="space-y-2">
          <Label>URL del Logo</Label>
          <Input 
            value={content.logoUrl} 
            onChange={(e) => onContentChange({ ...content, logoUrl: e.target.value })}
            placeholder="https://ejemplo.com/logo.png"
          />
        </div>

        {/* Subir Logo */}
        <div className="space-y-2">
          <Label>Subir Logo desde PC</Label>
          <Input 
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onContentChange({ ...content, logoUpload: file })
              }
            }}
          />
        </div>

        {/* Color de Fondo */}
        <div className="space-y-2">
          <Label>Color de Fondo</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              value={content.backgroundColor} 
              onChange={(e) => onContentChange({ ...content, backgroundColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input 
              value={content.backgroundColor} 
              onChange={(e) => onContentChange({ ...content, backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        {/* Color del Texto */}
        <div className="space-y-2">
          <Label>Color del Texto</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color"
              value={content.textColor} 
              onChange={(e) => onContentChange({ ...content, textColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input 
              value={content.textColor} 
              onChange={(e) => onContentChange({ ...content, textColor: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        {/* Navegación Fija */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="sticky"
            checked={content.sticky}
            onCheckedChange={(checked) => onContentChange({ ...content, sticky: checked })}
          />
          <Label htmlFor="sticky">Navegación fija (sticky)</Label>
        </div>

        {/* Sombra */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="shadow"
            checked={content.shadow}
            onCheckedChange={(checked) => onContentChange({ ...content, shadow: checked })}
          />
          <Label htmlFor="shadow">Mostrar sombra</Label>
        </div>

        {/* Mostrar Otras Landings */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="showLandings"
            checked={content.showLandings}
            onCheckedChange={(checked) => onContentChange({ ...content, showLandings: checked })}
          />
          <Label htmlFor="showLandings">Mostrar otras landings en el menú</Label>
        </div>

        {/* Botones Personalizados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Botones Personalizados</Label>
            <Button onClick={handleAddCustomButton} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Botón
            </Button>
          </div>

          <div className="space-y-3">
            {(content.customButtons || []).map((button) => (
              <div key={button.id} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Input
                    value={button.label}
                    onChange={(e) => handleUpdateButton(button.id, 'label', e.target.value)}
                    placeholder="Texto del botón"
                  />
                  <Input
                    value={button.url}
                    onChange={(e) => handleUpdateButton(button.id, 'url', e.target.value)}
                    placeholder="https://ejemplo.com"
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveButton(button.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div 
        className="cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        <ModernNavigation
          blocks={blocks}
          logoPosition={content.logoPosition}
          menuPosition={content.menuPosition}
          companyName={content.companyName}
          logoUrl={content.logoUrl}
          logoUpload={content.logoUpload}
          customButtons={content.customButtons}
          backgroundColor={content.backgroundColor}
          textColor={content.textColor}
          sticky={content.sticky}
          shadow={content.shadow}
        />
      </div>
      
      {/* Indicador de edición */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}