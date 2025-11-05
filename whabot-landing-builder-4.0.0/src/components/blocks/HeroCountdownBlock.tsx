'use client'

import { CountdownBlockContent } from '@/types'
import { Button } from '@/components/ui/button'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { useState, useEffect, useCallback } from 'react'

interface HeroCountdownBlockProps {
  content: CountdownBlockContent
  onContentChange?: (newContent: CountdownBlockContent) => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function HeroCountdownBlock({ content, onContentChange }: HeroCountdownBlockProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })
  const [isVisible, setIsVisible] = useState(true)

  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }

  // Calculate time remaining
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const endDate = new Date(content.endDate)
    const now = new Date()
    const difference = endDate.getTime() - now.getTime()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    }
  }, [content.endDate])

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      // Handle expired action
      if (newTimeLeft.isExpired && !timeLeft.isExpired) {
        // Emit promo expired event
        const expiredEvent = new CustomEvent('promo_expired', {
          detail: {
            blockId: content.title,
            timestamp: new Date().toISOString()
          }
        })
        window.dispatchEvent(expiredEvent)

        // Handle expired action
        switch (content.expiredAction) {
          case 'hide':
            setIsVisible(false)
            break
          case 'change-color':
            // Color change is handled in the render
            break
          case 'show-message':
          default:
            // Show message is handled in the render
            break
        }
      }
    }, 1000)

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [calculateTimeLeft, content.expiredAction, content.title, timeLeft.isExpired])

  // Format number with leading zeros
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0')
  }

  // Build dynamic className based on styles
  const sectionClasses = [
    'relative',
    'w-full',
    'overflow-hidden',
    'group',
    'transition-all duration-500',
    content.styles?.backgroundColor || 'bg-gradient-to-r from-red-500 to-pink-600',
    content.styles?.paddingY || 'py-16',
    content.styles?.paddingX || 'px-6',
    content.styles?.margin || 'mb-0',
    content.styles?.border || 'none',
    content.styles?.borderColor || 'border-border',
    content.styles?.shadow || 'shadow-lg',
    content.styles?.borderRadius || 'rounded-lg',
    content.styles?.opacity || 'opacity-100',
    content.styles?.hoverTransform || 'hover:scale-105'
  ].filter(Boolean).join(' ')

  const containerClasses = [
    'max-w-4xl',
    'mx-auto',
    'w-full',
    'relative',
    'z-10'
  ].filter(Boolean).join(' ')

  const contentClasses = [
    'text-center',
    content.alignment === 'left' ? 'text-left' : 
    content.alignment === 'right' ? 'text-right' : 'text-center'
  ].filter(Boolean).join(' ')

  const timerClasses = [
    'grid',
    'grid-cols-2',
    'md:grid-cols-4',
    'gap-4',
    'mt-8',
    'mb-8'
  ].filter(Boolean).join(' ')

  const timerItemClasses = [
    'rounded-lg',
    'p-4',
    'text-center',
    'transition-all duration-300',
    'hover:scale-105',
    timeLeft.isExpired && content.expiredAction === 'change-color' 
      ? 'bg-gray-500' 
      : content.timerColors?.background || 'bg-black/20'
  ].filter(Boolean).join(' ')

  const numberClasses = [
    'text-3xl',
    'md:text-4xl',
    'font-bold',
    'block',
    'mb-1',
    'transition-all duration-300',
    timeLeft.isExpired && content.expiredAction === 'change-color'
      ? 'text-gray-300'
      : content.timerColors?.numbers || 'text-white'
  ].filter(Boolean).join(' ')

  const labelClasses = [
    'text-sm',
    'uppercase',
    'tracking-wide',
    'transition-all duration-300',
    timeLeft.isExpired && content.expiredAction === 'change-color'
      ? 'text-gray-400'
      : content.timerColors?.labels || 'text-white/80'
  ].filter(Boolean).join(' ')

  const buttonClasses = [
    'inline-flex',
    'items-center',
    'px-8',
    'py-3',
    'rounded-lg',
    'font-semibold',
    'text-lg',
    'transition-all duration-300',
    'transform hover:scale-105',
    'hover:shadow-lg',
    'animate-bounce',
    content.button?.color || 'bg-white text-red-600 hover:bg-gray-100'
  ].filter(Boolean).join(' ')

  // Handle button click
  const handleButtonClick = () => {
    if (!content.button) return
    
    switch (content.button.linkType) {
      case 'external':
        window.open(content.button.link, '_blank')
        break
      case 'internal':
        window.location.href = content.button.link
        break
      case 'block':
        // Scroll to block
        const element = document.getElementById(content.button.link)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
        break
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <section className={sectionClasses}>
      {/* Background Image */}
      {content.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${content.backgroundImage})`,
            zIndex: 1
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className={containerClasses}>
        <div className={contentClasses}>
          {/* Title */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg animate-fade-in`}>
            {content.title}
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md animate-fade-in-delayed`}>
            {content.subtitle}
          </p>

          {/* Timer */}
          {!timeLeft.isExpired ? (
            <div className={`animate-fade-in-delayed-2 ${timerClasses}`}>
              {/* Days */}
              <div className={timerItemClasses}>
                <span className={numberClasses}>{formatNumber(timeLeft.days)}</span>
                <span className={labelClasses}>DÍAS</span>
              </div>

              {/* Hours */}
              <div className={timerItemClasses}>
                <span className={numberClasses}>{formatNumber(timeLeft.hours)}</span>
                <span className={labelClasses}>HORAS</span>
              </div>

              {/* Minutes */}
              <div className={timerItemClasses}>
                <span className={numberClasses}>{formatNumber(timeLeft.minutes)}</span>
                <span className={labelClasses}>MIN</span>
              </div>

              {/* Seconds */}
              <div className={timerItemClasses}>
                <span className={numberClasses}>{formatNumber(timeLeft.seconds)}</span>
                <span className={labelClasses}>SEG</span>
              </div>
            </div>
          ) : (
            content.expiredAction === 'show-message' && (
              <div className="bg-black/30 rounded-lg p-6 mb-8 animate-fade-in">
                <p className="text-2xl font-bold text-white">
                  {content.expiredMessage || 'La promoción ha finalizado'}
                </p>
              </div>
            )
          )}

          {/* Button */}
          {!timeLeft.isExpired && content.button && (
            <button 
              onClick={handleButtonClick}
              className={buttonClasses}
              style={{
                backgroundColor: content.button.color,
                color: content.button.hoverColor || 'inherit'
              }}
              onMouseEnter={(e) => {
                if (content.button.hoverColor) {
                  e.currentTarget.style.backgroundColor = content.button.hoverColor
                  e.currentTarget.style.color = content.button.color
                }
              }}
              onMouseLeave={(e) => {
                if (content.button) {
                  e.currentTarget.style.backgroundColor = content.button.color
                  e.currentTarget.style.color = content.button.hoverColor || 'inherit'
                }
              }}
            >
              {content.button.text}
            </button>
          )}
        </div>
      </div>

      {/* AI Improvement Button */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <AIImprovementButton
            blockType="countdown"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delayed-2 {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
          40%, 43% { transform: translate3d(0, -15px, 0); }
          70% { transform: translate3d(0, -7px, 0); }
          90% { transform: translate3d(0, -3px, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in-delayed-2 0.8s ease-out 0.4s both;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
          🕒 Countdown: {content.title} | 
          Ends: {new Date(content.endDate).toLocaleString()} | 
          Expired: {timeLeft.isExpired ? 'Yes' : 'No'}
        </div>
      )}
    </section>
  )
}