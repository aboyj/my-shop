export type UserRole = 'user' | 'seller' | 'admin'
export type ProductStatus = 'draft' | 'published' | 'archived'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  bio?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  price: number
  discountPrice?: number
  categoryId: string
  authorId: string
  downloads: number
  rating: number
  status: ProductStatus
  fileUrl?: string
  fileName?: string
  fileSize?: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  subtotal: number
  tax: number
  discountAmount: number
  status: OrderStatus
  paymentIntentId?: string
  paymentStatus: PaymentStatus
  createdAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Review {
  id: string
  rating: number
  title: string
  content: string
  productId: string
  userId: string
  user?: User
  createdAt: Date
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product?: Product
}
