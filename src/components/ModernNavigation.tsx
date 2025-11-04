'use client'

import { useState } from 'react'
import { Menu, X, ChevronDown, ExternalLink, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { BlockType } from '@/types'

interface ModernNavigationProps {
  blocks: BlockType[]
  onAddCustomButton?: () => void
  customButtons?: Array<{ id: string; label: string; url: string }>
  logoPosition?: 'left' | 'center' | 'right'
  menuPosition?: 'left' | 'right'
  companyName?: string
  logoUrl?: string
  logoUpload?: File | null
  backgroundColor?: string
  textColor?: string
  sticky?: boolean
  shadow?: boolean
}

interface NavigationItem {
  id: string
  title: string
  type: string
  anchor?: string
}

export function ModernNavigation({ 
  blocks, 
  onAddCustomButton, 
  customButtons = [], 
  logoPosition = 'center',
  menuPosition = 'left',
  companyName = 'Mi Empresa',
  logoUrl = '',
  logoUpload = null,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  sticky = false,
  shadow = true
}: ModernNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Extraer títulos de los bloques para el menú de navegación
  const navigationItems: NavigationItem[] = blocks.map((block, index) => {
    let title = 'Bloque sin título'
    
    // Extraer título según el tipo de bloque
    switch (block.type) {
      case 'hero':
      case 'hero-slide':
      case 'hero-split':
      case 'hero-banner':
      case 'hero-countdown':
      case 'hero-youtube':
        title = block.content?.title || 'Hero'
        break
      case 'features':
      case 'product-features':
        title = block.content?.title || 'Características'
        break
      case 'testimonials':
        title = block.content?.title || 'Testimonios'
        break
      case 'pricing':
        title = block.content?.title || 'Precios'
        break
      case 'faq':
        title = block.content?.title || 'Preguntas Frecuentes'
        break
      case 'cta':
        title = block.content?.title || 'Llamada a la Acción'
        break
      case 'reinforcement':
        title = block.content?.title || 'Refuerzo'
        break
      case 'stats':
        title = block.content?.title || 'Estadísticas'
        break
      case 'timeline':
        title = block.content?.title || 'Línea de Tiempo'
        break
      case 'process':
        title = block.content?.title || 'Proceso'
        break
      case 'social-media':
        title = block.content?.title || 'Redes Sociales'
        break
      case 'whatsapp-contact':
        title = block.content?.title || 'Contacto WhatsApp'
        break
      case 'footer':
        title = 'Pie de Página'
        break
      case 'image':
        title = block.content?.title || 'Imagen'
        break
      case 'product-cart':
        title = block.content?.title || 'Carrito de Productos'
        break
      default:
        title = `Bloque ${index + 1}`
    }
    
    return {
      id: block.id,
      title,
      type: block.type,
      anchor: `block-${block.id}`
    }
  })

  const scrollToBlock = (blockId: string) => {
    const element = document.getElementById(blockId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  // Función para renderizar el layout según las posiciones configuradas
  const renderLayout = () => {
    // Determinar la fuente del logo
    const logoSrc = logoUpload ? URL.createObjectURL(logoUpload) : logoUrl || 'https://b3226891.smushcdn.com/3226891/wp-content/uploads/2023/10/aquitulogo-27.png?lossy=2&strip=1&webp=1'
    
    const logoElement = (
      <div className="flex-shrink-0">
        <img 
          className="h-8 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[200px]"
          src={logoSrc}
          alt={companyName}
        />
      </div>
    )

    const menuElement = (
      <div className="flex-shrink-0">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={menuPosition} className="w-[280px] sm:w-[320px] md:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navegación</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-6">
              {/* Sección de bloques */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Secciones de la página
                </h3>
                <nav className="space-y-1 max-h-64 overflow-y-auto">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToBlock(item.anchor || item.id)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{item.title}</span>
                      <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Separador */}
              <div className="border-t border-border" />

              {/* Botones personalizados */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Enlaces personalizados
                  </h3>
                  {onAddCustomButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onAddCustomButton}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <nav className="space-y-1 max-h-48 overflow-y-auto">
                  {customButtons.map((button) => (
                    <a
                      key={button.id}
                      href={button.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <span className="truncate">{button.label}</span>
                      <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
                    </a>
                  ))}
                  {customButtons.length === 0 && (
                    <p className="text-xs text-muted-foreground px-3 py-2">
                      No hay enlaces personalizados
                    </p>
                  )}
                </nav>
              </div>

              {/* Separador */}
              <div className="border-t border-border" />

              {/* Sección de landings activas */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Otras Landings
                </h3>
                <nav className="space-y-1">
                  <a
                    href="#"
                    className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span>Landing Principal</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span>Landing de Productos</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span>Landing de Servicios</span>
                  </a>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )

    // Determinar el layout basado en las posiciones
    const leftContent = menuPosition === 'left' ? menuElement : logoPosition === 'left' ? logoElement : null
    const centerContent = logoPosition === 'center' ? logoElement : null
    const rightContent = menuPosition === 'right' ? menuElement : logoPosition === 'right' ? logoElement : null

    return (
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Contenido izquierdo */}
        <div className="flex items-center">
          {leftContent}
        </div>

        {/* Contenido central */}
        {centerContent && (
          <div className="flex items-center justify-center">
            {centerContent}
          </div>
        )}

        {/* Contenido derecho */}
        <div className="flex items-center justify-end">
          {rightContent}
        </div>
      </div>
    )
  }

  return (
    <nav 
      className={`relative bg-background/80 backdrop-blur-md border-b border-border/50 ${
        sticky ? 'sticky top-0 z-50' : ''
      } ${shadow ? 'shadow-sm' : ''}`}
      style={{
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      <div className="max-w-7xl mx-auto">
        {renderLayout()}
      </div>
    </nav>
  )
}