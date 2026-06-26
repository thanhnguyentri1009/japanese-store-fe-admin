export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export interface JwtPayload {
  sub: string
  username: string
  role: string | { id: string; name: string }
  iat: number
  exp: number
}
