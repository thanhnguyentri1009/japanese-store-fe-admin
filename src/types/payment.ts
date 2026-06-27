export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnPay'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface Payment {
  id: string
  orderId?: string
  method?: PaymentMethod
  status?: PaymentStatus
  amount?: number
  paidAt?: string
}

export interface CreatePaymentRequest {
  orderId: string
  method?: PaymentMethod
  status?: PaymentStatus
  amount?: number
  paidAt?: string
}

export interface UpdatePaymentRequest {
  method?: PaymentMethod
  status?: PaymentStatus
  amount?: number
  paidAt?: string
}
