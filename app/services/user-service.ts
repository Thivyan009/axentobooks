import { User } from "@prisma/client"

interface CreateUserData {
  name: string
  email: string
  role: "ADMIN" | "SUPER_ADMIN"
}

interface UpdateUserData {
  name?: string
  email?: string
  role?: "ADMIN" | "SUPER_ADMIN"
}

export const userService = {
  // Fetch all users
  async getUsers(): Promise<User[]> {
    const response = await fetch("/api/super-admin/users")
    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }
    return response.json()
  },

  // Create a new user
  async createUser(data: CreateUserData): Promise<User> {
    const response = await fetch("/api/super-admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    return response.json()
  },

  // Update a user
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`/api/super-admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update user")
    }
    return response.json()
  },

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/super-admin/users/${userId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete user")
    }
  },

  // Reset user password
  async resetPassword(userId: string): Promise<void> {
    const response = await fetch(`/api/super-admin/users/${userId}/reset-password`, {
      method: "POST",
    })
    if (!response.ok) {
      throw new Error("Failed to reset password")
    }
  },

  // Send email to user
  async sendEmail(userId: string, subject: string, message: string): Promise<void> {
    const response = await fetch(`/api/super-admin/users/${userId}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, message }),
    })
    if (!response.ok) {
      throw new Error("Failed to send email")
    }
  },
} 