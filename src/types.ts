export interface BlockType {
  id: string
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'footer' | 'reinforcement' | 'hero-split' | 'pricing' | 'stats' | 'timeline' | 'faq' | 'image' | 'process' | 'product-cart' | 'product-features' | 'whatsapp-contact' | 'social-media' | 'hero-slide' | 'youtube' | 'hero-banner' | 'countdown'
  content: any
  position: number
}

export interface TemplateType {
  name: 'blank' | 'perfumery' | 'saas' | 'portfolio' | 'event' | 'next-gen'
}

export interface HeroBlockContent {
  title: string
  subtitle: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  backgroundImage: string
}

export interface FeaturesBlockContent {
  title: string
  subtitle: string
  features: Array<{
    icon: string
    title: string
    description: string
  }>
}

export interface TestimonialsBlockContent {
  title: string
  testimonials: Array<{
    name: string
    role: string
    company: string
    content: string
    avatar: string
  }>
}

export interface CtaBlockContent {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
}

export interface FooterBlockContent {
  logo: string
  company: string
  description: string
  links: Array<{
    title: string
    items: Array<{
      text: string
      url: string
    }>
  }>
  socialLinks: Array<{
    platform: string
    url: string
    icon: string
  }>
}

export interface ReinforcementBlockContent {
  title: string
  description: string
  features: Array<{
    title: string
    description: string
  }>
}

export interface HeroSplitBlockContent {
  title: string
  subtitle: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  image: string
}

export interface PricingBlockContent {
  title: string
  subtitle: string
  plans: Array<{
    icon: string
    name: string
    price: string
    period: string
    description: string
    features: string[]
    buttonText: string
    buttonLink: string
    featured: boolean
  }>
}

export interface StatsBlockContent {
  title: string
  stats: Array<{
    icon: string
    value: string
    label: string
  }>
}

export interface TimelineBlockContent {
  title: string
  events: Array<{
    icon: string
    date: string
    title: string
    description: string
  }>
}

export interface FaqBlockContent {
  title: string
  faqs: Array<{
    question: string
    answer: string
  }>
}

export interface ImageBlockContent {
  title: string
  description: string
  image: string
  alt: string
}

export interface ProcessBlockContent {
  title: string
  subtitle: string
  steps: Array<{
    icon: string
    title: string
    description: string
  }>
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface WhatsAppContactBlockContent {
  title: string
  description: string
  whatsappNumber: string
  defaultMessage: string
  buttonText: string
  leftImage: string
  leftImageAlt: string
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface ProductFeaturesBlockContent {
  title: string
  subtitle: string
  leftItems: Array<{
    id: string
    icon: string
    title: string
    description: string
  }>
  centerImage: string
  centerImageAlt: string
  rightItems: Array<{
    id: string
    icon: string
    title: string
    description: string
  }>
  buttonText: string
  buttonLink: string
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface ProductCartBlockContent {
  title: string
  subtitle: string
  whatsappNumber: string
  products: Array<{
    id: string
    name: string
    description: string
    price: number
    currency: string
    image: string
    category: string
    inStock: boolean
    features?: string[]
  }>
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface SocialMediaBlockContent {
  buttonPosition: 'right' | 'left'
  buttonMargin: number
  buttonColor: string
  socialLinks: Array<{
    id: string
    name: string
    icon: string
    url: string
    order: number
  }>
  animationType: 'vertical' | 'radial'
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface HeroSlideContent {
  slides: Array<{
    id: string
    backgroundImage: string
    title: string
    subtitle: string
    buttonText: string
    buttonType: 'external' | 'internal' | 'block'
    buttonTarget: string
    textColor: 'light' | 'dark' | 'custom'
    customTextColor?: string
    imageFilter: 'none' | 'blur' | 'shadow' | 'gradient'
  }>
  navigationStyle: 'arrows' | 'dots' | 'progress'
  autoPlay: boolean
  autoPlayInterval: number
  transitionType: 'fade' | 'slide' | 'parallax' | 'zoom'
  transitionSpeed: number
  height: 'fixed' | 'viewport'
  fixedHeight?: number
  marginTop: number
  marginBottom: number
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface YouTubeBlockContent {
  title: string
  description: string
  videoUrl: string
  videoId: string
  visualMode: 'light' | 'dark'
  controls: {
    hideControls: boolean
    hideTitle: boolean
    autoPlay: boolean
    muteOnStart: boolean
    loop: boolean
    showRelatedVideos: boolean
    modestBranding: boolean
  }
  size: {
    preset: 'small' | 'medium' | 'large' | 'custom'
    height: string
    heightUnit: 'px' | 'vh'
    marginTop: number
    marginBottom: number
  }
  alignment: 'center' | 'left' | 'right'
  advanced: {
    startTime: number
    language: string
  }
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface CountdownBlockContent {
  title: string
  subtitle: string
  endDate: string // ISO string format
  backgroundImage?: string
  button: {
    text: string
    link: string
    linkType: 'external' | 'internal' | 'block'
    color: string
    hoverColor: string
  }
  alignment: 'center' | 'left' | 'right'
  timerStyle: 'digital' | 'classic'
  timerColors: {
    numbers: string
    labels: string
    background: string
  }
  expiredAction: 'hide' | 'show-message' | 'change-color'
  expiredMessage?: string
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}

export interface HeroBannerBlockContent {
  backgroundImage: string
  title: string
  subtitle: string
  button: {
    text: string
    link: string
    linkType: 'external' | 'internal' | 'block'
    color: string
    hoverColor: string
  }
  alignment: 'left' | 'center' | 'right'
  overlayOpacity: number
  textColor: 'light' | 'dark' | 'custom'
  customTextColor?: string
  animation: 'none' | 'fade' | 'slide' | 'zoom'
  styles?: {
    backgroundColor?: string
    paddingY?: string
    paddingX?: string
    margin?: string
    border?: string
    borderColor?: string
    shadow?: string
    borderRadius?: string
    opacity?: string
    hoverTransform?: string
    textAlign?: string
  }
}