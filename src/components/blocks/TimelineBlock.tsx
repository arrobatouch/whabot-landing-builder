'use client'

import { TimelineBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface TimelineBlockProps {
  content: TimelineBlockContent
  onContentChange?: (newContent: TimelineBlockContent) => void
}

export function TimelineBlock({ content, onContentChange }: TimelineBlockProps) {
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
    styles.backgroundColor || 'bg-muted/20',
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
        </div>
        
        <div className="space-y-8">
          {(content.events || []).map((event, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                {index < (content.events || []).length - 1 && (
                  <div className="w-0.5 h-16 bg-blue-200 mt-4"></div>
                )}
              </div>
              
              <Card className="flex-1">
                <CardContent className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {event.date}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="timeline"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}