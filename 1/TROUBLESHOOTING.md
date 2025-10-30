# Guía de Solución de Problemas - Integración DeepSeek

## Problemas Comunes y Soluciones

### 1. Error al generar contenido con IA al mejorar

**Síntomas:**
- La aplicación muestra un error al intentar mejorar contenido con IA
- Los mensajes de error son genéricos o poco informativos

**Soluciones:**

#### Verificar logs del servidor
1. Abre la consola del navegador (F12) y busca errores en la pestaña "Console"
2. Revisa el archivo `dev.log` en la raíz del proyecto para ver los logs del servidor
3. Busca mensajes que contengan "DeepSeek API" o "AI generation error"

#### Probar con diferentes proveedores
1. Intenta usar el proveedor "Z-AI" en lugar de "DeepSeek"
2. Si Z-AI funciona pero DeepSeek no, el problema está específicamente con la API de DeepSeek

#### Verificar la API Key de DeepSeek
1. Asegúrate de que la API Key `sk-153b8d4e9a934698b3906e6fe8126dd1` sea válida
2. Verifica que la API Key no haya expirado o sido revocada

#### Probar la API directamente
Usa el script de prueba `test-deepseek-simple.js` para verificar la conexión:

```bash
node test-deepseek-simple.js
```

### 2. Tiempo de espera agotado

**Síntomas:**
- La solicitud tarda mucho tiempo y finalmente falla
- Mensajes de error como "timeout" o "request timeout"

**Soluciones:**
1. Aumenta el tiempo de espera en la configuración
2. Verifica tu conexión a internet
3. Intenta con prompts más cortos

### 3. Error de autenticación con DeepSeek

**Síntomas:**
- Mensajes de error como "401 Unauthorized" o "invalid API key"
- El servidor responde con código de estado 401

**Soluciones:**
1. Verifica que la API Key sea correcta
2. Asegúrate de que la API Key tenga los permisos necesarios
3. Contacta al soporte de DeepSeek si el problema persiste

### 4. Error de límite de cuota

**Síntomas:**
- Mensajes de error sobre límites de uso o cuota excedida
- Código de estado 429 (Too Many Requests)

**Soluciones:**
1. Espera un tiempo antes de hacer más solicitudes
2. Verifica los límites de tu plan de DeepSeek
3. Considera actualizar tu plan si necesitas más solicitudes

### 5. Error de formato de respuesta

**Síntomas:**
- La API responde pero el contenido no se puede procesar
- Mensajes de error sobre formato JSON inválido

**Soluciones:**
1. Revisa el formato del prompt enviado
2. Asegúrate de que el tipo de solicitud sea correcto ('content' o 'image')
3. Verifica que los parámetros enviados sean válidos

## Pasos de Depuración

### 1. Habilitar logs detallados
Los logs están habilitados en la API. Busca estos mensajes en la consola:
- `AI Generation Request - Provider: ...`
- `Sending request to DeepSeek API...`
- `DeepSeek API response status: ...`
- `DeepSeek API response data: ...`

### 2. Probar con curl
Puedes probar la API directamente con curl:

```bash
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hola, ¿cómo estás?",
    "type": "content",
    "provider": "deepseek"
  }'
```

### 3. Verificar el estado del servidor
Asegúrate de que el servidor esté corriendo correctamente:

```bash
# Verificar que el puerto 3000 esté en uso
lsof -i :3000

# O verificar los procesos de Node
ps aux | grep node
```

## Contacto y Soporte

Si los problemas persisten después de seguir estos pasos:

1. Revisa la consola del navegador para errores específicos
2. Consulta los logs del servidor en `dev.log`
3. Proporciona la siguiente información al solicitar ayuda:
   - El mensaje de error exacto
   - El proveedor que estabas usando (DeepSeek o Z-AI)
   - El tipo de solicitud (content o image)
   - El prompt que intentaste usar

## Notas Importantes

- DeepSeek solo admite generación de contenido de texto, no imágenes
- Z-AI admite tanto texto como imágenes
- Los tiempos de respuesta pueden variar dependiendo de la carga del servidor
- Asegúrate de tener una conexión a internet estable