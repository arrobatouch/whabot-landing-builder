'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { logger } from '@/lib/logger'
import { 
  Activity, 
  Image as ImageIcon, 
  Globe, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  service: 'openai' | 'deepseek' | 'hybrid' | 'system' | 'admin' | 'block' | 'image' | 'api'
  operation: string
  userId?: string
  sessionId: string
  duration?: number
  metadata?: any
  error?: string
}

export function BlockLogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [selectedService, setSelectedService] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Cargar logs iniciales
  useEffect(() => {
    refreshLogs()
  }, [])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshLogs()
    }, 2000) // Actualizar cada 2 segundos

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Filtrar logs
  useEffect(() => {
    let filtered = logs

    if (selectedService !== 'all') {
      filtered = filtered.filter(log => log.service === selectedService)
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel)
    }

    // Ordenar por timestamp (más reciente primero)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredLogs(filtered)
  }, [logs, selectedService, selectedLevel])

  const refreshLogs = () => {
    const currentLogs = logger.getLogs()
    setLogs(currentLogs)
  }

  const exportLogs = () => {
    const logsData = logger.exportLogs()
    const blob = new Blob([logsData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `whabot-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    // Esta función requeriría agregar un método clear al logger
    // Por ahora solo recargamos los logs
    refreshLogs()
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'block': return <Activity className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'api': return <Globe className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'debug': return <Activity className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-green-100 text-green-800 border-green-200'
      case 'warn': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'debug': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'block': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'image': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'api': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'system': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '-'
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  const getBlockStats = () => {
    const blockLogs = logs.filter(log => log.service === 'block')
    const imageLogs = logs.filter(log => log.service === 'image')
    const apiLogs = logs.filter(log => log.service === 'api')

    return {
      totalBlocks: blockLogs.length,
      activeBlocks: blockLogs.filter(log => log.metadata?.isActive).length,
      blocksWithImages: blockLogs.filter(log => log.metadata?.hasImages).length,
      totalImages: imageLogs.length,
      successfulImages: imageLogs.filter(log => log.metadata?.success !== false).length,
      totalApiCalls: apiLogs.length,
      successfulApiCalls: apiLogs.filter(log => log.metadata?.success !== false).length
    }
  }

  const stats = getBlockStats()

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Bloques</p>
                <p className="text-2xl font-bold">{stats.totalBlocks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Activos</p>
                <p className="text-2xl font-bold">{stats.activeBlocks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-sm font-medium">Imágenes</p>
                <p className="text-2xl font-bold">{stats.totalImages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Img OK</p>
                <p className="text-2xl font-bold">{stats.successfulImages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-cyan-500" />
              <div>
                <p className="text-sm font-medium">API</p>
                <p className="text-2xl font-bold">{stats.totalApiCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">API OK</p>
                <p className="text-2xl font-bold">{stats.successfulApiCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Logs de Seguimiento de Bloques</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto
              </Button>
              <Button variant="outline" size="sm" onClick={refreshLogs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refrescar
              </Button>
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Servicio:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-2 py-1 text-sm border rounded"
              >
                <option value="all">Todos</option>
                <option value="block">Bloques</option>
                <option value="image">Imágenes</option>
                <option value="api">API</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Nivel:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-2 py-1 text-sm border rounded"
              >
                <option value="all">Todos</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{filteredLogs.length} logs</span>
            </div>
          </div>

          {/* Lista de logs */}
          <ScrollArea className="h-96 border rounded-md">
            <div className="p-4 space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay logs que mostrar
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div
                    key={`${log.timestamp}-${index}`}
                    className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getLevelIcon(log.level)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className={getServiceColor(log.service)}>
                          <div className="flex items-center space-x-1">
                            {getServiceIcon(log.service)}
                            <span className="text-xs">{log.service}</span>
                          </div>
                        </Badge>
                        
                        <Badge variant="outline" className={getLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                        
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        
                        {log.duration && (
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(log.duration)}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">{log.operation}</span>
                        
                        {log.metadata?.blockType && (
                          <span className="ml-2 text-muted-foreground">
                            ({log.metadata.blockType})
                          </span>
                        )}
                        
                        {log.metadata?.blockId && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            #{log.metadata.blockId.slice(-8)}
                          </span>
                        )}
                      </div>
                      
                      {log.metadata?.hasImages !== undefined && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Imágenes: {log.metadata.imageCount || 0} 
                          {log.metadata.isActive !== undefined && (
                            <span className="ml-2">
                              Estado: {log.metadata.isActive ? '✅ Activo' : '❌ Inactivo'}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {log.error && (
                        <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                          Error: {log.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}