export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'My Shop'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const COLORS = {
  primary: '#FF6302',
  secondary: '#1E1E1E',
  accent: '#FFD166',
  success: '#22C55E',
  light: '#F6F7FB',
}

export const CATEGORIES = [
  { id: '1', name: 'Canva Templates', slug: 'canva-templates' },
  { id: '2', name: 'UI Kits', slug: 'ui-kits' },
  { id: '3', name: 'Presentation Templates', slug: 'presentation-templates' },
  { id: '4', name: 'Resume Templates', slug: 'resume-templates' },
  { id: '5', name: 'Brand Identity', slug: 'brand-identity' },
  { id: '6', name: 'Mockups', slug: 'mockups' },
  { id: '7', name: 'Icons', slug: 'icons' },
  { id: '8', name: 'Social Media Packs', slug: 'social-media-packs' },
  { id: '9', name: 'Landing Pages', slug: 'landing-pages' },
  { id: '10', name: 'Dashboards', slug: 'dashboards' },
  { id: '11', name: 'Website Templates', slug: 'website-templates' },
  { id: '12', name: 'Printable Products', slug: 'printable-products' },
]

export const FEATURES = [
  {
    icon: '⭐',
    title: 'Professional Quality',
    description: 'Crafted by experienced designers for maximum impact',
  },
  {
    icon: '✏️',
    title: 'Fully Editable',
    description: 'Customize every element to match your brand',
  },
  {
    icon: '⚡',
    title: 'Instant Download',
    description: 'Get access immediately after purchase',
  },
  {
    icon: '🏢',
    title: 'Commercial Use',
    description: 'Use for personal and commercial projects',
  },
  {
    icon: '🔄',
    title: 'Lifetime Updates',
    description: 'Free updates and new versions forever',
  },
  {
    icon: '💬',
    title: 'Dedicated Support',
    description: 'Fast and helpful customer support',
  },
]

export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  ITEMS_PER_PAGE_ADMIN: 20,
}

export const TAX_RATE = 0.08
export const SHIPPING_COST = 0
