export interface OrderItem {
  id: string
  orderId?: string
  productId?: string
  quantity: number
  unitPrice: number
  product?: { id: string; name: string; price: number }
}

export interface CreateOrderItemRequest {
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderItemBulkRequest {
  orderId: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}

export interface UpdateOrderItemRequest {
  orderId?: string
  productId?: string
  quantity?: number
  unitPrice?: number
}
