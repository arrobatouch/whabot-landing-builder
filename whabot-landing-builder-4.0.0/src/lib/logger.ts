export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  service: 'openai' | 'deepseek' | 'hybrid' | 'system' | 'admin' | 'block' | 'image' | 'api'
  operation: string
  userId?: string
  sessionId: string
  duration?: number
  tokens?: {
    input: number
    output: number
    total: number
  }
  cost?: {
    input: number
    output: number
    total: number
    currency: string
  }
  model?: string
  request?: any
  response?: any
  error?: string
  metadata?: any
  provider?: 'deepseek' | 'openai' | 'fallback' | 'unsplash' | 'websearch'
  fallback_reason?: string
}

class Logger {
  private logs: LogEntry[] = []
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  log(entry: Omit<LogEntry, 'timestamp' | 'sessionId'>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      ...entry
    }

    this.logs.push(logEntry)
    
    // También enviar a console para desarrollo
    console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.service}:${logEntry.operation}`, {
      ...logEntry,
      // No mostrar datos sensibles en console
      request: logEntry.request ? this.sanitizeData(logEntry.request) : null,
      response: logEntry.response ? this.sanitizeData(logEntry.response) : null
    })

    // Aquí podríamos enviar a un servicio externo como Datadog, New Relic, etc.
  }

  info(operation: string, service: LogEntry['service'], data: Partial<LogEntry> = {}): void {
    this.log({ level: 'info', operation, service, ...data })
  }

  warn(operation: string, service: LogEntry['service'], data: Partial<LogEntry> = {}): void {
    this.log({ level: 'warn', operation, service, ...data })
  }

  error(operation: string, service: LogEntry['service'], data: Partial<LogEntry> = {}): void {
    this.log({ level: 'error', operation, service, ...data })
  }

  debug(operation: string, service: LogEntry['service'], data: Partial<LogEntry> = {}): void {
    this.log({ level: 'debug', operation, service, ...data })
  }

  private sanitizeData(data: any): any {
    if (!data) return null
    
    // Eliminar información sensible
    const sensitiveKeys = ['api_key', 'password', 'token', 'secret', 'authorization']
    const sanitized = { ...data }
    
    for (const key in sanitized) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]'
      }
    }
    
    return sanitized
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  getMetrics() {
    const logs = this.logs
    
    return {
      total_requests: logs.length,
      by_service: {
        openai: logs.filter(l => l.service === 'openai').length,
        deepseek: logs.filter(l => l.service === 'deepseek').length,
        hybrid: logs.filter(l => l.service === 'hybrid').length,
        system: logs.filter(l => l.service === 'system').length,
        admin: logs.filter(l => l.service === 'admin').length,
        block: logs.filter(l => l.service === 'block').length,
        image: logs.filter(l => l.service === 'image').length,
        api: logs.filter(l => l.service === 'api').length
      },
      by_level: {
        info: logs.filter(l => l.level === 'info').length,
        warn: logs.filter(l => l.level === 'warn').length,
        error: logs.filter(l => l.level === 'error').length,
        debug: logs.filter(l => l.level === 'debug').length
      },
      total_tokens: {
        input: logs.reduce((sum, l) => sum + (l.tokens?.input || 0), 0),
        output: logs.reduce((sum, l) => sum + (l.tokens?.output || 0), 0),
        total: logs.reduce((sum, l) => sum + (l.tokens?.total || 0), 0)
      },
      total_cost: {
        input: logs.reduce((sum, l) => sum + (l.cost?.input || 0), 0),
        output: logs.reduce((sum, l) => sum + (l.cost?.output || 0), 0),
        total: logs.reduce((sum, l) => sum + (l.cost?.total || 0), 0)
      },
      average_duration: logs.length > 0 
        ? logs.reduce((sum, l) => sum + (l.duration || 0), 0) / logs.length 
        : 0
    }
  }

  // Métodos específicos para logging de bloques
  logBlock(blockType: string, operation: string, data: {
    blockId?: string
    isActive?: boolean
    hasImages?: boolean
    imageCount?: number
    imageUrls?: string[]
    content?: any
    error?: string
    duration?: number
    metadata?: any
  } = {}): void {
    this.info(`block_${operation}`, 'block', {
      metadata: {
        blockType,
        blockId: data.blockId,
        isActive: data.isActive,
        hasImages: data.hasImages,
        imageCount: data.imageCount,
        imageUrls: data.imageUrls,
        content: data.content,
        error: data.error,
        ...data.metadata
      },
      duration: data.duration,
      error: data.error
    })
  }

  logBlockRender(blockType: string, blockId: string, isActive: boolean, hasImages: boolean = false, imageCount: number = 0): void {
    this.logBlock(blockType, 'render', {
      blockId,
      isActive,
      hasImages,
      imageCount
    })
  }

  logBlockStateChange(blockType: string, blockId: string, fromState: boolean, toState: boolean): void {
    this.logBlock(blockType, 'state_change', {
      blockId,
      isActive: toState,
      metadata: {
        fromState,
        toState,
        changeType: toState ? 'activated' : 'deactivated'
      }
    })
  }

  logBlockImageOperation(blockType: string, blockId: string, operation: 'upload' | 'change' | 'remove' | 'load', imageUrl?: string, success: boolean = true, error?: string): void {
    this.logBlock(blockType, 'image_operation', {
      blockId,
      hasImages: !!imageUrl,
      imageUrls: imageUrl ? [imageUrl] : [],
      metadata: {
        imageOperation: operation,
        success,
        imageUrl
      },
      error: success ? undefined : error
    })
  }

  // Métodos específicos para logging de imágenes
  logImage(operation: string, data: {
    query?: string
    industry?: string
    provider?: 'unsplash' | 'websearch' | 'fallback'
    imageCount?: number
    imageUrls?: string[]
    duration?: number
    success?: boolean
    error?: string
    metadata?: any
  } = {}): void {
    this.info(`image_${operation}`, 'image', {
      metadata: {
        query: data.query,
        industry: data.industry,
        provider: data.provider,
        imageCount: data.imageCount,
        imageUrls: data.imageUrls,
        success: data.success,
        ...data.metadata
      },
      duration: data.duration,
      error: data.error,
      provider: data.provider
    })
  }

  logImageSearch(query: string, industry: string | undefined, provider: 'unsplash' | 'websearch' | 'fallback', imageCount: number, duration: number, success: boolean = true, error?: string): void {
    this.logImage('search', {
      query,
      industry,
      provider,
      imageCount,
      duration,
      success,
      error
    })
  }

  logImageLoad(imageUrl: string, blockType: string, blockId: string, success: boolean = true, loadTime?: number, error?: string): void {
    this.logImage('load', {
      metadata: {
        imageUrl,
        blockType,
        blockId,
        success,
        loadTime
      },
      duration: loadTime,
      success,
      error
    })
  }

  // Métodos específicos para logging de API
  logApi(operation: string, data: {
    endpoint?: string
    method?: string
    request?: any
    response?: any
    duration?: number
    success?: boolean
    error?: string
    metadata?: any
  } = {}): void {
    this.info(`api_${operation}`, 'api', {
      metadata: {
        endpoint: data.endpoint,
        method: data.method,
        success: data.success,
        ...data.metadata
      },
      request: data.request,
      response: data.response,
      duration: data.duration,
      error: data.error
    })
  }

  exportLogs(): string {
    return JSON.stringify({
      logs: this.logs,
      metrics: this.getMetrics(),
      exported_at: new Date().toISOString()
    }, null, 2)
  }
}

// Singleton instance
export const logger = new Logger()