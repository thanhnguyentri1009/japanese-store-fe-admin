export interface Account {
  id: string
  username: string
  email: string
  role?: { id: string; name: string }
}

export interface CreateAccountRequest {
  username: string
  email: string
  password: string
  roleId?: string
}

export interface UpdateAccountRequest {
  username: string
  email?: string
  password?: string
}
