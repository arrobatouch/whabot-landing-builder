# Sistema de Monitoreo y Logging para Plataforma de IA

## 🎯 **Objetivo**

Implementar un sistema completo de monitoreo, logging y métricas para la plataforma de IA conversacional, con integración con OpenAI y soporte para Prometheus.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales**

1. **Logger (`/src/lib/logger.ts`)**
   - Logging estructurado con niveles (info, warn, error, debug)
   - Seguimiento de costos y tokens
   - Sanitización automática de datos sensibles
   - Exportación de métricas

2. **API Routes**
   - `/api/ai/openai` - Endpoint principal con OpenAI GPT-4o mini
   - `/api/metrics` - Métricas en formato JSON y Prometheus
   - `/api/ai/deepseek` - Fallback con DeepSeek (mantenido por compatibilidad)

3. **Monitoring Dashboard (`/src/components/MonitoringDashboard.tsx`)**
   - Interfaz visual para métricas en tiempo real
   - Indicadores de salud del sistema
   - Exportación de datos

## 📊 **Métricas Disponibles**

### **Métricas de Negocio**
- Total de solicitudes por servicio
- Costo total y promedio por solicitud
- Consumo de tokens (input/output)
- Tiempo de respuesta promedio

### **Métricas Técnicas**
- Distribución por nivel de log
- Tasa de error
- Disponibilidad del servicio
- Latencia

### **Métricas de Prometheus**
```
ai_requests_total{service="openai|deepseek|hybrid|system"}
ai_tokens_total{type="input|output|total"}
ai_cost_total{type="input|output|total"}
ai_requests_by_level{level="info|warn|error|debug"}
ai_average_duration_ms
```

## 🔧 **Configuración**

### **Variables de Entorno**

```bash
# .env.local
OPENAI_API_KEY=sk-your-openai-key
DEEPSEEK_API_KEY=sk-your-deepseek-key
LOG_LEVEL=debug
ENABLE_DETAILED_LOGGING=true
```

### **Configuración de Prometheus**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'ai-platform'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
    params:
      format: ['prometheus']
```

## 🚀 **Uso del Sistema**

### **1. Logging en el Código**

```typescript
import { logger } from '@/lib/logger'

// Registrar evento informativo
logger.info('user_message', 'openai', {
  userId: 'user-123',
  message_length: message.length
})

// Registrar error
logger.error('api_failure', 'openai', {
  error: error.message,
  status_code: response.status
})
```

### **2. Acceso a Métricas**

#### **Formato JSON**
```
GET /api/metrics
```

#### **Formato Prometheus**
```
GET /api/metrics?format=prometheus
```

### **3. Dashboard de Monitoreo**

```typescript
import { MonitoringDashboard } from '@/components/MonitoringDashboard'

// En tu componente
<MonitoringDashboard />
```

## 📈 **Análisis de Costos**

### **Precios Actuales (OpenAI GPT-4o mini)**
- Input: $0.15 por 1M tokens
- Output: $0.60 por 1M tokens

### **Estimación de Costos**
- Conversación típica: ~100 tokens input, ~50 tokens output
- Costo por conversación: ~$0.000045
- 1,000 conversaciones: ~$0.045
- 10,000 conversaciones: ~$0.45

## 🔍 **Alertas Recomendadas**

### **Alertas de Prometheus**

```yaml
# alertas.yml
groups:
- name: ai_platform
  rules:
  - alert: HighErrorRate
    expr: rate(ai_requests_by_level{level="error"}[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Alta tasa de errores en IA Platform"
      description: "Tasa de errores: {{ $value }}"

  - alert: HighCost
    expr: rate(ai_cost_total[1h]) > 0.1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Alto costo de IA detectado"
      description: "Costo por hora: ${{ $value }}"
```

## 🛠️ **Mantenimiento**

### **Limpieza de Logs**
- Los logs se mantienen en memoria por sesión
- Para persistencia, implementar almacenamiento en BD
- Considerar rotación de logs para producción

### **Optimización**
- Monitorear patrones de uso
- Ajustar modelos según costo-beneficio
- Implementar caching para respuestas repetitivas

## 🔒 **Seguridad**

### **Protección de Datos**
- API keys sanitizadas en logs
- No almacenar información sensible
- Encriptación de datos en tránsito

### **Control de Acceso**
- Limitar acceso a endpoints de métricas
- Implementar autenticación para dashboard
- Usar HTTPS en producción

## 📝 **Troubleshooting**

### **Problemas Comunes**

1. **Error 401 en OpenAI**
   - Verificar API key en .env.local
   - Confirmar que la key no esté expirada

2. **Altos costos inesperados**
   - Revisar logs de consumo
   - Verificar uso de modelos adecuados
   - Implementar límites de uso

3. **Lentitud en respuestas**
   - Monitorear tiempo de respuesta
   - Verificar latencia de red
   - Considerar timeout adecuados

### **Debug Mode**
```bash
# Habilitar logging detallado
ENABLE_DETAILED_LOGGING=true LOG_LEVEL=debug npm run dev
```

## 📋 **Checklist de Producción**

- [ ] Revocar API keys expuestas
- [ ] Configurar nuevas API keys
- [ ] Implementar HTTPS
- [ ] Configurar monitoreo con Prometheus
- [ ] Establecer alertas
- [ ] Probar fallbacks
- [ ] Documentar procedimientos
- [ ] Entrenar equipo de soporte

---

**Nota Importante**: Este sistema está diseñado para escalar con tu negocio. La configuración actual es óptima para MVP y puede ser ajustada según necesidades específicas.