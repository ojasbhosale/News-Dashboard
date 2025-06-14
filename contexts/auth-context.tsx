"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, provider?: string) => Promise<boolean>
  loginWithOAuth: (provider: "google" | "github") => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, provider = "email"): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, provider }),
      })

      if (response.ok) {
        const { user: userData, token } = await response.json()
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", token)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const loginWithOAuth = async (provider: "google" | "github"): Promise<boolean> => {
    try {
      // Mock OAuth login - in real app, this would redirect to OAuth provider
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: `user@${provider}.com`,
        name: `${provider} User`,
        role: "user",
        provider,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("token", "mock-oauth-token")
      return true
    } catch (error) {
      console.error("OAuth login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithOAuth,
        logout,
        isLoading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
