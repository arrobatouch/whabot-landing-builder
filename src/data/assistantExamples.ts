export interface AssistantExample {
  id: string
  text: string
  category: string
  active: boolean
}

export const defaultExamples: AssistantExample[] = [
  {
    id: '1',
    text: 'Tengo una zapatería artesanal en Buenos Aires, quiero vender online',
    category: 'retail',
    active: true
  },
  {
    id: '2',
    text: 'Soy nutricionista y necesito una web para mostrar mis servicios y citas',
    category: 'services',
    active: true
  },
  {
    id: '3',
    text: 'Tengo un restaurante de comida italiana y quiero mostrar menú y reservas',
    category: 'food',
    active: true
  },
  {
    id: '4',
    text: 'Vendo productos de skincare naturales y necesito catálogo online',
    category: 'beauty',
    active: true
  },
  {
    id: '5',
    text: 'Soy fotógrafo y quiero mostrar mi portfolio y contactos',
    category: 'creative',
    active: true
  },
  {
    id: '6',
    text: 'Tengo una agencia de marketing digital y necesito mostrar mis servicios',
    category: 'services',
    active: true
  },
  {
    id: '7',
    text: 'Vendo cursos online sobre programación y diseño web',
    category: 'education',
    active: true
  },
  {
    id: '8',
    text: 'Tengo un gimnasio y quiero mostrar planes de membresía y horarios',
    category: 'fitness',
    active: true
  },
  {
    id: '9',
    text: 'Soy abogado y necesito una web para mostrar mis especialidades',
    category: 'professional',
    active: true
  },
  {
    id: '10',
    text: 'Tengo una tienda de ropa infantil y quiero vender online',
    category: 'retail',
    active: true
  }
]

// Función para obtener ejemplos activos
export function getActiveExamples(): string[] {
  return defaultExamples
    .filter(example => example.active)
    .map(example => example.text)
}

// Función para agregar un nuevo ejemplo
export function addExample(text: string, category: string = 'general'): AssistantExample {
  const newExample: AssistantExample = {
    id: Date.now().toString(),
    text,
    category,
    active: true
  }
  defaultExamples.push(newExample)
  return newExample
}

// Función para actualizar un ejemplo
export function updateExample(id: string, updates: Partial<AssistantExample>): AssistantExample | null {
  const index = defaultExamples.findIndex(example => example.id === id)
  if (index !== -1) {
    defaultExamples[index] = { ...defaultExamples[index], ...updates }
    return defaultExamples[index]
  }
  return null
}

// Función para eliminar un ejemplo
export function deleteExample(id: string): boolean {
  const index = defaultExamples.findIndex(example => example.id === id)
  if (index !== -1) {
    defaultExamples.splice(index, 1)
    return true
  }
  return false
}

// Función para activar/desactivar un ejemplo
export function toggleExample(id: string): boolean {
  const example = defaultExamples.find(example => example.id === id)
  if (example) {
    example.active = !example.active
    return true
  }
  return false
}