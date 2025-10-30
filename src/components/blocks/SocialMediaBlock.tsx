'use client'

import { SocialMediaBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { Share2, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SocialMediaBlockProps {
  content: SocialMediaBlockContent
  onContentChange?: (newContent: SocialMediaBlockContent) => void
}

export function SocialMediaBlock({ content, onContentChange }: SocialMediaBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }

  const openSocialLink = (url: string) => {
    window.open(url, '_blank')
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Sort social networks by order
  const sortedNetworks = [...(content.socialLinks || [])].sort((a, b) => a.order - b.order)

  // Position styles
  const positionClasses = content.buttonPosition === 'right' 
    ? 'right-0' 
    : 'left-0'

  const containerClasses = [
    'fixed',
    'bottom-0',
    positionClasses,
    'z-50',
    'p-4'
  ].join(' ')

  const buttonStyle = {
    marginBottom: `${content.buttonMargin}px`,
    backgroundColor: content.buttonColor || '#3b82f6'
  }

  return (
    <div className={containerClasses} data-block-type="social-media">
      {/* Social Media Buttons Container */}
      <div className="relative">
        {/* Expanded Social Networks */}
        <AnimatePresence>
          {isExpanded && (
            <div className={`absolute ${content.buttonPosition === 'right' ? 'right-0' : 'left-0'} bottom-full mb-2 space-y-2`}>
              {sortedNetworks.map((network, index) => (
                <motion.div
                  key={network.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openSocialLink(network.url)}
                    className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {network.icon.startsWith('http') ? (
                      <img src={network.icon} alt={network.name} className="w-4 h-4" />
                    ) : (
                      <span className="text-lg">{network.icon}</span>
                    )}
                    <span className="text-sm font-medium">{network.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={toggleExpand}
            className="w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center justify-center"
            style={buttonStyle}
          >
            {isExpanded ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Share2 className="h-6 w-6 text-white" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* AI Improvement Button */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="social-media"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </div>
  )
}