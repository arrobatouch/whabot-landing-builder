'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Trash2, Edit, Plus, Save, X } from 'lucide-react'
import { AssistantExample, defaultExamples, addExample, updateExample, deleteExample, toggleExample } from '@/data/assistantExamples'

interface ExamplesManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function ExamplesManager({ isOpen, onClose }: ExamplesManagerProps) {
  const [examples, setExamples] = useState<AssistantExample[]>([])
  const [editingExample, setEditingExample] = useState<AssistantExample | null>(null)
  const [newExampleText, setNewExampleText] = useState('')
  const [newExampleCategory, setNewExampleCategory] = useState('general')
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    setExamples([...defaultExamples])
  }, [])

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'retail', label: 'Retail' },
    { value: 'services', label: 'Servicios' },
    { value: 'food', label: 'Alimentos' },
    { value: 'beauty', label: 'Belleza' },
    { value: 'creative', label: 'Creativo' },
    { value: 'education', label: 'Educación' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'professional', label: 'Profesional' },
    { value: 'technology', label: 'Tecnología' }
  ]

  const handleAddExample = () => {
    if (newExampleText.trim()) {
      const newExample = addExample(newExampleText.trim(), newExampleCategory)
      setExamples([...defaultExamples])
      setNewExampleText('')
      setNewExampleCategory('general')
      setIsAddingNew(false)
    }
  }

  const handleUpdateExample = () => {
    if (editingExample && editingExample.text.trim()) {
      updateExample(editingExample.id, editingExample)
      setExamples([...defaultExamples])
      setEditingExample(null)
    }
  }

  const handleDeleteExample = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ejemplo?')) {
      deleteExample(id)
      setExamples([...defaultExamples])
    }
  }

  const handleToggleActive = (id: string) => {
    toggleExample(id)
    setExamples([...defaultExamples])
  }

  const activeExamples = examples.filter(ex => ex.active)
  const inactiveExamples = examples.filter(ex => !ex.active)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestionar Ejemplos del Asistente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Agregar Nuevo Ejemplo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Agregar Nuevo Ejemplo</span>
                <Button
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingNew ? 'Cancelar' : 'Agregar Ejemplo'}
                </Button>
              </CardTitle>
            </CardHeader>
            {isAddingNew && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-example-text">Texto del Ejemplo</Label>
                  <Textarea
                    id="new-example-text"
                    value={newExampleText}
                    onChange={(e) => setNewExampleText(e.target.value)}
                    placeholder="Ej: Tengo una tienda de ropa y quiero vender online..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-example-category">Categoría</Label>
                  <Select value={newExampleCategory} onValueChange={setNewExampleCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddExample} disabled={!newExampleText.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Ejemplo
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Ejemplos Activos */}
          <Card>
            <CardHeader>
              <CardTitle>Ejemplos Activos ({activeExamples.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeExamples.map((example) => (
                  <div key={example.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={example.active}
                          onCheckedChange={() => handleToggleActive(example.id)}
                        />
                        <Badge variant="secondary">{example.category}</Badge>
                      </div>
                      <p className="text-sm">{example.text}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => setEditingExample(example)}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteExample(example.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {activeExamples.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No hay ejemplos activos</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ejemplos Inactivos */}
          <Card>
            <CardHeader>
              <CardTitle>Ejemplos Inactivos ({inactiveExamples.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inactiveExamples.map((example) => (
                  <div key={example.id} className="flex items-start justify-between p-3 border rounded-lg opacity-60">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={example.active}
                          onCheckedChange={() => handleToggleActive(example.id)}
                        />
                        <Badge variant="outline">{example.category}</Badge>
                      </div>
                      <p className="text-sm">{example.text}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => setEditingExample(example)}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteExample(example.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {inactiveExamples.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No hay ejemplos inactivos</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de Edición */}
        {editingExample && (
          <Dialog open={!!editingExample} onOpenChange={() => setEditingExample(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Ejemplo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-example-text">Texto del Ejemplo</Label>
                  <Textarea
                    id="edit-example-text"
                    value={editingExample.text}
                    onChange={(e) => setEditingExample({
                      ...editingExample,
                      text: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-example-category">Categoría</Label>
                  <Select 
                    value={editingExample.category} 
                    onValueChange={(value) => setEditingExample({
                      ...editingExample,
                      category: value
                    })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingExample(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateExample}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}