export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: User
  expires: string
} 