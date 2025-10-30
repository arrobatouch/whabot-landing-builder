'use client'

import { useState, useEffect } from 'react'
import { BlockType } from '@/types'

export interface SavedDesign {
  id: string
  name: string
  blocks: BlockType[]
  createdAt: string
  updatedAt: string
  thumbnail?: string
  preview?: {
    title: string
    description: string
  }
}

const STORAGE_KEY = 'landing-page-designs'

export function useDesignHistory() {
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar diseños desde localStorage
  useEffect(() => {
    const savedDesigns = localStorage.getItem(STORAGE_KEY)
    if (savedDesigns) {
      try {
        const parsed = JSON.parse(savedDesigns)
        setDesigns(parsed)
      } catch (error) {
        console.error('Error loading designs:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // Guardar diseños en localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    }
  }, [designs, isLoading])

  // Guardar un nuevo diseño
  const saveDesign = (blocks: BlockType[], name?: string) => {
    const heroBlock = blocks.find(block => block.type === 'hero')
    const preview = heroBlock ? {
      title: heroBlock.content.title || 'Sin título',
      description: heroBlock.content.description || 'Sin descripción'
    } : {
      title: 'Sin título',
      description: 'Sin descripción'
    }

    const newDesign: SavedDesign = {
      id: `design-${Date.now()}`,
      name: name || `Diseño ${designs.length + 1}`,
      blocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preview
    }

    setDesigns(prev => [newDesign, ...prev])
    return newDesign.id
  }

  // Actualizar un diseño existente
  const updateDesign = (id: string, blocks: BlockType[], name?: string) => {
    setDesigns(prev => prev.map(design => {
      if (design.id === id) {
        const heroBlock = blocks.find(block => block.type === 'hero')
        const preview = heroBlock ? {
          title: heroBlock.content.title || 'Sin título',
          description: heroBlock.content.description || 'Sin descripción'
        } : design.preview

        return {
          ...design,
          name: name || design.name,
          blocks,
          updatedAt: new Date().toISOString(),
          preview
        }
      }
      return design
    }))
  }

  // Cargar un diseño
  const loadDesign = (id: string) => {
    const design = designs.find(d => d.id === id)
    return design ? design.blocks : null
  }

  // Eliminar un diseño
  const deleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(design => design.id !== id))
  }

  // Duplicar un diseño
  const duplicateDesign = (id: string) => {
    const design = designs.find(d => d.id === id)
    if (design) {
      const newDesign: SavedDesign = {
        ...design,
        id: `design-${Date.now()}`,
        name: `${design.name} (copia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDesigns(prev => [newDesign, ...prev])
      return newDesign.id
    }
    return null
  }

  return {
    designs,
    isLoading,
    saveDesign,
    updateDesign,
    loadDesign,
    deleteDesign,
    duplicateDesign
  }
}