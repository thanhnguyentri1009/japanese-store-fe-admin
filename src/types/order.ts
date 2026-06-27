export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'

export interface OrderItemSummary {
  id: string
  productId?: string
  quantity: number
  unitPrice: number
  product?: { id: string; name: string; price: number }
}

export interface OrderPaymentSummary {
  id: string
  method?: string
  status?: string
  amount?: number
  paidAt?: string
}

export interface OrderAddressSummary {
  id: string
  address: string
  city?: string
  country: string
}

export interface Order {
  id: string
  customerId?: string
  addressId?: string
  status: OrderStatus
  totalAmount?: number
  orderedAt: string
  items: OrderItemSummary[]
  payment?: OrderPaymentSummary
  address?: OrderAddressSummary
}

export interface CreateOrderRequest {
  customerId: string
  addressId?: string
  status?: OrderStatus
  totalAmount?: number
}

export interface UpdateOrderRequest {
  addressId?: string
  status?: OrderStatus
  totalAmount?: number
}
