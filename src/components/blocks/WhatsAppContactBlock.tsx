'use client'

import { WhatsAppContactBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { MessageCircle, Phone, Settings, Plus } from 'lucide-react'
import { useState } from 'react'

interface WhatsAppContactBlockProps {
  content: WhatsAppContactBlockContent
  onContentChange?: (newContent: WhatsAppContactBlockContent) => void
}

export function WhatsAppContactBlock({ content, onContentChange }: WhatsAppContactBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }

  const openWhatsApp = () => {
    if (!content.whatsappNumber) {
      console.warn('WhatsApp number is not available')
      return
    }
    const whatsappNumber = content.whatsappNumber.replace(/\D/g, '') // Remove non-digits
    const message = encodeURIComponent(content.defaultMessage || '')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const styles = content.styles || {}
  
  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'group',
    styles.backgroundColor || 'bg-background',
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
    'mx-auto'
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses} data-block-type="whatsapp-contact">
      <div className={containerClasses}>
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[400px]">
          {/* Left Column - Image */}
          <div className="relative overflow-hidden rounded-l-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-gray-100"></div>
            {content.leftImage ? (
              <img
                src={content.leftImage}
                alt={content.leftImageAlt}
                className="relative w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.parentElement
                  if (fallback) {
                    fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-green-100 via-green-50 to-gray-100"><div class="text-center"><div class="text-6xl mb-4">💬</div><p>Imagen no disponible</p></div></div>'
                  }
                }}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center text-green-600 bg-gradient-to-br from-green-100 via-green-50 to-gray-100">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-green-700 font-medium">Imagen de contacto</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="bg-background text-foreground p-8 md:p-12 flex flex-col justify-center dark:bg-gray-900 dark:text-gray-100">
            <div className="max-w-md mx-auto text-center lg:text-left">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {content.title}
              </h2>

              {/* Description */}
              <p className="text-lg mb-8 leading-relaxed text-muted-foreground">
                {content.description}
              </p>

              {/* WhatsApp Action Block */}
              <Card className="bg-green-50 border-green-200 mb-8 dark:bg-green-950 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* WhatsApp Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="text-center lg:text-left">
                      <div className="text-sm text-green-600 font-medium mb-1 dark:text-green-400">
                        WhatsApp
                      </div>
                      <div className="text-xl font-bold">
                        {formatPhoneNumber(content.whatsappNumber)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button 
                size="lg" 
                onClick={openWhatsApp}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                {content.buttonText}
              </Button>

              {/* Additional Info */}
              <div className="mt-6 text-sm text-muted-foreground">
                <p>🟢 Online de lunes a viernes de 9 a 18 hs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Improvement Button */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="whatsapp-contact"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}

// Helper function to format phone number
function formatPhoneNumber(phoneNumber?: string): string {
  if (!phoneNumber) {
    return 'No disponible'
  }
  
  // Remove all non-digits first
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Format based on length
  if (cleaned.length === 13) {
    // International format: +54 9 11 1234-5678
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)}-${cleaned.slice(9, 13)}`
  } else if (cleaned.length === 12) {
    // Alternative format: +54 11 1234-5678
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`
  } else if (cleaned.length === 10) {
    // Local format: 11 1234-5678
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`
  }
  
  // Return original if can't format
  return phoneNumber
}