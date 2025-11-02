# Guía de Monitoreo del Sistema de IA

## Overview

Este sistema incluye un monitoreo integral para el servicio de IA que permite:

- **Monitoreo en tiempo real** de las solicitudes a la API
- **Seguimiento de costos** y uso de tokens
- **Registro estructurado** de todas las operaciones
- **Exportación de datos** en múltiples formatos
- **Integración con Prometheus** para métricas

## Componentes

### 1. Logger (`/src/lib/logger.ts`)

Sistema de registro centralizado que captura:

- Timestamp y nivel de log
- Servicio (OpenAI, DeepSeek, Hybrid, System)
- Operación realizada
- Duración de la solicitud
- Uso de tokens (input/output/total)
- Costos calculados
- Errores y excepciones

### 2. API Endpoints

#### `/api/metrics` (GET)

- **Descripción**: Obtiene métricas agregadas del sistema
- **Formatos soportados**:
  - `json` (default): Formato JSON estándar
  - `prometheus`: Formato para scraping de Prometheus

**Ejemplo**:
```bash
curl http://localhost:3000/api/metrics?format=prometheus
```

#### `/api/metrics` (POST)

- **Descripción**: Exporta logs completos del sistema
- **Formatos soportados**:
  - `json` (default): Exportación en JSON
  - `csv`: Exportación en formato CSV

**Ejemplo**:
```bash
curl -X POST http://localhost:3000/api/metrics?format=csv -o logs.csv
```

### 3. Dashboard de Monitoreo

#### Interfaz Principal (`/monitoring`)

Dashboard completo con:

- **Estado del sistema**: Salud y tasa de error
- **Métricas principales**:
  - Total de solicitudes
  - Costo acumulado
  - Tokens procesados
  - Tiempo promedio de respuesta
- **Desglose por servicio**: Uso de OpenAI vs DeepSeek
- **Niveles de log**: Distribución por severidad
- **Exportación de datos**: JSON y CSV

#### Mini-Dashboard (en el chat conversacional)

Versión compacta accesible directamente desde la interfaz de chat con:

- Métricas clave en tiempo real
- Estado del sistema
- Acceso rápido al dashboard completo

## Métricas Disponibles

### Métricas de Sistema

- `total_requests`: Número total de solicitudes
- `by_service`: Distribución por servicio (openai, deepseek, hybrid, system)
- `by_level`: Distribución por nivel de log (info, warn, error, debug)

### Métricas de Rendimiento

- `average_duration`: Tiempo promedio de respuesta en ms
- `total_tokens`: Tokens procesados (input, output, total)
- `total_cost`: Costos acumulados (input, output, total)

### Métricas de Prometheus

- `ai_requests_total`: Contador de solicitudes por servicio
- `ai_tokens_total`: Contador de tokens por tipo
- `ai_cost_total`: Costos en USD
- `ai_requests_by_level`: Solicitudes por nivel de log
- `ai_average_duration_ms`: Tiempo promedio de respuesta

## Seguridad

### Protección de Datos Sensibles

El sistema automáticamente:

- Enmascara API keys y tokens
- Elimina información sensible de los logs
- Limpia datos de autenticación
- Protege información personal

### Variables de Entorno

Las siguientes variables deben ser configuradas:

```env
OPENAI_API_KEY=tu_api_key_segura
DEEPSEEK_API_KEY=tu_api_key_deepseek
LOG_LEVEL=debug
ENABLE_DETAILED_LOGGING=true
```

⚠️ **ADVERTENCIA**: Nunca exponer API keys en el código o commits.

## Configuración de Prometheus

Para integrar con Prometheus, agregar a `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'ai-platform'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
    params:
      format: ['prometheus']
```

## Exportación de Datos

### Formatos Disponibles

#### JSON
- Incluye logs completos con metadatos
- Métricas agregadas
- Información del sistema

#### CSV
- Formato tabular para análisis en hojas de cálculo
- Incluye campos principales de los logs
- Ideal para reportes

### Automatización

Ejemplo para exportación automática diaria:

```bash
# Exportar logs en JSON
curl -X POST "http://localhost:3000/api/metrics?format=json" \
  -H "Content-Type: application/json" \
  -o "ai-logs-$(date +%Y-%m-%d).json"

# Exportar métricas en formato Prometheus
curl "http://localhost:3000/api/metrics?format=prometheus" \
  -o "metrics-$(date +%Y-%m-%d).txt"
```

## Solución de Problemas

### Errores Comunes

1. **Error 401 Unauthorized**
   - Verificar API keys
   - Confirmar que las keys no estén revocadas

2. **Error 429 Too Many Requests**
   - Revisar límites de la API
   - Implementar rate limiting

3. **Error 500 Internal Server**
   - Verificar logs del sistema
   - Revisar conexión a servicios externos

### Monitoreo de Salud

El sistema proporciona indicadores de salud:

- **Saludable**: Tasa de error < 1%
- **Advertencia**: Tasa de error 1-5%
- **Crítico**: Tasa de error > 5%

## Optimización

### Recomendaciones

1. **Monitorear costos**: Establecer alertas para costos inesperados
2. **Seguimiento de tokens**: Optimizar prompts para reducir uso
3. **Tiempo de respuesta**: Identificar cuellos de botella
4. **Tasa de error**: Investigar errores recurrentes

### Métricas Clave a Vigilar

- `cost_per_request`: Costo promedio por solicitud
- `tokens_per_request`: Eficiencia en uso de tokens
- `error_rate`: Porcentaje de solicitudes fallidas
- `response_time_p95`: Percentil 95 de tiempo de respuesta

## Futuras Mejoras

- Integración con sistemas de alertas (Slack, Email)
- Dashboard en tiempo real con WebSockets
- Análisis predictivo de costos
- Integración con APM tools
- Métricas de negocio adicionales