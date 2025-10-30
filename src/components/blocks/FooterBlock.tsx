'use client'

import { FooterBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'

interface FooterBlockProps {
  content: FooterBlockContent
  onContentChange?: (newContent: FooterBlockContent) => void
}

export function FooterBlock({ content, onContentChange }: FooterBlockProps) {
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
  const footerClasses = [
    'bg-background',
    'border-t',
    'border-border',
    'relative',
    'group',
    styles.backgroundColor || 'bg-background',
    styles.paddingY || 'py-12',
    styles.paddingX || 'px-6',
    styles.margin || 'mb-0',
    styles.border || 'border-t border-border',
    styles.borderColor || 'border-border',
    styles.shadow || 'none',
    styles.borderRadius || 'rounded-none',
    styles.opacity || 'opacity-100',
    styles.hoverTransform || 'none'
  ].filter(Boolean).join(' ')
  
  const containerClasses = [
    'max-w-6xl',
    'mx-auto',
    styles.paddingX || 'px-6',
    styles.paddingY || 'py-12'
  ].filter(Boolean).join(' ')
  
  return (
    <footer className={footerClasses}>
      <div className={containerClasses}>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={content.logo} alt={content.company} className="h-8 w-8" />
              <h3 className="text-lg font-semibold">{content.company}</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {content.description}
            </p>
            <div className="flex space-x-4">
              {(content.socialLinks || []).map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <span className="text-lg">{social.icon}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          {(content.links || []).map((linkGroup, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{linkGroup.title}</h4>
              <ul className="space-y-2">
                {(linkGroup.items || []).map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.url}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 {content.company}. Todos los derechos reservados.</p>
        </div>
      </div>
      
      {/* Botón de IA */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="footer"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </footer>
  )
}