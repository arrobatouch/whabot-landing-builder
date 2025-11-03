import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { OPENAI_API_KEY, DEEPSEEK_API_KEY } = body

    logger.info('admin_env_update', 'admin', {
      operation: 'update_env',
      has_openai_key: !!OPENAI_API_KEY,
      has_deepseek_key: !!DEEPSEEK_API_KEY
    })

    // Validate that we have the required data
    if (!OPENAI_API_KEY && !DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'Se requiere al menos una clave de API para actualizar' },
        { status: 400 }
      )
    }

    // Read current .env.local file
    const envPath = join(process.cwd(), '.env.local')
    
    try {
      let envContent = ''
      
      // Try to read existing file
      if (existsSync(envPath)) {
        envContent = readFileSync(envPath, 'utf8')
      }

      // Update or add OpenAI API key
      if (OPENAI_API_KEY) {
        const openaiRegex = /^OPENAI_API_KEY=.*$/m
        if (openaiRegex.test(envContent)) {
          envContent = envContent.replace(openaiRegex, `OPENAI_API_KEY=${OPENAI_API_KEY}`)
        } else {
          envContent += `\nOPENAI_API_KEY=${OPENAI_API_KEY}`
        }
      }

      // Update or add DeepSeek API key
      if (DEEPSEEK_API_KEY) {
        const deepseekRegex = /^DEEPSEEK_API_KEY=.*$/m
        if (deepseekRegex.test(envContent)) {
          envContent = envContent.replace(deepseekRegex, `DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}`)
        } else {
          envContent += `\nDEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}`
        }
      }

      // Write back to file
      writeFileSync(envPath, envContent.trim())

      logger.info('admin_env_updated', 'admin', {
        operation: 'update_env_success',
        keys_updated: {
          openai: !!OPENAI_API_KEY,
          deepseek: !!DEEPSEEK_API_KEY
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Variables de entorno actualizadas correctamente'
      })

    } catch (fsError) {
      logger.error('admin_env_fs_error', 'admin', {
        operation: 'update_env',
        error: fsError.message
      })

      return NextResponse.json(
        { error: 'Error al escribir en el archivo .env.local' },
        { status: 500 }
      )
    }

  } catch (error) {
    logger.error('admin_env_error', 'admin', {
      operation: 'update_env',
      error: error.message
    })

    return NextResponse.json(
      { error: 'Failed to update environment variables' },
      { status: 500 }
    )
  }
}