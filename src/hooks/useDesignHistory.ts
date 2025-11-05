import { useState, useCallback } from 'react'

export interface Design {
  id: string
  name: string
  blocks: any[]
  createdAt: Date
  updatedAt: Date
}

export function useDesignHistory() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null)

  const saveDesign = useCallback((name: string, blocks: any[]) => {
    const newDesign: Design = {
      id: Date.now().toString(),
      name,
      blocks,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setDesigns(prev => [...prev, newDesign])
    setCurrentDesign(newDesign)
    
    return newDesign
  }, [])

  const loadDesign = useCallback((designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      setCurrentDesign(design)
      return design
    }
    return null
  }, [designs])

  const deleteDesign = useCallback((designId: string) => {
    setDesigns(prev => prev.filter(d => d.id !== designId))
    if (currentDesign?.id === designId) {
      setCurrentDesign(null)
    }
  }, [currentDesign])

  const updateDesign = useCallback((designId: string, updates: Partial<Design>) => {
    setDesigns(prev => prev.map(d => 
      d.id === designId 
        ? { ...d, ...updates, updatedAt: new Date() }
        : d
    ))
    
    if (currentDesign?.id === designId) {
      setCurrentDesign(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null)
    }
  }, [currentDesign])

  return {
    designs,
    currentDesign,
    saveDesign,
    loadDesign,
    deleteDesign,
    updateDesign
  }
}