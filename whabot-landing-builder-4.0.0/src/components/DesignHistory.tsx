'use client'

import { SavedDesign } from '@/hooks/useDesignHistory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Eye, Edit, Trash2, Copy, Calendar, Save } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface DesignHistoryProps {
  designs: SavedDesign[]
  onLoadDesign: (id: string) => void
  onDeleteDesign: (id: string) => void
  onDuplicateDesign: (id: string) => void
  onSaveCurrentDesign: (name: string) => void
  currentBlocksLength: number
}

export function DesignHistory({
  designs,
  onLoadDesign,
  onDeleteDesign,
  onDuplicateDesign,
  onSaveCurrentDesign,
  currentBlocksLength
}: DesignHistoryProps) {
  const [newDesignName, setNewDesignName] = useState('')
  const [editingName, setEditingName] = useState<{ id: string; name: string } | null>(null)

  const handleSaveCurrent = () => {
    if (newDesignName.trim() && currentBlocksLength > 0) {
      onSaveCurrentDesign(newDesignName.trim())
      setNewDesignName('')
    }
  }

  const handleUpdateName = (id: string) => {
    if (editingName && editingName.name.trim()) {
      // Aquí deberíamos actualizar el nombre del diseño
      // Por ahora, solo cerramos el modo de edición
      setEditingName(null)
    }
  }

  if (designs.length === 0) {
    return (
      <div className="space-y-6">
        {/* Guardar diseño actual */}
        {currentBlocksLength > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Guardar Diseño Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nombre del diseño..."
                  value={newDesignName}
                  onChange={(e) => setNewDesignName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveCurrent()}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleSaveCurrent}
                  disabled={!newDesignName.trim()}
                >
                  Guardar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tienes {currentBlocksLength} bloques en tu diseño actual
              </p>
            </CardContent>
          </Card>
        )}

        {/* Estado vacío */}
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Save className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">No tienes diseños guardados</p>
            <p className="text-xs mt-1">
              {currentBlocksLength > 0 
                ? 'Guarda tu diseño actual para empezar' 
                : 'Crea un diseño y guárdalo para verlo aquí'
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Guardar diseño actual */}
      {currentBlocksLength > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Guardar Diseño Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Nombre del diseño..."
                value={newDesignName}
                onChange={(e) => setNewDesignName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveCurrent()}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleSaveCurrent}
                disabled={!newDesignName.trim()}
              >
                Guardar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tienes {currentBlocksLength} bloques en tu diseño actual
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de diseños */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Tus Diseños Guardados</h3>
        <div className="grid gap-4">
          {designs.map((design) => (
            <Card key={design.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Encabezado */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingName?.id === design.id ? (
                        <div className="flex space-x-2">
                          <Input
                            value={editingName.name}
                            onChange={(e) => setEditingName({ ...editingName, name: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateName(design.id)}
                            className="h-8"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdateName(design.id)}
                          >
                            Guardar
                          </Button>
                        </div>
                      ) : (
                        <h4 className="font-medium text-sm">{design.name}</h4>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {design.blocks.length} bloques
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(design.updatedAt), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vista previa */}
                  {design.preview && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h5 className="font-medium text-xs text-foreground mb-1">
                        {design.preview.title}
                      </h5>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {design.preview.description}
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoadDesign(design.id)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Cargar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDuplicateDesign(design.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingName({ id: design.id, name: design.name })}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteDesign(design.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}