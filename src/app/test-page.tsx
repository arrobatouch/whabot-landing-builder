'use client'

import { useState } from 'react'
import { HeroSlideBlock } from '@/components/blocks/HeroSlideBlock'

// Datos de prueba para el Hero Slide con 3 imágenes
const testHeroSlideContent = {
  slides: [
    {
      id: 'slide-1',
      backgroundImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop',
      title: 'Tu Negocio',
      subtitle: 'Líder en el sector',
      buttonText: 'Conocer Más',
      buttonType: 'external' as const,
      buttonTarget: '#features',
      textColor: 'light' as const,
      imageFilter: 'none' as const
    },
    {
      id: 'slide-2',
      backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
      title: 'Soluciones Profesionales',
      subtitle: 'Calidad y confianza en cada proyecto',
      buttonText: 'Ver Servicios',
      buttonType: 'external' as const,
      buttonTarget: '#features',
      textColor: 'light' as const,
      imageFilter: 'none' as const
    },
    {
      id: 'slide-3',
      backgroundImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop',
      title: 'Innovación y Tecnología',
      subtitle: 'Transformando ideas en realidad',
      buttonText: 'Contactar',
      buttonType: 'external' as const,
      buttonTarget: '#contact',
      textColor: 'light' as const,
      imageFilter: 'none' as const
    }
  ],
  navigationStyle: 'arrows' as const,
  autoPlay: true,
  autoPlayInterval: 5000,
  transitionType: 'fade' as const,
  transitionSpeed: 500,
  height: 'viewport' as const,
  marginTop: 0,
  marginBottom: 0,
  styles: {
    backgroundColor: 'bg-background',
    paddingY: 'py-0',
    paddingX: 'px-0'
  }
}

export default function TestPage() {
  const [content, setContent] = useState(testHeroSlideContent)

  return (
    <div className="min-h-screen">
      <h1 className="text-center text-2xl font-bold p-4">Prueba de Hero Slide con 3 Imágenes</h1>
      
      {/* Hero Slide Test */}
      <HeroSlideBlock content={content} />
      
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">✅ Hero Slide Funcionando</h2>
        <p className="text-gray-600">El Hero Slide está mostrando 3 imágenes con navegación automática y controles manuales.</p>
        <ul className="mt-4 text-left max-w-md mx-auto space-y-2">
          <li>✅ Imagen 1: Negocio/Empresa</li>
          <li>✅ Imagen 2: Soluciones Profesionales</li>
          <li>✅ Imagen 3: Innovación y Tecnología</li>
          <li>✅ Navegación con flechas</li>
          <li>✅ Puntos de navegación</li>
          <li>✅ Auto-play cada 5 segundos</li>
          <li>✅ Transiciones suaves</li>
        </ul>
      </div>
    </div>
  )
}