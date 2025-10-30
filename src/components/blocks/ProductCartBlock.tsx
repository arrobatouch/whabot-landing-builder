'use client'

import { ProductCartBlockContent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AIImprovementButton } from '@/components/AIImprovementButton'
import { ShoppingCart, Plus, Minus, Star, Check } from 'lucide-react'
import { useState } from 'react'

interface ProductCartBlockProps {
  content: ProductCartBlockContent
  onContentChange?: (newContent: ProductCartBlockContent) => void
}

export function ProductCartBlock({ content, onContentChange }: ProductCartBlockProps) {
  const handleAIImprovement = (newContent: any) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        ...newContent
      })
    }
  }

  const [cartItems, setCartItems] = useState<{[key: string]: number}>({})
  
  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev }
      if (newItems[productId] > 1) {
        newItems[productId] -= 1
      } else {
        delete newItems[productId]
      }
      return newItems
    })
  }

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0)
  }

  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
      const product = content.products.find(p => p.id === productId)
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const sendWhatsAppMessage = () => {
    const whatsappNumber = content.whatsappNumber || '+5491130190242'
    const cartItemsList = Object.entries(cartItems).map(([productId, quantity]) => {
      const product = content.products.find(p => p.id === productId)
      return product ? `${quantity}x ${product.name} - ${product.price.toFixed(2)} ${product.currency}` : ''
    }).filter(item => item).join('\n')
    
    const message = `¡Hola! Quiero comprar este producto:\n\n${cartItemsList}\n\nTotal: ${getCartTotal().toFixed(2)} ${content.products[0]?.currency || 'USD'}`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
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
    'mx-auto',
    styles.textAlign || 'text-center'
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Cart Summary */}
        {getCartCount() > 0 && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    {getCartCount()} {getCartCount() === 1 ? 'artículo' : 'artículos'} en el carrito
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {getCartTotal().toFixed(2)} {content.products[0]?.currency || 'USD'}
                  </div>
                  <Button size="sm" className="mt-1" onClick={sendWhatsAppMessage}>
                    Proceder al pago
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.products || []).map((product) => {
            const cartQuantity = cartItems[product.id] || 0
            
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group/product">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-48 bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.parentElement
                          if (fallback) {
                            fallback.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground">📦 Imagen no disponible</div>'
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        📦 Imagen no disponible
                      </div>
                    )}
                    
                    {/* Stock Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "En stock" : "Agotado"}
                      </Badge>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline">
                        {product.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.description}
                      </p>
                      
                      {/* Features */}
                      {product.features && product.features.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {(product.features || []).slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {(product.features || []).length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {product.price.toFixed(2)} {product.currency}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-muted-foreground">(4.5)</span>
                        </div>
                      </div>

                      {/* Cart Controls */}
                      <div className="flex items-center space-x-2">
                        {cartQuantity > 0 ? (
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(product.id)}
                              disabled={!product.inStock}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {cartQuantity}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product.id)}
                              disabled={!product.inStock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addToCart(product.id)}
                            disabled={!product.inStock}
                            className="flex items-center space-x-1"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            <span>Agregar</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {(content.products || []).length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">No hay productos disponibles</h3>
            <p className="text-muted-foreground">
              Agrega productos para comenzar a vender
            </p>
          </div>
        )}
      </div>

      {/* AI Improvement Button */}
      {onContentChange && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <AIImprovementButton
            blockType="product-cart"
            content={content}
            onImproved={handleAIImprovement}
            size="sm"
          />
        </div>
      )}
    </section>
  )
}