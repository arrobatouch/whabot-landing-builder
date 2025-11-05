'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabContent } from '@/components/ui/tabs'
import { BlockLogsViewer } from '@/components/BlockLogsViewer'
import { 
  BarChart3, 
  DollarSign, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Zap,
  Download,
  FileText,
  Table,
  Activity
} from 'lucide-react'

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

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('ai-metrics')

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      const data = await response.json()
      setMetrics(data.metrics)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Actualizar cada 30 segundos
    return () => clearInterval(interval)
  }, [])

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

  const tabs = [
    {
      id: 'ai-metrics',
      label: 'Métricas de IA',
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: 'block-logs',
      label: 'Logs de Bloques',
      icon: <Activity className="h-4 w-4" />
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay métricas disponibles</h3>
        <p className="text-muted-foreground">Asegúrate de que el sistema esté funcionando correctamente.</p>
      </div>
    )
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

  const getHealthStatus = () => {
    const errorRate = metrics.by_level.error / metrics.total_requests
    if (errorRate < 0.01) return { status: 'healthy', color: 'bg-green-500', text: 'Saludable' }
    if (errorRate < 0.05) return { status: 'warning', color: 'bg-yellow-500', text: 'Advertencia' }
    return { status: 'critical', color: 'bg-red-500', text: 'Crítico' }
  }

  const health = getHealthStatus()

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoreo del Sistema</h2>
          <p className="text-muted-foreground">
            IA Híbrida: 80% DeepSeek • 20% OpenAI • Fallback automático<br />
            Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchMetrics} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
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

      {/* Tabs */}
      <div className="space-y-6">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <TabContent active={activeTab === 'ai-metrics'}>
          <div className="space-y-6">
            {/* Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${health.color}`}></div>
                  <span>Estado del Sistema IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{health.text}</p>
                    <p className="text-sm text-muted-foreground">
                      Tasa de error: {((metrics.by_level.error / metrics.total_requests) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Main Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Solicitudes</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(metrics.total_requests)}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% desde la última hora
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
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.average_duration.toFixed(0)}ms</div>
                  <p className="text-xs text-muted-foreground">
                    Respuesta rápida
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitudes por Servicio</CardTitle>
                  <CardDescription>Distribución de uso entre DeepSeek y OpenAI (80/20)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics.by_service).map(([service, count]) => (
                      <div key={service} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4" />
                          <span className="font-medium capitalize">{service}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{formatNumber(count)}</span>
                          <Badge variant={count > 0 ? 'default' : 'secondary'}>
                            {((count / metrics.total_requests) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nivel de Logs</CardTitle>
                  <CardDescription>Distribución de mensajes por nivel de severidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics.by_level).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {level === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {level === 'warn' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {level === 'info' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                          {level === 'debug' && <CheckCircle className="h-4 w-4 text-gray-500" />}
                          <span className="font-medium capitalize">{level}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{formatNumber(count)}</span>
                          <Badge variant={level === 'error' ? 'destructive' : level === 'warn' ? 'default' : 'secondary'}>
                            {((count / metrics.total_requests) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabContent>

        <TabContent active={activeTab === 'block-logs'}>
          <BlockLogsViewer />
        </TabContent>
      </div>
    </div>
  )
}