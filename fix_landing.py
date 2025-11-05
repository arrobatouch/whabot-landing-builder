#!/usr/bin/env python3

import re

# Read the original file
with open('/home/z/my-project/src/components/LandingAssistant.tsx', 'r') as f:
    content = f.read()

# Remove testimonials block
testimonials_pattern = r'// 11 - Bloque de Testimonios.*?},\s*}'
content = re.sub(testimonials_pattern, '', content, flags=re.DOTALL)

# Remove pricing block  
pricing_pattern = r'// 13 - Bloque de Precios.*?},\s*}'
content = re.sub(pricing_pattern, '', content, flags=re.DOTALL)

# Add new services block before CTA
services_block = '''      // 11.5 - Bloque de Servicios Destacados
      {
        id: "services-1",
        type: "features",
        content: {
          title: "Servicios Destacados",
          subtitle: "Conocé nuestras soluciones principales",
          features: [
            {
              icon: "🚀",
              title: "Consultoría Integral",
              description: "Asesoramiento personalizado para tu negocio"
            },
            {
              icon: "💡",
              title: "Soluciones Innovadoras",
              description: "Tecnología de punta para tu empresa"
            }
          ],
          styles: {
            backgroundColor: "bg-background",
            paddingY: "py-16",
            paddingX: "px-6"
          }
        }
      },
      // 12 - Bloque CTA'''

cta_pattern = r'// 12 - Bloque CTA'
content = re.sub(cta_pattern, services_block, content)

# Write the modified content back
with open('/home/z/my-project/src/components/LandingAssistant.tsx', 'w') as f:
    f.write(content)

print("File modified successfully")