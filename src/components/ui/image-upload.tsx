'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  children: React.ReactNode
}

export function ImageUpload({ currentImage, onImageChange, children }: ImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImage || '')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Convertir la imagen a base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setImageUrl(base64)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error al subir la imagen:', error)
      setIsUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
  }

  const handleSave = () => {
    if (imageUrl.trim()) {
      onImageChange(imageUrl)
      setIsOpen(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar Imagen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Vista previa actual */}
          {currentImage && (
            <div>
              <label className="text-sm font-medium mb-2 block">Imagen Actual</label>
              <div className="w-full h-40 bg-muted rounded-md overflow-hidden border">
                <img 
                  src={currentImage} 
                  alt="Imagen actual" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.parentElement
                    if (fallback) {
                      fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Opción 1: Subir archivo */}
          <div>
            <label className="text-sm font-medium mb-2 block">Subir desde tu computadora</label>
            <div className="flex items-center space-x-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Elegir archivo
                  </>
                )}
              </Button>
              {imageUrl && (
                <Button
                  onClick={handleRemoveImage}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Opción 2: URL */}
          <div>
            <label className="text-sm font-medium mb-2 block">O ingresar URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Vista previa de la nueva imagen */}
          {imageUrl && (
            <div>
              <label className="text-sm font-medium mb-2 block">Vista Previa</label>
              <div className="w-full h-40 bg-muted rounded-md overflow-hidden border">
                <img 
                  src={imageUrl} 
                  alt="Vista previa" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.parentElement
                    if (fallback) {
                      fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">⚠️ No se pudo cargar la imagen</div>'
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!imageUrl.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}