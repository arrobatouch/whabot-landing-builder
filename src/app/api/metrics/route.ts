import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const metrics = logger.getMetrics()
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    
    logger.info('metrics_accessed', 'system', {
      operation: 'get_metrics',
      format,
      ip: request.ip || 'unknown'
    })

    if (format === 'prometheus') {
      // Formato Prometheus para scraping
      const prometheusMetrics = [
        '# HELP ai_requests_total Total number of AI requests',
        '# TYPE ai_requests_total counter',
        `ai_requests_total{service="openai"} ${metrics.by_service.openai}`,
        `ai_requests_total{service="deepseek"} ${metrics.by_service.deepseek}`,
        `ai_requests_total{service="hybrid"} ${metrics.by_service.hybrid}`,
        `ai_requests_total{service="system"} ${metrics.by_service.system}`,
        '',
        '# HELP ai_tokens_total Total number of tokens processed',
        '# TYPE ai_tokens_total counter',
        `ai_tokens_total{type="input"} ${metrics.total_tokens.input}`,
        `ai_tokens_total{type="output"} ${metrics.total_tokens.output}`,
        `ai_tokens_total{type="total"} ${metrics.total_tokens.total}`,
        '',
        '# HELP ai_cost_total Total cost in USD',
        '# TYPE ai_cost_total gauge',
        `ai_cost_total{type="input"} ${metrics.total_cost.input}`,
        `ai_cost_total{type="output"} ${metrics.total_cost.output}`,
        `ai_cost_total{type="total"} ${metrics.total_cost.total}`,
        '',
        '# HELP ai_requests_by_level Total requests by log level',
        '# TYPE ai_requests_by_level counter',
        `ai_requests_by_level{level="info"} ${metrics.by_level.info}`,
        `ai_requests_by_level{level="warn"} ${metrics.by_level.warn}`,
        `ai_requests_by_level{level="error"} ${metrics.by_level.error}`,
        `ai_requests_by_level{level="debug"} ${metrics.by_level.debug}`,
        '',
        '# HELP ai_average_duration_ms Average request duration in milliseconds',
        '# TYPE ai_average_duration_ms gauge',
        `ai_average_duration_ms ${metrics.average_duration}`,
        '',
        '# HELP ai_session_info Information about current session',
        '# TYPE ai_session_info gauge',
        `ai_session_info{metric="total_requests"} ${metrics.total_requests}`,
      ].join('\n')

      return new NextResponse(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4'
        }
      })
    }

    // Formato JSON por defecto
    return NextResponse.json({
      service: 'ai-platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      metrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    })

  } catch (error) {
    logger.error('metrics_error', 'system', {
      operation: 'get_metrics',
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Failed to get metrics' },
      { status: 500 }
    )
  }
}

// Endpoint para exportar logs
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    
    logger.info('logs_exported', 'system', {
      operation: 'export_logs',
      format,
      ip: request.ip || 'unknown'
    })

    const logs = logger.getLogs()
    const metrics = logger.getMetrics()
    
    const exportData = {
      service: 'ai-platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      logs,
      metrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV
    }

    if (format === 'csv') {
      // Formato CSV para los logs
      const csvHeaders = [
        'timestamp',
        'level',
        'service',
        'operation',
        'duration',
        'tokens_input',
        'tokens_output',
        'tokens_total',
        'cost_input',
        'cost_output',
        'cost_total',
        'model',
        'error'
      ]
      
      const csvRows = logs.map(log => [
        log.timestamp,
        log.level,
        log.service,
        log.operation,
        log.duration || '',
        log.tokens?.input || '',
        log.tokens?.output || '',
        log.tokens?.total || '',
        log.cost?.input || '',
        log.cost?.output || '',
        log.cost?.total || '',
        log.model || '',
        log.error || ''
      ])
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="ai-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Formato JSON por defecto
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ai-logs-${new Date().toISOString().split('T')[0]}.json"`
      }
    })

  } catch (error) {
    logger.error('logs_export_error', 'system', {
      operation: 'export_logs',
      error: error.message
    })
    
    return NextResponse.json(
      { error: 'Failed to export logs' },
      { status: 500 }
    )
  }
}