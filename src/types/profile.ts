export interface Profile {
  id: string
  accountId: string
  fullName: string
  phone?: string
  address?: string
  img?: string
}

export interface UpdateProfileRequest {
  fullName?: string
  phone?: string
  address?: string
  img?: string
}
