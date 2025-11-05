'use client'

import { ProcessBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { Plus } from 'lucide-react'

interface ProcessBlockProps {
  content: ProcessBlockContent
  onContentChange?: (newContent: ProcessBlockContent) => void
}

export function ProcessBlock({ content, onContentChange }: ProcessBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const handleAddStep = () => {
    if (onContentChange) {
      const newStep = {
        icon: '⭐',
        title: 'Nuevo Paso',
        description: 'Descripción del nuevo paso'
      }
      onContentChange({
        ...content,
        steps: [...content.steps, newStep]
      })
    }
  }
  
  const handleStepChange = (index: number, field: string, value: string) => {
    if (onContentChange) {
      const newSteps = [...content.steps]
      newSteps[index] = {
        ...newSteps[index],
        [field]: value
      }
      onContentChange({
        ...content,
        steps: newSteps
      })
    }
  }
  
  const handleRemoveStep = (index: number) => {
    if (onContentChange && (content.steps || []).length > 1) {
      const newSteps = (content.steps || []).filter((_, i) => i !== index)
      onContentChange({
        ...content,
        steps: newSteps
      })
    }
  }
  
  const styles = content.styles || {}
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'group',
    styles.backgroundColor || 'bg-slate-950',
    styles.paddingY || 'py-20',
    styles.paddingX || 'px-6',
    styles.margin || 'mb-0',
    styles.border || 'none',
    styles.borderColor || 'border-border',
    styles.shadow || 'none',
    styles.borderRadius || 'rounded-none',
    styles.opacity || 'opacity-100',
    styles.hoverTransform || 'none'
  ].filter(Boolean).join(' ')
  
  const containerClasses = [
    'max-w-4xl',
    'mx-auto',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>
        
        <div className="space-y-8">
          {(content.steps || []).map((step, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  {String(index + 1).padStart(2, '0')}
                </div>
                {step.icon && (
                  <div className="text-2xl mb-2">
                    {step.icon}
                  </div>
                )}
                {index < (content.steps || []).length - 1 && (
                  <div className="w-0.5 h-20 bg-violet-400/30 mt-2"></div>
                )}
              </div>
              
              <Card className="flex-1 bg-slate-900/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    {onContentChange && content.steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStep(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {onContentChange && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleAddStep}
              variant="outline"
              className="border-violet-500 text-violet-400 hover:bg-violet-500 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        )}
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="process"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}