'use client'

import { HeroSlideContent } from '@/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useCallback } from 'react'

interface HeroSlideBlockProps {
  content: HeroSlideContent
  onContentChange?: (newContent: HeroSlideContent) => void
}

export function HeroSlideBlock({ content, onContentChange }: HeroSlideBlockProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Safety check for slides
  const slides = content.slides || []
  const slide = slides[currentSlide] || slides[0] || {
    id: '1',
    backgroundImage: '',
    title: 'Slide Title',
    subtitle: 'Slide Subtitle',
    buttonText: 'Button',
    buttonType: 'external' as const,
    buttonTarget: '#',
    textColor: 'light' as const,
    imageFilter: 'none' as const
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const handleButtonClick = (buttonType: string, target: string) => {
    switch (buttonType) {
      case 'external':
        window.open(target, '_blank')
        break
      case 'internal':
        window.location.href = target
        break
      case 'block':
        const blockElement = document.querySelector(`[data-block-type="${target}"]`)
        if (blockElement) {
          blockElement.scrollIntoView({ behavior: 'smooth' })
        }
        break
    }
  }

  const getTextColorClass = (textColor: string, customColor?: string) => {
    switch (textColor) {
      case 'light':
        return 'text-white'
      case 'dark':
        return 'text-gray-900'
      case 'custom':
        return customColor || 'text-white'
      default:
        return 'text-white'
    }
  }

  const heightClass = content.height === 'fixed' ? `${content.fixedHeight || 600}px` : '100vh'

  return (
    <section 
      className="relative overflow-hidden group" 
      data-block-type="hero-slide"
      style={{ 
        height: heightClass,
        marginTop: content.marginTop || 0,
        marginBottom: content.marginBottom || 0
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {slide.backgroundImage ? (
          <img
            src={slide.backgroundImage}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.parentElement
              if (fallback) {
                fallback.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700"></div>'
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700"></div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${getTextColorClass(slide.textColor, slide.customTextColor)}`}>
            {slide.title}
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 ${getTextColorClass(slide.textColor, slide.customTextColor)} opacity-90`}>
            {slide.subtitle}
          </p>
          
          <Button
            size="lg"
            onClick={() => handleButtonClick(slide.buttonType, slide.buttonTarget)}
            className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {slide.buttonText}
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}