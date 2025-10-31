'use client'

import { useDroppable } from '@dnd-kit/core'
import { BlockType, TemplateType } from '@/types'
import { BlockRenderer } from '@/components/BlockRenderer'
import { DropZone } from '@/components/DropZone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface CanvasProps {
  blocks: BlockType[]
  setBlocks: (blocks: BlockType[]) => void
  selectedBlock: string | null
  setSelectedBlock: (id: string | null) => void
  selectedTemplate: TemplateType
}

export function Canvas({ blocks, setBlocks, selectedBlock, setSelectedBlock, selectedTemplate }: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  })

  const moveBlock = (fromIndex: number, toIndex: number) => {
    try {
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) {
        console.error('Invalid indices for moveBlock:', { fromIndex, toIndex, blocksLength: blocks.length })
        return
      }
      
      const newBlocks = [...blocks]
      const [movedBlock] = newBlocks.splice(fromIndex, 1)
      newBlocks.splice(toIndex, 0, movedBlock)
      
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        position: index
      }))
      
      setBlocks(updatedBlocks)
    } catch (error) {
      console.error('Error moving block:', error)
      // Don't throw - prevent client-side crashes
    }
  }

  const deleteBlock = (blockId: string) => {
    try {
      if (!blockId) {
        console.error('Invalid blockId for deleteBlock:', blockId)
        return
      }
      
      const newBlocks = blocks.filter(block => block.id !== blockId)
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        position: index
      }))
      setBlocks(updatedBlocks)
      if (selectedBlock === blockId) {
        setSelectedBlock(null)
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      // Don't throw - prevent client-side crashes
    }
  }

  const updateBlockContent = (blockId: string, newContent: any) => {
    try {
      if (!blockId || !newContent) {
        console.error('Invalid parameters for updateBlockContent:', { blockId, newContent })
        return
      }
      
      const updatedBlocks = blocks.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
      setBlocks(updatedBlocks)
    } catch (error) {
      console.error('Error updating block content:', error)
      // Don't throw - prevent client-side crashes
    }
  }

  return (
    <div className="flex-1 bg-muted/20">
      <div 
        ref={setNodeRef}
        className={`min-h-full p-8 ${isOver ? 'bg-muted/40' : ''}`}
      >
        <div className="max-w-4xl mx-auto min-h-full">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comienza a construir tu landing page</h3>
              <p className="text-muted-foreground mb-4">
                Arrastra bloques desde el panel izquierdo para empezar
              </p>
              <Button variant="outline">
                Cargar plantilla de demo
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pb-20">
              {/* Indicador de edición */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-blue-800">Modo de edición activo</p>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Haz clic en cualquier bloque para editarlo en el panel de la derecha
                </p>
              </div>
              
              {blocks
                .sort((a, b) => a.position - b.position)
                .map((block, index) => {
                  console.log(`Rendering block ${index}:`, block.type, block.id)
                  return (
                    <div
                      key={block.id}
                      id={`block-${block.id}`}
                      className={`relative group ${selectedBlock === block.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <BlockRenderer block={block} onContentChange={updateBlockContent} blocks={blocks} />
                        </CardContent>
                      </Card>
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveBlock(index, Math.max(0, index - 1))
                            }}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveBlock(index, Math.min(blocks.length - 1, index + 1))
                            }}
                            disabled={index === blocks.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteBlock(block.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
          
          <DropZone />
        </div>
      </div>
    </div>
  )
}