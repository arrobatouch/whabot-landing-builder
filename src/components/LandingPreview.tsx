'use client'

import { X, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlockType } from '@/types'
import { BlockRenderer } from '@/components/BlockRenderer'

interface LandingPreviewProps {
  blocks: BlockType[]
  isOpen: boolean
  onClose: () => void
}

export function LandingPreview({ blocks, isOpen, onClose }: LandingPreviewProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vista Previa de la Landing
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({blocks.length} bloques)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Export functionality
                  const landingData = {
                    blocks: blocks,
                    exportDate: new Date().toISOString(),
                    version: '4.3.0'
                  }
                  const blob = new Blob([JSON.stringify(landingData, null, 2)], {
                    type: 'application/json'
                  })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `landing-${Date.now()}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                Cerrar
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content - Full Landing Page */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No hay bloques para previsualizar
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Agrega bloques para ver la vista previa de tu landing page
                </p>
              </div>
            </div>
          ) : (
            <div className="min-h-full">
              {blocks.map((block, index) => (
                <div key={block.id || index} className="relative">
                  <BlockRenderer 
                    block={block} 
                    onContentChange={() => {}} // Read-only in preview
                    isPreview={true}
                  />
                  {/* Block separator for visual clarity */}
                  {index < blocks.length - 1 && (
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}