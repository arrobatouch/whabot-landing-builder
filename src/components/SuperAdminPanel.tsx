'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Settings, 
  BarChart3, 
  DollarSign, 
  Key, 
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  FileText,
  Table
} from 'lucide-react'

interface AdminConfig {
  deepseek_percentage: number
  openai_percentage: number
  openai_api_key: string
  deepseek_api_key: string
}

interface Metrics {
  total_requests: number
  by_service: {
    openai: number
    deepseek: number
    hybrid: number
    system: number
  }
  by_level: {
    info: number
    warn: number
    error: number
    debug: number
  }
  total_tokens: {
    input: number
    output: number
    total: number
  }
  total_cost: {
    input: number
    output: number
    total: number
  }
  average_duration: number
}

export function SuperAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [config, setConfig] = useState<AdminConfig>({
    deepseek_percentage: 80,
    openai_percentage: 20,
    openai_api_key: '',
    deepseek_api_key: ''
  })
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Simple password authentication (in production, use proper auth)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchConfig()
      fetchMetrics()
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

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
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
        // Update environment variables
        await fetch('/api/admin/env', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            OPENAI_API_KEY: config.openai_api_key,
            DEEPSEEK_API_KEY: config.deepseek_api_key
          }),
        })
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la configuración' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setSaving(false)
    }
  }

  const exportLogs = async (format: 'json' | 'csv' = 'json') => {
    try {
      const response = await fetch(`/api/metrics?format=${format}`, {
        method: 'POST'
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-metrics-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting logs:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num)
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto p-6 space-y-6">
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

        <Tabs defaultValue="config" className="space-y-6">
          <Tabs.List className="grid w-full grid-cols-3">
            <Tabs.Trigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </Tabs.Trigger>
            <Tabs.Trigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Métricas
            </Tabs.Trigger>
            <Tabs.Trigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="config" className="space-y-6">
            {/* Configuration Tab Content */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema Híbrido</CardTitle>
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
          </Tabs.Content>

          <Tabs.Content value="metrics" className="space-y-6">
            {/* Metrics Tab Content */}
            {metrics ? (
              <div className="space-y-6">
                {/* Header with refresh and export */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={fetchMetrics} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar
                    </Button>
                    <div className="flex space-x-1">
                      <Button onClick={() => exportLogs('json')} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button onClick={() => exportLogs('csv')} variant="outline" size="sm">
                        <Table className="h-4 w-4 mr-1" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Main Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(metrics.total_requests)}</div>
                      <p className="text-xs text-muted-foreground">
                        Solicitudes procesadas
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(metrics.total_cost.total)}</div>
                      <p className="text-xs text-muted-foreground">
                        Promedio: {formatCurrency(metrics.total_cost.total / metrics.total_requests)} por solicitud
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tokens Procesados</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(metrics.total_tokens.total)}</div>
                      <p className="text-xs text-muted-foreground">
                        Input: {formatNumber(metrics.total_tokens.input)} | Output: {formatNumber(metrics.total_tokens.output)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.average_duration.toFixed(0)}ms</div>
                      <p className="text-xs text-muted-foreground">
                          Tiempo de respuesta
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Cargando métricas...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </Tabs.Content>

          <Tabs.Content value="api" className="space-y-6">
            {/* API Keys Tab Content */}
            <div className="space-y-6">
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

                    <Separator />

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
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  )
}