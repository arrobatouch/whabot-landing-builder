'use client'

import { YouTubeBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { useState, useEffect } from 'react'

interface HeroYouTubeBlockProps {
  content: YouTubeBlockContent
  onContentChange?: (newContent: YouTubeBlockContent) => void
}

export function HeroYouTubeBlock({ content, onContentChange }: HeroYouTubeBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState('')
  const styles = content.styles || {}
  
  // Update current video ID when content changes
  useEffect(() => {
    const videoId = content.videoId || extractVideoId(content.videoUrl)
    setCurrentVideoId(videoId)
    console.log('🔄 Updated current video ID:', videoId)
  }, [content.videoUrl, content.videoId])
  
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    if (!url) return ''
    
    console.log('🔍 Extracting video ID from URL:', url)
    
    // Handle multiple URL formats
    const regexes = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
      /(?:youtube\.com\/watch\?.*?v=)([^&\n?#]+)/
    ]
    
    for (const regex of regexes) {
      const match = url.match(regex)
      if (match && match[1]) {
        console.log('✅ Video ID extracted:', match[1])
        return match[1]
      }
    }
    
    console.log('❌ No video ID found in URL')
    return ''
  }

  // Test the specific URL provided by user
  const testUrl = 'https://www.youtube.com/watch?v=GPG4yyWbvMo'
  console.log('🧪 Testing user URL:', testUrl)
  console.log('🧪 Extracted ID from user URL:', extractVideoId(testUrl))

  // Get embed URL with parameters
  const getEmbedUrl = (): string => {
    console.log('🎬 Getting embed URL for video ID:', currentVideoId)
    
    if (!currentVideoId) {
      console.log('❌ No video ID available')
      return ''
    }
    
    // Try basic embed URL first without parameters
    const basicEmbedUrl = `https://www.youtube.com/embed/${currentVideoId}`
    console.log('🔗 Basic embed URL:', basicEmbedUrl)
    return basicEmbedUrl
  }

  // Handle video events
  const handleVideoEvent = (event: 'start' | 'pause' | 'end') => {
    // Emit events to the system for ORUS integration
    const customEvent = new CustomEvent(`video_${event}`, {
      detail: {
        videoId: content.videoId || extractVideoId(content.videoUrl),
        blockId: content.title,
        timestamp: new Date().toISOString()
      }
    })
    window.dispatchEvent(customEvent)
    
    // Update playing state
    if (event === 'start') setIsPlaying(true)
    else if (event === 'pause' || event === 'end') setIsPlaying(false)
  }

  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'w-full',
    'overflow-hidden',
    'group',
    styles.backgroundColor || content.visualMode === 'dark' ? 'bg-gray-900' : 'bg-transparent',
    styles.paddingY || 'py-12',
    styles.paddingX || 'px-6',
    styles.margin || 'mb-0',
    styles.border || 'none',
    styles.borderColor || 'border-border',
    styles.shadow || content.visualMode === 'dark' ? 'shadow-lg' : 'none',
    styles.borderRadius || 'rounded-none',
    styles.opacity || 'opacity-100',
    styles.hoverTransform || 'none'
  ].filter(Boolean).join(' ')

  const containerClasses = [
    'max-w-6xl',
    'mx-auto',
    'w-full',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')

  const videoWrapperClasses = [
    'relative',
    'w-full',
    'overflow-hidden',
    'rounded-lg',
    content.alignment === 'left' ? 'mr-auto' : 
    content.alignment === 'right' ? 'ml-auto' : 'mx-auto'
  ].filter(Boolean).join(' ')

  // Calculate video height based on preset or custom
  const getVideoHeight = (): string => {
    const size = content.size || {}
    const preset = size.preset || 'medium'
    const customHeight = size.height || '400'
    const unit = size.heightUnit || 'px'
    
    switch (preset) {
      case 'small':
        return '240px'
      case 'medium':
        return '400px'
      case 'large':
        return '600px'
      case 'custom':
        return `${customHeight}${unit}`
      default:
        return '400px'
    }
  }

  return (
    <section 
      className={sectionClasses}
      style={{
        marginTop: (content.size && content.size.marginTop) ? `${content.size.marginTop}px` : '0px',
        marginBottom: (content.size && content.size.marginBottom) ? `${content.size.marginBottom}px` : '0px'
      }}
    >
      <div className={containerClasses}>
        {/* Title and Description */}
        {content.title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {content.title}
          </h2>
        )}
        
        {content.description && (
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {content.description}
          </p>
        )}

        {/* Video Container */}
        <div className={videoWrapperClasses} style={{ height: getVideoHeight() }}>
          {getEmbedUrl() ? (
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={content.title || "YouTube video player"}
              onLoad={() => {
                console.log('✅ YouTube iframe loaded successfully')
              }}
              onError={(e) => {
                console.error('❌ YouTube iframe error:', e)
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Por favor, ingresa una URL de YouTube válida
                </p>
                <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <div>URL: {content.videoUrl || 'No URL'}</div>
                  <div>Video ID: {content.videoId || 'No ID'}</div>
                  <div>Current Video ID: {currentVideoId || 'No current ID'}</div>
                  <div>Extracted ID: {extractVideoId(content.videoUrl) || 'No ID extracted'}</div>
                  <div>Embed URL: {getEmbedUrl() || 'No URL generated'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Status Indicator */}
        {isPlaying && (
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Reproduciendo
          </div>
        )}
      </div>

      {/* AI Improvement Button */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="youtube"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          🎥 Video: {content.videoUrl ? content.videoUrl.substring(0, 50) + '...' : 'No URL'} | 
          Modo: {content.visualMode} | 
          ID: {content.videoId || extractVideoId(content.videoUrl) || 'No ID'}
        </div>
      )}
    </section>
  )
}