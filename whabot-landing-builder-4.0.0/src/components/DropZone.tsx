'use client'

import { useDroppable } from '@dnd-kit/core'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export function DropZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'dropzone',
  })

  return (
    <div ref={setNodeRef} className="my-4">
      <Card className={`border-2 border-dashed transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-muted-foreground/50'
      }`}>
        <CardContent className="p-8 text-center">
          <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isOver ? 'Suelta para agregar bloque' : 'Arrastra un bloque aquí'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}