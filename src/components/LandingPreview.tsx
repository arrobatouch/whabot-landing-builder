'use client'

import { X, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlockType } from '@/types'

interface LandingPreviewProps {
  blocks: BlockType[]
  isOpen: boolean
  onClose: () => void
}

export function LandingPreview({ blocks, isOpen, onClose }: LandingPreviewProps) {
  if (!isOpen) return null

  // Función para renderizar un bloque según su tipo
  const renderBlock = (block: BlockType) => {
    switch (block.type) {
      case 'navigation':
        return (
          <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {block.content?.companyName || 'Mi Landing'}
                  </h1>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {block.content?.customButtons?.map((btn: any, index: number) => (
                      <a key={index} href={btn.url} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        {btn.label}
                      </a>
                    )) || (
                      <>
                        <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inicio</a>
                        <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Servicios</a>
                        <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contacto</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )

      case 'hero':
        return (
          <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {block.content?.title || block.content?.slides?.[0]?.title || 'Transforma tu Experiencia'}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {block.content?.subtitle || block.content?.slides?.[0]?.description || 'Innovamos para ofrecerte soluciones que superan expectativas'}
                </p>
                {block.content?.description && (
                  <p className="text-lg mb-8 opacity-80 max-w-3xl mx-auto">
                    {block.content.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 text-lg">
                    {block.content?.primaryButtonText || block.content?.buttonText || 'Empezar Ahora'}
                  </Button>
                  {block.content?.secondaryButtonText && (
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 text-lg">
                      {block.content.secondaryButtonText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )

      case 'hero-slide':
        return (
          <section className="relative text-white overflow-hidden">
            {/* Background Image */}
            {block.content?.backgroundImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${block.content.backgroundImage})` 
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            )}
            
            {/* Fallback gradient background if no image */}
            {!block.content?.backgroundImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            )}
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {block.content?.title || block.content?.slides?.[0]?.title || 'Transforma tu Experiencia'}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {block.content?.subtitle || block.content?.slides?.[0]?.description || 'Innovamos para ofrecerte soluciones que superan expectativas'}
                </p>
                {block.content?.description && (
                  <p className="text-lg mb-8 opacity-80 max-w-3xl mx-auto">
                    {block.content.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 text-lg">
                    {block.content?.primaryButtonText || block.content?.buttonText || 'Empezar Ahora'}
                  </Button>
                  {block.content?.secondaryButtonText && (
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 text-lg">
                      {block.content.secondaryButtonText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )

      case 'hero-split':
        return (
          <section className="relative py-16 bg-white dark:bg-gray-900 overflow-hidden">
            {/* Background Image */}
            {block.content?.backgroundImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ 
                  backgroundImage: `url(${block.content.backgroundImage})` 
                }}
              ></div>
            )}
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  {block.content?.title || 'Experiencia Excepcional'}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {block.content?.subtitle || 'Soluciones innovadoras para tu negocio'}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {block.content?.leftContent?.title || 'Nuestra Misión'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {block.content?.leftContent?.description || 'Brindamos soluciones de excelencia que transforman tu experiencia.'}
                  </p>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    {block.content?.leftContent?.buttonText || 'Conocer Más'}
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {block.content?.rightContent?.title || 'Nuestra Visión'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {block.content?.rightContent?.description || 'Ser líderes en el sector con innovación constante.'}
                  </p>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    {block.content?.rightContent?.buttonText || 'Ver Proyectos'}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )

      case 'features':
        return (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {block.content?.title || 'Características Principales'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {block.content?.subtitle || 'Descubre todo lo que podemos ofrecer'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {block.content?.features?.map((feature: any, index: number) => (
                  <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{feature.icon || '⚡'}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title || `Característica ${index + 1}`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description || 'Descripción de la característica'}
                    </p>
                  </div>
                )) || (
                  // Características por defecto
                  <>
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Rápido y Eficiente</h3>
                      <p className="text-gray-600 dark:text-gray-300">Optimizado para el mejor rendimiento</p>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Diseño Moderno</h3>
                      <p className="text-gray-600 dark:text-gray-300">Interfaz intuitiva y atractiva</p>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Seguro y Confiable</h3>
                      <p className="text-gray-600 dark:text-gray-300">Protección de datos garantizada</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )

      case 'testimonials':
        return (
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {block.content?.title || 'Lo que dicen nuestros clientes'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {block.content?.testimonials?.map((testimonial: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name || 'Cliente'}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role || 'Cliente'}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      "{testimonial.content || 'Excelente servicio'}"
                    </p>
                  </div>
                )) || (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">María García</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Cliente</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">"Excelente servicio y atención"</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Juan Pérez</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Cliente</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">"Superó todas mis expectativas"</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )

      case 'cta':
        return (
          <section className="relative py-16 text-white overflow-hidden">
            {/* Background Image */}
            {block.content?.backgroundImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${block.content.backgroundImage})` 
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            )}
            
            {/* Fallback gradient background if no image */}
            {!block.content?.backgroundImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            )}
            
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.content?.title || '¿Listo para Empezar?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {block.content?.subtitle || 'Únete a miles de usuarios satisfechos'}
              </p>
              {block.content?.description && (
                <p className="text-lg mb-8 opacity-80">
                  {block.content.description}
                </p>
              )}
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 text-lg">
                {block.content?.buttonText || block.content?.primaryButtonText || 'Comenzar Ahora'}
              </Button>
            </div>
          </section>
        )

      case 'pricing':
        return (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {block.content?.title || 'Nuestros Planes'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {block.content?.subtitle || 'Elige el plan que mejor se adapte a tus necesidades'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {block.content?.plans?.map((plan: any, index: number) => (
                  <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg p-8 ${plan.featured ? 'ring-2 ring-blue-500' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{plan.name || 'Plan'}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price || '0'}</span>
                      <span className="text-gray-600 dark:text-gray-300">/{plan.period || 'mes'}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features?.map((feature: string, fIndex: number) => (
                        <li key={fIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.featured ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      {plan.buttonText || 'Elegir Plan'}
                    </Button>
                  </div>
                )) || (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Básico</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">$29</span>
                        <span className="text-gray-600 dark:text-gray-300">/mes</span>
                      </div>
                      <Button className="w-full bg-gray-200 text-gray-800">Elegir Plan</Button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 ring-2 ring-blue-500">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pro</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">$59</span>
                        <span className="text-gray-600 dark:text-gray-300">/mes</span>
                      </div>
                      <Button className="w-full bg-blue-600 text-white">Elegir Plan</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )

      case 'stats':
        return (
          <section className="py-16 bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {block.content?.title || 'Resultados que Hablan'}
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {block.content?.stats?.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value || '0'}</div>
                    <div className="text-blue-100">{stat.label || 'Estadística'}</div>
                  </div>
                )) || (
                  <>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-2">150+</div>
                      <div className="text-blue-100">Proyectos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
                      <div className="text-blue-100">Satisfacción</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-2">25</div>
                      <div className="text-blue-100">Premios</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-2">5+</div>
                      <div className="text-blue-100">Años</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )

      case 'footer':
        return (
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {block.content?.company || 'Mi Empresa'}
                  </h3>
                  <p className="text-gray-400">
                    {block.content?.description || 'Creamos soluciones innovadoras para tu negocio'}
                  </p>
                </div>
                {block.content?.links?.map((linkGroup: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-4">{linkGroup.title}</h3>
                    <ul className="space-y-2 text-gray-400">
                      {linkGroup.items?.map((item: any, itemIndex: number) => (
                        <li key={itemIndex}>
                          <a href={item.url || '#'} className="hover:text-white">
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
                  <div className="flex space-x-4">
                    {block.content?.socialLinks?.map((social: any, index: number) => (
                      <a key={index} href={social.url || '#'} className="text-gray-400 hover:text-white">
                        <span className="text-xl">{social.icon || '📱'}</span>
                      </a>
                    )) || (
                      <>
                        <a href="#" className="text-gray-400 hover:text-white">
                          <span className="text-xl">📱</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                          <span className="text-xl">📷</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                          <span className="text-xl">📘</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                <p>&copy; 2024 {block.content?.company || 'Mi Empresa'}. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        )

      default:
        return (
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {block.content?.title || 'Bloque Personalizado'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {block.content?.subtitle || 'Contenido del bloque'}
                </p>
                {block.content?.description && (
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    {block.content.description}
                  </p>
                )}
              </div>
            </div>
          </section>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Vista Previa de la Landing</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full">
            {blocks.length > 0 ? (
              blocks.map((block) => (
                <div key={block.id}>
                  {renderBlock(block)}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No hay contenido para previsualizar</p>
                  <p className="text-sm">Genera o añade bloques para ver la vista previa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}