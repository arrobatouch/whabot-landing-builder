export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  service: 'openai' | 'deepseek' | 'hybrid' | 'system' | 'admin'
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
  provider?: 'deepseek' | 'openai' | 'fallback'
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
        admin: logs.filter(l => l.service === 'admin').length
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