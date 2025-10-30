import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

interface AdminConfig {
  deepseek_percentage: number
  openai_percentage: number
  openai_api_key: string
  deepseek_api_key: string
}

// Default configuration
const defaultConfig: AdminConfig = {
  deepseek_percentage: 80,
  openai_percentage: 20,
  openai_api_key: process.env.OPENAI_API_KEY || '',
  deepseek_api_key: process.env.DEEPSEEK_API_KEY || ''
}

// In-memory storage (in production, use a database)
let currentConfig: AdminConfig = { ...defaultConfig }

export async function GET() {
  try {
    logger.info('admin_config_accessed', 'admin', {
      operation: 'get_config'
    })

    // Return current configuration with real API keys for internal use
    const config = {
      deepseek_percentage: currentConfig.deepseek_percentage,
      openai_percentage: currentConfig.openai_percentage,
      openai_api_key: currentConfig.openai_api_key || process.env.OPENAI_API_KEY || '',
      deepseek_api_key: currentConfig.deepseek_api_key || process.env.DEEPSEEK_API_KEY || ''
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    logger.error('admin_config_error', 'admin', {
      operation: 'get_config',
      error: error.message
    })

    return NextResponse.json(
      { error: 'Failed to get configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<AdminConfig>
    
    logger.info('admin_config_update', 'admin', {
      operation: 'update_config',
      has_deepseek_percentage: body.deepseek_percentage !== undefined,
      has_openai_percentage: body.openai_percentage !== undefined,
      has_openai_key: !!body.openai_api_key,
      has_deepseek_key: !!body.deepseek_api_key
    })

    // Validate percentages
    if (body.deepseek_percentage !== undefined || body.openai_percentage !== undefined) {
      const deepseek = body.deepseek_percentage ?? currentConfig.deepseek_percentage
      const openai = body.openai_percentage ?? currentConfig.openai_percentage
      
      if (deepseek + openai !== 100) {
        return NextResponse.json(
          { error: 'La suma de porcentajes debe ser 100%' },
          { status: 400 }
        )
      }
      
      if (deepseek < 0 || deepseek > 100 || openai < 0 || openai > 100) {
        return NextResponse.json(
          { error: 'Los porcentajes deben estar entre 0 y 100' },
          { status: 400 }
        )
      }
    }

    // Update configuration
    if (body.deepseek_percentage !== undefined) {
      currentConfig.deepseek_percentage = body.deepseek_percentage
    }
    if (body.openai_percentage !== undefined) {
      currentConfig.openai_percentage = body.openai_percentage
    }
    if (body.openai_api_key !== undefined) {
      currentConfig.openai_api_key = body.openai_api_key
    }
    if (body.deepseek_api_key !== undefined) {
      currentConfig.deepseek_api_key = body.deepseek_api_key
    }

    logger.info('admin_config_updated', 'admin', {
      operation: 'update_config_success',
      deepseek_percentage: currentConfig.deepseek_percentage,
      openai_percentage: currentConfig.openai_percentage
    })

    return NextResponse.json({
      success: true,
      config: {
        deepseek_percentage: currentConfig.deepseek_percentage,
        openai_percentage: currentConfig.openai_percentage,
        openai_api_key: currentConfig.openai_api_key || process.env.OPENAI_API_KEY || '',
        deepseek_api_key: currentConfig.deepseek_api_key || process.env.DEEPSEEK_API_KEY || ''
      }
    })

  } catch (error) {
    logger.error('admin_config_error', 'admin', {
      operation: 'update_config',
      error: error.message
    })

    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}