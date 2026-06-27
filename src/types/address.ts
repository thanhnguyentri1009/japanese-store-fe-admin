export interface Address {
  id: string
  customerId?: string
  address: string
  city?: string
  country: string
  isDefault: boolean
}

export interface CreateAddressRequest {
  customerId: string
  address: string
  city?: string
  country: string
  isDefault?: boolean
}

export interface UpdateAddressRequest {
  address?: string
  city?: string
  country?: string
  isDefault?: boolean
}
