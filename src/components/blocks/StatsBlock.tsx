'use client'

import { StatsBlockContent } from '@/types'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface StatsBlockProps {
  content: StatsBlockContent
  onContentChange?: (newContent: StatsBlockContent) => void
}

export function StatsBlock({ content, onContentChange }: StatsBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }
  
  const styles = content.styles || {}
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'group',
    styles.backgroundColor || 'transparent',
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
    'max-w-6xl',
    'mx-auto',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')
  
  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {(content.stats || []).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <p className="text-lg text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="stats"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}