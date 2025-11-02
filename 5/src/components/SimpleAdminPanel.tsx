'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Settings, BarChart3, DollarSign, Key, Save, Eye, EyeOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'

export function SimpleAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [config, setConfig] = useState({
    deepseek_percentage: 80,
    openai_percentage: 20,
    openai_api_key: '',
    deepseek_api_key: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchConfig()
    } else {
      setMessage({ type: 'error', text: 'Contraseña incorrecta' })
    }
  }

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Error fetching config:', error)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' })
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la configuración' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Acceso de Super Administrador</CardTitle>
            <CardDescription>
              Ingresa tu contraseña para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Ingresa tu contraseña"
              />
            </div>
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleLogin} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Acceder
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span>Panel de Super Administrador</span>
            </h1>
            <p className="text-muted-foreground">
              Gestiona la configuración del sistema híbrido de IA y monitorea el consumo
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Configuration Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuración de IA Híbrida</span>
              </CardTitle>
              <CardDescription>
                Ajusta la distribución de carga entre los proveedores de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deepseek-percentage">DeepSeek (%)</Label>
                  <Input
                    id="deepseek-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={config.deepseek_percentage}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      deepseek_percentage: parseInt(e.target.value) || 0,
                      openai_percentage: 100 - (parseInt(e.target.value) || 0)
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Porcentaje de solicitudes dirigidas a DeepSeek
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openai-percentage">OpenAI (%)</Label>
                  <Input
                    id="openai-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={config.openai_percentage}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      openai_percentage: parseInt(e.target.value) || 0,
                      deepseek_percentage: 100 - (parseInt(e.target.value) || 0)
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Porcentaje de solicitudes dirigidas a OpenAI
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-medium">Distribución Actual</p>
                  <p className="text-sm text-muted-foreground">
                    DeepSeek: {config.deepseek_percentage}% • OpenAI: {config.openai_percentage}%
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="default">{config.deepseek_percentage}% DeepSeek</Badge>
                  <Badge variant="secondary">{config.openai_percentage}% OpenAI</Badge>
                </div>
              </div>

              <Button onClick={saveConfig} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Claves de API</span>
              </CardTitle>
              <CardDescription>
                Gestiona las claves de API para los servicios de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="openai-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={config.openai_api_key}
                      onChange={(e) => setConfig(prev => ({ ...prev, openai_api_key: e.target.value }))}
                      placeholder="sk-..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Necesaria para el servicio GPT-4o mini
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="deepseek-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={config.deepseek_api_key}
                      onChange={(e) => setConfig(prev => ({ ...prev, deepseek_api_key: e.target.value }))}
                      placeholder="sk-..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Necesaria para el servicio DeepSeek Chat
                  </p>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Las claves de API se almacenan de forma segura y solo son accesibles por el super administrador. 
                  Nunca compartas estas claves con terceros.
                </AlertDescription>
              </Alert>

              <Button onClick={saveConfig} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Claves de API'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones de Uso</CardTitle>
            <CardDescription>
              Cómo utilizar el panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">1. Configurar IA</h4>
                <p className="text-sm text-muted-foreground">
                  Ajusta los porcentajes de distribución entre DeepSeek y OpenAI según tus necesidades.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">2. Agregar API Keys</h4>
                <p className="text-sm text-muted-foreground">
                  Ingresa tus claves de API reales para reemplazar las configuraciones de prueba.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">3. Guardar Cambios</h4>
                <p className="text-sm text-muted-foreground">
                  Haz clic en guardar para aplicar los cambios. El sistema se reiniciará automáticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}