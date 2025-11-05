'use client'

import { FaqBlockContent } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface FaqBlockProps {
  content: FaqBlockContent
  onContentChange?: (newContent: FaqBlockContent) => void
}

export function FaqBlock({ content, onContentChange }: FaqBlockProps) {
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
        
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {(content.faqs || []).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question || 'Pregunta'}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer || 'Respuesta'}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="faq"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}